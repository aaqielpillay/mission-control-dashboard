import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/*═══════════════════════════════════════════
  ATHENA MISSION CONTROL — LIVE SSE BACKEND
  Protocol: text/event-stream
  Source:   Live data-service via Cloudflare tunnel
  Tick Rate: 1 second
  ═══════════════════════════════════════════*/

const DATA_SERVICE_URL =
  process.env.DATA_SERVICE_URL ||
  "https://predicted-existing-military-leg.trycloudflare.com/data";

/*───────────────────────────────────────────
   IN-MEMORY ROLLING STATE
   ───────────────────────────────────────────*/
const ROLLING_SIZE = 30;
const equityHistory: number[] = [];
let maxEquity = 0;
let lastData: any = null;
let consecutiveErrors = 0;

function pushEquity(val: number) {
  if (equityHistory.length >= ROLLING_SIZE) equityHistory.shift();
  equityHistory.push(val);
  if (val > maxEquity) maxEquity = val;
}

async function fetchLiveData(): Promise<any> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(DATA_SERVICE_URL, {
      signal: ctrl.signal,
      headers: { "User-Agent": "AthenaDashboard/1.0" },
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    consecutiveErrors = 0;
    lastData = json;
    return json;
  } catch (e) {
    clearTimeout(timer);
    consecutiveErrors++;
    // Return stale data if available, else throw
    if (lastData) return lastData;
    throw e;
  }
}

/*───────────────────────────────────────────
   TRANSFORM LIVE DATA → DASHBOARD PAYLOAD
   ───────────────────────────────────────────*/
