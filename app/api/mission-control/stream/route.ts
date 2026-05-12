import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/*═══════════════════════════════════════════
  ATHENA MISSION CONTROL — SSE BACKEND ENDPOINT
  Protocol: text/event-stream
  Tick Rate: 1 second
  ═══════════════════════════════════════════*/

const TUNNEL_URL_FILE = "/tmp/bot-tunnel-url.txt";

function getBotDataUrl(): string {
  try {
    if (process.env.BOT_DATA_URL) return process.env.BOT_DATA_URL;
    const { existsSync, readFileSync } = require("fs");
    if (existsSync(TUNNEL_URL_FILE)) {
      return readFileSync(TUNNEL_URL_FILE, "utf8").trim();
    }
  } catch {}
  return "";
}

/*───────────────────────────────────────────
   IN-MEMORY SIMULATION STATE
   ───────────────────────────────────────────*/
const state = {
  equity: 1000.0,
  equityHistory: Array(30).fill(1000.0),
  winRate: 55.0,
  totalTrades: 0,
  dailyPnl: 0.0,
  totalPnl: 0.0,
  signals: [] as any[],
  sentiment: { fearGreed: 50, socialVolume: 1000, trend: "NEUTRAL" as string },
  agent: { status: "ONLINE", apiLatency: 20, uptime: 0, cpu: 10.0, memory: 30.0 },
  risk: { currentDrawdown: 0.0, maxDrawdown: 0.0, var: 5.0, openPositions: 0, maxPositions: 5 },
  logs: [
    { level: "INFO", message: "SYSTEM INITIALIZED — ATHENA V2 ONLINE", timestamp: new Date().toISOString() },
  ],
};

const TOKENS = ["BONK", "WIF", "PEPE", "FLOKI", "GIGA", "BABYTROLL", "LOBSTERMODE"];
const TRENDS = ["BULLISH", "BEARISH", "NEUTRAL"];

function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/*───────────────────────────────────────────
   STATE EVOLUTION LOGIC — 1-second tick
   ───────────────────────────────────────────*/
function evolveState() {
  // Agent vitals
  state.agent.uptime += 1;
  state.agent.apiLatency = randomInt(15, 120);
  state.agent.cpu = Math.min(100, Math.max(5, state.agent.cpu + randomFloat(-2, 2)));
  state.agent.memory = Math.min(100, Math.max(10, state.agent.memory + randomFloat(-1, 1)));

  // Market micro-movements
  const marketMove = randomFloat(-5, 8);
  state.equity = Math.max(100, state.equity + marketMove);
  state.equityHistory.shift();
  state.equityHistory.push(state.equity);
  state.dailyPnl = state.equity - 1000;
  state.totalPnl = state.dailyPnl;

  // Drawdown
  const peak = Math.max(...state.equityHistory);
  state.risk.currentDrawdown = peak > 0 ? ((peak - state.equity) / peak) * 100 : 0;
  state.risk.maxDrawdown = Math.max(state.risk.maxDrawdown, state.risk.currentDrawdown);

  // Sentiment
  state.sentiment.fearGreed = Math.min(100, Math.max(0, state.sentiment.fearGreed + randomInt(-5, 5)));
  state.sentiment.socialVolume = Math.max(0, state.sentiment.socialVolume + randomInt(-200, 300));
  if (Math.random() > 0.9) {
    state.sentiment.trend = TRENDS[randomInt(0, 2)];
  }

  // Signal generation (low frequency)
  if (Math.random() > 0.85) {
    const type = Math.random() > 0.5 ? "BUY" : "SELL";
    const token = TOKENS[randomInt(0, TOKENS.length - 1)];
    const confidence = randomFloat(0.6, 0.99);
    const signal = {
      id: `sig_${Date.now()}_${randomInt(1000, 9999)}`,
      type,
      token,
      confidence: parseFloat(confidence.toFixed(2)),
      timestamp: new Date().toISOString(),
    };
    state.signals.unshift(signal);
    if (state.signals.length > 20) state.signals.pop();

    state.logs.unshift({
      level: "INFO",
      message: `SIGNAL: ${type} ${token} (Confidence: ${(confidence * 100).toFixed(0)}%)`,
      timestamp: new Date().toISOString(),
    });
  }

  // Trade execution
  if (Math.random() > 0.93) {
    const isWin = Math.random() > 0.4;
    const pnl = isWin ? randomFloat(5, 25) : randomFloat(-15, -2);
    state.equity += pnl;
    state.totalTrades++;
    state.winRate = (state.winRate * (state.totalTrades - 1) + (isWin ? 100 : 0)) / state.totalTrades;
    state.risk.openPositions = randomInt(0, state.risk.maxPositions);

    state.logs.unshift({
      level: isWin ? "SUCCESS" : "WARN",
      message: `EXECUTED: Trade #${state.totalTrades} — P&L $${pnl.toFixed(2)}`,
      timestamp: new Date().toISOString(),
    });
  }

  // VaR random walk
  state.risk.var = Math.max(0.1, state.risk.var + randomFloat(-0.5, 0.5));

  // Prune logs
  if (state.logs.length > 50) state.logs.pop();

  return {
    timestamp: new Date().toISOString(),
    trading: {
      equity: parseFloat(state.equity.toFixed(2)),
      equityHistory: state.equityHistory.map((v) => parseFloat(v.toFixed(2))),
      winRate: parseFloat(state.winRate.toFixed(1)),
      totalTrades: state.totalTrades,
      dailyPnl: parseFloat(state.dailyPnl.toFixed(2)),
      totalPnl: parseFloat(state.totalPnl.toFixed(2)),
    },
    signals: state.signals,
    sentiment: state.sentiment,
    agent: {
      ...state.agent,
      cpu: parseFloat(state.agent.cpu.toFixed(1)),
      memory: parseFloat(state.agent.memory.toFixed(1)),
    },
    risk: {
      currentDrawdown: parseFloat(state.risk.currentDrawdown.toFixed(2)),
      maxDrawdown: parseFloat(state.risk.maxDrawdown.toFixed(2)),
      var: parseFloat(state.risk.var.toFixed(2)),
      openPositions: state.risk.openPositions,
      maxPositions: state.risk.maxPositions,
    },
    logs: state.logs,
  };
}

/*───────────────────────────────────────────
   NEXT.JS APP ROUTER HANDLER
   ───────────────────────────────────────────*/
export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  let id = 0;

  // Support Last-Event-ID for resuming streams
  const lastEventId = req.headers.get("last-event-id") || req.nextUrl.searchParams.get("lastEventId");
  if (lastEventId) {
    id = parseInt(lastEventId, 10) || 0;
  }

  let interval: ReturnType<typeof setInterval> | null = null;
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

      // Burst initial simulation data
      sendEvent("bot_state", evolveState());

      // 1-second tick
      interval = setInterval(() => {
        sendEvent("bot_state", evolveState());
      }, 1000);

      // Keepalive ping every 15s
      keepalive = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(`: keepalive ${Date.now()}\n\n`));
        } catch {
          if (keepalive) clearInterval(keepalive);
        }
      }, 15000);

      // Graceful close at 240s (Vercel Edge limit)
      gracefulClose = setTimeout(() => {
        try {
          sendEvent("reconnect", { reason: "stream_lifetime", nextAttempt: 500 });
          controller.close();
        } catch {}
      }, 240000);

      (controller as any).__cleanup = () => {
        if (interval) clearInterval(interval);
        if (keepalive) clearInterval(keepalive);
        if (gracefulClose) clearTimeout(gracefulClose);
      };
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
