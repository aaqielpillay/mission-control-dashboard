// lib/sse.ts — SSE client and server helpers
import type { SSEPayload } from "./types";

export function parseSSEMessage(data: string): SSEPayload | null {
  try {
    return JSON.parse(data) as SSEPayload;
  } catch {
    return null;
  }
}

export function formatSSEEvent(id: number, payload: SSEPayload): string {
  return `id: ${id}\ndata: ${JSON.stringify(payload)}\n\n`;
}

export function getInitialSSEPayload(): SSEPayload {
  return {
    type: "init",
    data: { status: "connected", ts: new Date().toISOString() },
    timestamp: new Date().toISOString(),
    id: 0,
  };
}