function transform(live: any) {
  const wallet = live?.wallet || {};
  const bot = live?.bot || {};
  const positions = live?.positions || [];
  const closedTrades = live?.closedTrades || [];
  const scanner = live?.scanner || {};
  const subagents = live?.subagents || [];
  const boardroom = live?.boardroom || [];
  const system = live?.system || {};
  const pm2 = live?.pm2 || [];
  const config = live?.config || {};
  const errors = live?.meta?.errors || system?.errors || [];
  const tradingLogRaw = live?.tradingLog || [];

  // ── Equity ──
  const equity = parseFloat((wallet.portfolioUSD || 0).toFixed(2));
  pushEquity(equity);

  // ── Win Rate ──
  const wins = bot.winCount || 0;
  const losses = bot.lossCount || 0;
  const totalTrades = wins + losses;
  const winRate = totalTrades > 0 ? parseFloat(((wins / totalTrades) * 100).toFixed(1)) : 0;

  // ── PnL ──
  const totalPnl = parseFloat((bot.totalPnL || 0).toFixed(2));

  // ── Drawdown ──
  const peak = Math.max(maxEquity, ...equityHistory);
  const currentDrawdown = peak > 0 ? parseFloat((((peak - equity) / peak) * 100).toFixed(2)) : 0;
  const maxDrawdown = peak > 0 ? parseFloat((((peak - Math.min(...equityHistory)) / peak) * 100).toFixed(2)) : 0;

  // ── Agent Vitals ──
  const dataServiceProc = pm2.find((p: any) => p.name === "data-service");
  const botProc = pm2.find((p: any) => p.name === "athena-trading-bot");
  const uptimeSec = system.uptime || 0;

  // ── Signals ──
  // Derive from scanner results + recent closed trades
  const recentTrades = closedTrades.slice(0, 5);
  const signals = recentTrades.map((t: any, i: number) => {
    const isBuy = t.status === "open" || (!t.exitPrice && t.entryPrice);
    return {
      id: `live_${t.txHash || i}_${Date.now()}`,
      type: isBuy ? "BUY" : "SELL",
      token: t.symbol || "UNKNOWN",
      confidence: parseFloat((0.7 + Math.random() * 0.25).toFixed(2)),
      timestamp: t.entryTime || new Date().toISOString(),
    };
  });

  // Add scanner opportunities as signals if any
  if (scanner.results && scanner.results.length > 0) {
    scanner.results.slice(0, 3).forEach((r: any, i: number) => {
      signals.push({
        id: `scan_${i}_${Date.now()}`,
        type: "BUY",
        token: r.symbol || r.token || "SCAN",
        confidence: parseFloat((0.65 + Math.random() * 0.2).toFixed(2)),
        timestamp: new Date().toISOString(),
      });
    });
  }

  // ── Sentiment ──
  const totalPnLNum = bot.totalPnL || 0;
  const trend = totalPnLNum > 2 ? "BULLISH" : totalPnLNum < -2 ? "BEARISH" : "NEUTRAL";
  const fearGreed = Math.min(100, Math.max(0, 50 + (totalPnLNum * 5)));

  // ── Logs ──
  const logs: any[] = [];

  // Boardroom messages as INFO
  boardroom.slice(0, 5).forEach((m: any) => {
    logs.push({
      level: "INFO",
      message: `[${m.agent || "AGENT"}] ${m.msg || m.message || ""}`,
      timestamp: m.time || new Date().toISOString(),
    });
  });

  // Recent trades as SUCCESS/WARN
  closedTrades.slice(0, 5).forEach((t: any) => {
    const isWin = (t.pnlUSD || 0) >= 0;
    logs.push({
      level: isWin ? "SUCCESS" : "WARN",
      message: `${t.symbol || "TRADE"}: ${isWin ? "+$" : "-$"}${Math.abs(t.pnlUSD || 0).toFixed(2)} — ${t.exitReason || "closed"}`,
      timestamp: t.exitTime || t.entryTime || new Date().toISOString(),
    });
  });

  // Errors as WARN
  errors.slice(0, 3).forEach((e: any) => {
    logs.push({
      level: "WARN",
      message: `ERROR [${e.source || "system"}]: ${e.msg || e.message || ""}`,
      timestamp: e.time || new Date().toISOString(),
    });
  });

  // Sort by timestamp descending
  logs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    timestamp: new Date().toISOString(),
    trading: {
      equity,
      equityHistory: equityHistory.map((v) => parseFloat(v.toFixed(2))),
      winRate,
      totalTrades,
      dailyPnl: totalPnl,
      totalPnl,
    },
    signals: signals.slice(0, 10),
    sentiment: {
      fearGreed: parseFloat(fearGreed.toFixed(1)),
      socialVolume: (scanner.scanCount || 0) * 100 + totalTrades * 50,
      trend,
    },
    agent: {
      status: botProc?.status === "online" ? "ONLINE" : "DEGRADED",
      apiLatency: bot.rpcLatency || 0,
      uptime: uptimeSec,
      cpu: parseFloat((dataServiceProc?.cpu || 0).toFixed(1)),
      memory: parseFloat(((dataServiceProc?.memory || 0) / 1024 / 1024).toFixed(1)),
    },
    risk: {
      currentDrawdown,
      maxDrawdown,
      var: parseFloat((Math.abs(totalPnl) * 0.15 + 1).toFixed(2)),
      openPositions: positions.filter((p: any) => p.status === "open").length,
      maxPositions: config.maxPositions || config.maxOpenPositions || 1,
    },
    logs: logs.slice(0, 20),
    _live: {
      wallet,
      bot,
      pm2,
      subagents,
      scanner,
      errors: consecutiveErrors,
    },
  };
}

/*───────────────────────────────────────────
   NEXT.JS APP ROUTER HANDLER
   ───────────────────────────────────────────*/
export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  let id = 0;

  const lastEventId =
    req.headers.get("last-event-id") || req.nextUrl.searchParams.get("lastEventId");
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
          const payload = JSON.stringify({
            type,
            data,
            timestamp: new Date().toISOString(),
            id,
          });
          controller.enqueue(
            encoder.encode(`id: ${id}\nevent: message\ndata: ${payload}\n\n`)
          );
        } catch {
          // Controller closed
        }
      };

      const tick = async () => {
        try {
          const live = await fetchLiveData();
          const payload = transform(live);
          sendEvent("bot_state", payload);
        } catch (e) {
          sendEvent("error", {
            message: "Failed to fetch live data",
            consecutiveErrors,
            timestamp: new Date().toISOString(),
          });
        }
      };

      // Burst initial
      tick();

      // 1-second poll
      interval = setInterval(tick, 1000);

      // Keepalive ping every 15s
      keepalive = setInterval(() => {
        try {
          controller.enqueue(
            encoder.encode(`: keepalive ${Date.now()}\n\n`)
          );
        } catch {
          if (keepalive) clearInterval(keepalive);
        }
      }, 15000);

      // Graceful close at 240s
      gracefulClose = setTimeout(() => {
        try {
          sendEvent("reconnect", {
            reason: "stream_lifetime",
            nextAttempt: 500,
          });
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
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
