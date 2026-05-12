import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const TUNNEL_URL_FILE = "/tmp/bot-tunnel-url.txt";

function getBotDataUrl(): string {
  try {
    if (process.env.BOT_DATA_URL) return process.env.BOT_DATA_URL;
    const { existsSync, readFileSync } = require("fs");
    if (existsSync(TUNNEL_URL_FILE)) {
      return readFileSync(TUNNEL_URL_FILE, "utf8").trim();
    }
  } catch {}
  return "http://localhost:8788";
}

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  let id = 0;

  // Support Last-Event-ID for resuming streams
  const lastEventId = req.headers.get("last-event-id") || req.nextUrl.searchParams.get("lastEventId");
  if (lastEventId) {
    id = parseInt(lastEventId, 10) || 0;
  }

  let pollInterval: ReturnType<typeof setInterval> | null = null;
  let keepalive: ReturnType<typeof setInterval> | null = null;
  let gracefulClose: ReturnType<typeof setTimeout> | null = null;

  const stream = new ReadableStream({
    start(controller) {
      const sendEvent = (type: string, data: unknown) => {
        try {
          id++;
          const payload = JSON.stringify({ type, data, timestamp: new Date().toISOString(), id });
          controller.enqueue(encoder.encode(`id: ${id}\nevent: message\ndata: ${payload}\n\n`));
        } catch {
          // Controller closed
        }
      };

      // Send init event immediately (synchronous)
      sendEvent("init", { status: "connected", ts: new Date().toISOString(), resumedFrom: lastEventId });

      // Poll bot data every 1 second
      let lastData: string | null = null;
      const pollBot = async () => {
        try {
          const baseUrl = getBotDataUrl();
          const res = await fetch(`${baseUrl}/data`, {
            signal: AbortSignal.timeout(3000),
          });
          if (res.ok) {
            const data = await res.json();
            const dataStr = JSON.stringify(data);
            if (dataStr !== lastData) {
              lastData = dataStr;
              sendEvent("bot_state", data);
            }
          }
        } catch {
          // Silently fail — bot may be offline
        }
      };

      // Fire initial poll after stream starts
      const initialPoll = setTimeout(() => {
        pollBot();
        if (pollInterval) clearInterval(pollInterval);
        pollInterval = setInterval(pollBot, 1000);
      }, 100);

      // Keepalive ping every 15s
      keepalive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: keepalive ${Date.now()}\n\n`));
        } catch {
          if (keepalive) clearInterval(keepalive);
        }
      }, 15000);

      // Vercel Edge timeout safety: close gracefully at 240s
      gracefulClose = setTimeout(() => {
        try {
          sendEvent("reconnect", { reason: "stream_lifetime", nextAttempt: 500 });
          controller.close();
        } catch {}
      }, 240000);

      // Cleanup on cancel
      const cleanup = () => {
        clearTimeout(initialPoll);
        if (pollInterval) clearInterval(pollInterval);
        if (keepalive) clearInterval(keepalive);
        if (gracefulClose) clearTimeout(gracefulClose);
      };

      // Store cleanup on controller for cancel handler
      (controller as any).__cleanup = cleanup;
    },

    cancel(controller) {
      const cleanup = (controller as any).__cleanup;
      if (cleanup) cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
