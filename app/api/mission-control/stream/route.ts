import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const encoder = new TextEncoder();
  let id = 0;

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (type: string, data: unknown) => {
        const payload = JSON.stringify({ type, data, timestamp: new Date().toISOString(), id: ++id });
        controller.enqueue(encoder.encode(`id: ${id}\ndata: ${payload}\n\n`));
      };

      // Send initial connection event
      sendEvent("init", { status: "connected", ts: new Date().toISOString() });

      // Try to fetch real data from bot API, fall back to mock
      let realData: unknown = null;
      try {
        const res = await fetch("http://localhost:8788/data", {
          signal: AbortSignal.timeout(2000),
        });
        if (res.ok) {
          realData = await res.json();
        }
      } catch {
        // Bot not reachable — use mock data
      }

      if (realData) {
        sendEvent("bot_state", realData);
      }

      // Mock event generator — simulates live dashboard activity
      const mockEvents = [
        () => sendEvent("activity", { agentId: "athena", agentName: "Athena", action: "SSE stream connected — Mission Control live", type: "info" }),
        () => sendEvent("tick", { ts: new Date().toISOString() }),
        () => sendEvent("signal", {
          id: `sig-${Date.now()}`,
          source: Math.random() > 0.5 ? "BOBNET T1" : "BOBNET T2",
          token: ["BABYTROLL", "LOBSTERMODE", "FLOKI", "PEPE"][Math.floor(Math.random() * 4)],
          mint: "mockMint123",
          aiScore: 20 + Math.floor(Math.random() * 25),
          direction: Math.random() > 0.5 ? "buy" : "sell",
          confidence: 50 + Math.floor(Math.random() * 50),
          timestamp: new Date().toISOString(),
          executed: Math.random() > 0.5,
        }),
        () => sendEvent("activity", {
          agentId: "bobnet",
          agentName: "BOBNET Listener",
          action: "New signal detected on T2 channel",
          type: "warning",
        }),
        () => sendEvent("comms", {
          id: `comm-${Date.now()}`,
          senderId: "hermes",
          recipientId: "cross-ref",
          content: "Cross-referencing latest signal...",
          timestamp: new Date().toISOString(),
        }),
        () => sendEvent("position_update", {
          token: "BABYTROLL",
          currentPrice: 0.00000089 + (Math.random() * 0.0000001 - 0.00000005),
          pnlPercent: 5 + Math.random() * 5,
        }),
        () => sendEvent("activity", {
          agentId: "exit-manager",
          agentName: "Exit Manager",
          action: "Trailing stop still armed — monitoring BABYTROLL",
          type: "info",
        }),
      ];

      let eventIdx = 0;
      const interval = setInterval(() => {
        try {
          mockEvents[eventIdx % mockEvents.length]();
          eventIdx++;
        } catch {
          clearInterval(interval);
          controller.close();
        }
      }, 3000);

      // Keepalive ping every 15s
      const keepalive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: keepalive ${Date.now()}\n\n`));
        } catch {
          clearInterval(keepalive);
        }
      }, 15000);

      // Cleanup on close
      return () => {
        clearInterval(interval);
        clearInterval(keepalive);
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
