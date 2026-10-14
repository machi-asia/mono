"use client";

import { useState, useEffect } from "react";

export interface FetchState {
  isLoading: boolean;
  error: Error | null;
}

type FetchListener = (state: FetchState) => void;

class FetchClientStore {
  private activeFetches = new Map<string, number>();
  private listeners = new Set<FetchListener>();

  private notify() {
    const isLoading = this.activeFetches.size > 0;
    this.listeners.forEach((listener) => listener({ isLoading, error: null }));
  }

  start(key: string) {
    const current = this.activeFetches.get(key) || 0;
    this.activeFetches.set(key, current + 1);
    this.notify();
  }

  stop(key: string) {
    const current = this.activeFetches.get(key) || 0;
    if (current <= 1) {
      this.activeFetches.delete(key);
    } else {
      this.activeFetches.set(key, current - 1);
    }
    this.notify();
  }

  subscribe(listener: FetchListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  getIsLoading(key?: string): boolean {
    if (key) {
      return (this.activeFetches.get(key) || 0) > 0;
    }
    return this.activeFetches.size > 0;
  }
}

export const fetchStore = new FetchClientStore();

export interface AppFetchOptions extends RequestInit {
  key?: string;
}

export interface AppFetchResponse<T> {
  data: T | null;
  error: Error | null;
  response: Response;
}

export async function appFetch<T = any>(
  input: RequestInfo | URL,
  init?: AppFetchOptions
): Promise<AppFetchResponse<T>> {
  const urlKey = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  const key = init?.key || urlKey;

  fetchStore.start(key);

  try {
    const response = await fetch(input, init);

    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}: ${response.statusText}`;
      try {
        const errJson = await response.json();
        if (errJson && errJson.error) {
          errorMessage = typeof errJson.error === "string" ? errJson.error : JSON.stringify(errJson.error);
        } else if (errJson && errJson.message) {
          errorMessage = typeof errJson.message === "string" ? errJson.message : JSON.stringify(errJson.message);
        }
      } catch {
        // Fallback to status text
      }
      return { data: null, error: new Error(errorMessage), response };
    }

    let data: T | null = null;
    try {
      const contentType = response.headers?.get?.("content-type");
      if (!contentType || contentType.includes("application/json")) {
        data = await response.json();
      }
    } catch {
      // Empty or non-JSON body
    }

    return { data, error: null, response };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error(String(err));
    return { data: null, error, response: new Response(null, { status: 500 }) };
  } finally {
    fetchStore.stop(key);
  }
}

export function useAppFetchState(key?: string) {
  const [loading, setLoading] = useState(() => fetchStore.getIsLoading(key));

  useEffect(() => {
    return fetchStore.subscribe(() => {
      setLoading(fetchStore.getIsLoading(key));
    });
  }, [key]);

  return { loading };
}
