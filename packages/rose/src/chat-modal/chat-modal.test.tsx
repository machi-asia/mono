import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  RoseChatModalProvider,
  RoseChatModal,
  RoseChatModalActionButton,
  RoseChatModalFloatingButton,
  RoseChat,
} from "./chat-modal";
import { MockAuthProvider } from "@mono/auth/mock";

// Mock scrollIntoView for jsdom
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe("Rose Chat Modal & Interface", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("opens modal via Action Button and closes via close button", () => {
    render(
      <MockAuthProvider state="signed-in">
        <RoseChatModalProvider>
          <RoseChatModalActionButton label="Open Assistant" />
          <RoseChatModal title="Rose Test Assistant" />
        </RoseChatModalProvider>
      </MockAuthProvider>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    const triggerBtn = screen.getByRole("button", { name: /Open Assistant/i });
    fireEvent.click(triggerBtn);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Rose Test Assistant")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: /Close chat/i });
    fireEvent.click(closeBtn);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens modal via Floating Action Button (FAB)", () => {
    render(
      <MockAuthProvider state="signed-in">
        <RoseChatModalProvider>
          <RoseChatModalFloatingButton ariaLabel="Open Chat" badgeText="AI" />
          <RoseChatModal title="Rose FAB Assistant" />
        </RoseChatModalProvider>
      </MockAuthProvider>
    );

    const fabBtn = screen.getByRole("button", { name: /Open Chat/i });
    expect(screen.getByText("AI")).toBeInTheDocument();

    fireEvent.click(fabBtn);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders RoseChat component with initial welcome message and input area", () => {
    render(
      <MockAuthProvider state="signed-in">
        <RoseChat
          title="Rose Standalone"
          subtitle="Companion Mode"
          placeholder="Type here..."
          showUsage={false}
        />
      </MockAuthProvider>
    );

    expect(screen.getByText("Rose Standalone")).toBeInTheDocument();
    expect(screen.getByText("Companion Mode")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Type here...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send message/i })).toBeInTheDocument();
  });

  it("renders conversation side panel, allows toggling, creating, and deleting chats", () => {
    render(
      <MockAuthProvider state="signed-in">
        <RoseChat
          title="Rose Chat"
          showUsage={false}
          defaultSidebarOpen={true}
        />
      </MockAuthProvider>
    );

    // Verify side panel is visible
    expect(screen.getByRole("complementary", { name: /Conversation history/i })).toBeInTheDocument();
    expect(screen.getByText("Chats")).toBeInTheDocument();

    // Toggle side panel off
    const toggleBtn = screen.getByRole("button", { name: /Hide conversations panel/i });
    fireEvent.click(toggleBtn);
    expect(screen.queryByRole("complementary", { name: /Conversation history/i })).not.toBeInTheDocument();

    // Toggle side panel back on
    const showToggleBtn = screen.getByRole("button", { name: /Show conversations panel/i });
    fireEvent.click(showToggleBtn);
    expect(screen.getByRole("complementary", { name: /Conversation history/i })).toBeInTheDocument();

    // Create a new chat from header
    const newChatBtn = screen.getByRole("button", { name: /Start new conversation/i });
    fireEvent.click(newChatBtn);

    // Verify 2 conversation list items
    const listItems = screen.getAllByRole("listitem");
    expect(listItems.length).toBe(2);

    // Delete one conversation
    const deleteBtns = screen.getAllByRole("button", { name: /Delete conversation/i });
    fireEvent.click(deleteBtns[0]);

    // Verify 1 remaining conversation
    expect(screen.getAllByRole("listitem").length).toBe(1);
  });

  it("renders Settings button under conversations list and opens Settings modal with personalization and memories", () => {
    render(
      <MockAuthProvider state="signed-in">
        <RoseChat
          title="Rose Chat"
          showUsage={false}
          defaultSidebarOpen={true}
        />
      </MockAuthProvider>
    );

    // Verify Settings button exists in the sidebar
    const settingsBtn = screen.getByRole("button", { name: /Open Settings/i });
    expect(settingsBtn).toBeInTheDocument();

    // Click Settings
    fireEvent.click(settingsBtn);

    // Settings dialog is displayed
    expect(screen.getByRole("dialog", { name: /Rose Settings/i })).toBeInTheDocument();
    expect(screen.getByText("Personalization")).toBeInTheDocument();
    expect(screen.getByText(/Memories/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Captain, Alex, Sensei/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Warm & Helpful/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/What would you like Rose to know about you/i)).toBeInTheDocument();

    // Switch to Memories tab
    const memoriesTab = screen.getByRole("tab", { name: /Memories/i });
    fireEvent.click(memoriesTab);
    expect(screen.getByText(/Memories automatically gathered by Rose or added by you/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add Memory/i })).toBeInTheDocument();

    // Close settings dialog
    const closeSettingsBtn = screen.getByRole("button", { name: /Close Settings/i });
    fireEvent.click(closeSettingsBtn);
    expect(screen.queryByRole("dialog", { name: /Rose Settings/i })).not.toBeInTheDocument();
  });

  it("renders Voice Mode button near submit button and toggles Voice Mode overlay", () => {
    // Mock speech APIs for jsdom
    (globalThis as any).window.SpeechRecognition = class {
      start = vi.fn();
      stop = vi.fn();
      abort = vi.fn();
    };
    (globalThis as any).window.speechSynthesis = {
      speak: vi.fn(),
      cancel: vi.fn(),
      getVoices: vi.fn().mockReturnValue([]),
    };

    render(
      <MockAuthProvider state="signed-in">
        <RoseChat
          title="Rose Chat"
          showUsage={false}
          defaultSidebarOpen={false}
        />
      </MockAuthProvider>
    );

    // Verify Voice Mode button exists in input bar
    const voiceBtn = screen.getByRole("button", { name: /Start Voice Mode/i });
    expect(voiceBtn).toBeInTheDocument();

    // Click Voice Mode button
    fireEvent.click(voiceBtn);

    // Voice Mode overlay dialog appears
    const voiceOverlay = screen.getByRole("dialog", { name: /Rose Voice Mode/i });
    expect(voiceOverlay).toBeInTheDocument();
    expect(screen.getByText("Voice Mode")).toBeInTheDocument();
    expect(screen.getByAltText("Rose Voice Avatar")).toBeInTheDocument();

    // Close Voice Mode via close button in overlay
    const closeVoiceBtn = screen.getByRole("button", { name: /Close Voice Mode Overlay/i });
    fireEvent.click(closeVoiceBtn);
    expect(screen.queryByRole("dialog", { name: /Rose Voice Mode/i })).not.toBeInTheDocument();
  });
});

