import type { SyncEventPayload } from "../types";
import { sendSyncEvent } from "./dress";

export type TransportProtocol = "udp-webrtc" | "sse";

export interface SyncTransportOptions {
  roomId: string;
  userId: string;
  userName?: string;
  signalingUrl?: string;
  onEventReceived?: (event: SyncEventPayload) => void;
  onMemberChange?: (members: string[]) => void;
  onStatusChange?: (connected: boolean, protocol: TransportProtocol) => void;
}

export interface SyncTransport {
  protocol: TransportProtocol;
  connected: boolean;
  send(event: SyncEventPayload): void;
  connect(): void;
  disconnect(): void;
}

/**
 * WebRTC UDP DataChannel transport (unreliable & unordered: maxRetransmits=0, ordered=false).
 * Emulates raw UDP datagrams in the browser for minimum latency and zero head-of-line blocking.
 *
 * Uses a lightweight signaling channel (the SSE/POST endpoint) to exchange SDP offers/answers and ICE candidates.
 */
export class WebRTCUDPTransport implements SyncTransport {
  protocol: TransportProtocol = "udp-webrtc";
  connected = false;

  private peerConnection: RTCPeerConnection | null = null;
  private dataChannel: RTCDataChannel | null = null;
  private options: SyncTransportOptions;
  private sseSource: EventSource | null = null;
  private isDestroyed = false;
  private pendingCandidates: RTCIceCandidateInit[] = [];

  constructor(options: SyncTransportOptions) {
    this.options = options;
  }

