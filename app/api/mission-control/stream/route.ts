import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Bot tunnel URL — updated by the bot on startup via a state file
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

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (type: string, data: unknown) => {
        try {
          id++;
          const payload = JSON.stringify({ type, data, timestamp: new Date().toISOString(), id });
          controller.enqueue(encoder.encode(`id: ${id}\nevent: message\ndata: ${payload}\n\n`));
        } catch {}
      };

      // Send init event immediately
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
        } catch {}
      };

      // Send bot data immediately then every 1s
      await pollBot();
      const pollInterval = setInterval(pollBot, 1000);

      // Keepalive ping every 15s
      const keepalive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: keepalive ${Date.now()}\n\n`));
        } catch {
          clearInterval(keepalive);
        }
      }, 15000);

      // Vercel Edge timeout safety: close gracefully at 240s
      const gracefulClose = setTimeout(() => {
        try {
          sendEvent("reconnect", { reason: "stream_lifetime", nextAttempt: 500 });
          controller.close();
        } catch {}
      }, 240000);

      // Cleanup on close
      return () => {
        clearInterval(pollInterval);
        clearInterval(keepalive);
        clearTimeout(gracefulClose);
      };
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