  connect(): void {
    if (typeof window === "undefined") return;
    this.isDestroyed = false;

    // First establish signaling via SSE stream
    const signalingUrl = this.options.signalingUrl || "/api/sync/events";
    const url = `${signalingUrl}?roomId=${encodeURIComponent(
      this.options.roomId
    )}&userId=${encodeURIComponent(this.options.userId)}&userName=${encodeURIComponent(
      this.options.userName || "Guest"
    )}`;

    this.sseSource = new EventSource(url);

    this.sseSource.onopen = () => {
      // Signaling channel open
      if (!this.connected) {
        this.options.onStatusChange?.(true, "sse");
      }
    };

    this.sseSource.onerror = () => {
      if (!this.connected) {
        this.options.onStatusChange?.(false, this.protocol);
      }
    };

    this.sseSource.addEventListener("sync-event", (e: MessageEvent) => {
      try {
        const raw = JSON.parse(e.data);
        const events: SyncEventPayload[] = Array.isArray(raw) ? raw : [raw];

        for (const evt of events) {
          // Check if event is WebRTC signaling
          if (evt.trigger === "webrtc_signal" && evt.payload) {
            this.handleSignalingMessage(evt.payload);
            continue;
          }

          // If DataChannel is not connected yet, accept events through signaling fallback
          if (!this.connected) {
            this.options.onEventReceived?.(evt);
          }
        }
      } catch (err) {
        console.warn("[WebRTCUDPTransport] Error handling SSE event:", err);
      }
    });

    this.sseSource.addEventListener("room-members", (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        const memberList = Array.isArray(data.members) ? data.members : [];
        this.options.onMemberChange?.(memberList);

        // If another member is present and we haven't initiated WebRTC, initiate offer
        if (memberList.length > 1 && !this.peerConnection && typeof RTCPeerConnection !== "undefined") {
          // Deterministic initiator: the alphabetically smaller userId initiates
          const otherUsers = memberList.filter((u: string) => u !== this.options.userId);
          if (otherUsers.length > 0) {
            const targetUser = otherUsers[0];
            if (this.options.userId < targetUser) {
              this.initiatePeerConnection(targetUser);
            }
          }
        }
      } catch (err) {
        console.warn("[WebRTCUDPTransport] Error handling room members:", err);
      }
    });
  }

  private setupPeerConnection(targetUser: string): RTCPeerConnection {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignal({
          type: "candidate",
          candidate: event.candidate,
          from: this.options.userId,
          to: targetUser,
        });
      }
    };

    pc.ondatachannel = (event) => {
      this.bindDataChannel(event.channel);
    };

    this.peerConnection = pc;
    return pc;
  }

  private bindDataChannel(channel: RTCDataChannel): void {
    this.dataChannel = channel;

    channel.onopen = () => {
      this.connected = true;
      this.protocol = "udp-webrtc";
      this.options.onStatusChange?.(true, "udp-webrtc");
    };

    channel.onclose = () => {
      this.connected = false;
      this.options.onStatusChange?.(true, "sse"); // Fall back to signaling SSE
    };

    channel.onerror = (err) => {
      console.warn("[WebRTC DataChannel] Error:", err);
    };

    channel.onmessage = (event) => {
      try {
        const raw = JSON.parse(event.data);
        const events: SyncEventPayload[] = Array.isArray(raw) ? raw : [raw];
        for (const ev of events) {
          this.options.onEventReceived?.(ev);
        }
      } catch (err) {
        console.warn("[WebRTC DataChannel] Parse error:", err);
      }
    };
  }

  private async initiatePeerConnection(targetUser: string) {
    try {
      const pc = this.setupPeerConnection(targetUser);

      // Create an UNRELIABLE + UNORDERED UDP DataChannel
      // maxRetransmits: 0 -> pure UDP datagram semantics (no head-of-line blocking!)
      // ordered: false -> deliver instantly upon arrival
      const channel = pc.createDataChannel("game_udp", {
        ordered: false,
        maxRetransmits: 0,
      });
      this.bindDataChannel(channel);

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      this.sendSignal({
        type: "offer",
        sdp: offer,
        from: this.options.userId,
        to: targetUser,
      });
    } catch (err) {
      console.warn("[WebRTCUDPTransport] Failed to initiate peer connection:", err);
    }
  }

  private async flushPendingCandidates(): Promise<void> {
    if (!this.peerConnection || !this.peerConnection.remoteDescription) return;
    const candidates = [...this.pendingCandidates];
    this.pendingCandidates = [];
    for (const cand of candidates) {
      try {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(cand));
      } catch (err) {
        console.warn("[WebRTCUDPTransport] Failed to add buffered ICE candidate:", err);
      }
    }
  }

  private async handleSignalingMessage(msg: any) {
    if (this.isDestroyed || !msg) return;
    if (msg.to && msg.to !== this.options.userId) return;

    try {
      if (msg.type === "offer" && typeof RTCPeerConnection !== "undefined") {
        const pc = this.setupPeerConnection(msg.from);
        await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        await this.flushPendingCandidates();
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        this.sendSignal({
          type: "answer",
          sdp: answer,
          from: this.options.userId,
          to: msg.from,
        });
      } else if (msg.type === "answer" && this.peerConnection) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(msg.sdp));
        await this.flushPendingCandidates();
      } else if (msg.type === "candidate") {
        if (this.peerConnection && this.peerConnection.remoteDescription) {
          await this.peerConnection.addIceCandidate(new RTCIceCandidate(msg.candidate));
        } else {
          this.pendingCandidates.push(msg.candidate);
        }
      }
    } catch (err) {
      console.warn("[WebRTCUDPTransport] Signaling message error:", err);
    }
  }

  private sendSignal(signalPayload: Record<string, unknown>) {
    const signalingUrl = this.options.signalingUrl || "/api/sync/events";
    const evt: SyncEventPayload = {
      eventId: `sig_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      roomId: this.options.roomId,
      userId: this.options.userId,
      phase: "press",
      inputType: "custom",
      trigger: "webrtc_signal",
      payload: signalPayload,
      timestamp: Date.now(),
    };

    fetch(signalingUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(evt),
    }).catch(() => {});
  }

  send(event: SyncEventPayload): void {
    // If WebRTC UDP DataChannel is open, blast packet instantly with 0ms buffering
    if (this.connected && this.dataChannel && this.dataChannel.readyState === "open") {
      try {
        this.dataChannel.send(JSON.stringify(event));
        return;
      } catch (err) {
        console.warn("[WebRTCUDPTransport] DataChannel send failed, falling back to signaling:", err);
      }
    }

    // Fallback if DataChannel still negotiating: route to batched HTTP endpoint to avoid connection pool exhaustion
    const signalingUrl = this.options.signalingUrl || "/api/sync/events";
    sendSyncEvent(event.phase, event.inputType, event.trigger, {
      actionId: event.actionId,
      payload: event.payload,
      roomId: event.roomId,
      userId: event.userId,
      apiEndpoint: signalingUrl,
      immediate: event.actionId !== "player_move" && event.actionId !== "player_input",
    }).catch(() => {});
  }

  disconnect(): void {
    this.isDestroyed = true;
    if (this.dataChannel) {
      try {
        this.dataChannel.close();
      } catch {}
      this.dataChannel = null;
    }
    if (this.peerConnection) {
      try {
        this.peerConnection.close();
      } catch {}
      this.peerConnection = null;
    }
    if (this.sseSource) {
      this.sseSource.close();
      this.sseSource = null;
    }
    this.connected = false;
  }
}
