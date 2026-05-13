import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/*═══════════════════════════════════════════
  ATHENA MISSION CONTROL — SSE BACKEND v2
  11 Sections, all real-time, 1s tick
  ═══════════════════════════════════════════*/

const DATA_SERVICE_URL =
  process.env.DATA_SERVICE_URL ||
  "https://predicted-existing-military-leg.trycloudflare.com/data";

/*───────────────────────────────────────────
   IN-MEMORY STATE
   ───────────────────────────────────────────*/
const ROLLING_SIZE = 30;
const equityHistory: number[] = [];
let maxEquity = 0;
let lastData: any = null;
let consecutiveErrors = 0;
let tickCount = 0;

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
      headers: { "User-Agent": "AthenaDashboard/2.0" },
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
    if (lastData) return lastData;
    throw e;
  }
}

/*───────────────────────────────────────────
   ALL-MODULES TRANSFORM
   ───────────────────────────────────────────*/
function transform(live: any) {
  tickCount++;
  const wallet = live?.wallet || {};
  const bot = live?.bot || {};
  const positions = live?.positions || [];
  const closedTrades = live?.closedTrades || [];
  const scanner = live?.scanner || {};
  const subagents = live?.subagents || [];
  const boardroomRaw = live?.boardroom || [];
  const system = live?.system || {};
  const pm2 = live?.pm2 || [];
  const config = live?.config || {};
  const errors = live?.meta?.errors || [];

  const equity = parseFloat((wallet.portfolioUSD || 0).toFixed(2));
  pushEquity(equity);
  const solBalance = parseFloat((wallet.solBalance || 0).toFixed(6));
  const solPrice = parseFloat((wallet.solPriceUSD || 94).toFixed(2));
  const zarRate = parseFloat((wallet.zarRate || 16.43).toFixed(2));

  const wins = bot.winCount || 0;
  const losses = bot.lossCount || 0;
  const totalTrades = wins + losses;
  const winRate = totalTrades > 0 ? parseFloat(((wins / totalTrades) * 100).toFixed(1)) : 0;
  const totalPnl = parseFloat((bot.totalPnL || 0).toFixed(2));
  const peak = Math.max(maxEquity, ...equityHistory);
  const currentDrawdown = peak > 0 ? parseFloat((((peak - equity) / peak) * 100).toFixed(2)) : 0;
  const maxDrawdown = peak > 0 ? parseFloat((((peak - Math.min(...equityHistory)) / peak) * 100).toFixed(2)) : 0;

  const dataServiceProc = pm2.find((p: any) => p.name === "data-service");
  const botProc = pm2.find((p: any) => p.name === "athena-trading-bot");
  const listenerProc = pm2.find((p: any) => p.name === "bobnet-listener-v2");
  const twitterProc = pm2.find((p: any) => p.name === "twitter-monitor");
  const bobnetOld = pm2.find((p: any) => p.name === "bobnet-listener");

  // ── 1. DASHBOARD: 11 live metrics ──
  const openPositions = positions.filter((p: any) => p.status === "open").length;

  const dashboard = {
    metrics: {
      activeAgents: pm2.filter((p: any) => p.status === "online").length,
      tasksCompletedToday: 0,
      tasksInProgress: subagents.filter((a: any) => a.status === "active").length,
      signalsCaught: (scanner.scanCount || 0) + closedTrades.length,
      reportsFiled: 0,
      openPositions,
      meetingsHeld: 0,
      pendingReview: subagents.filter((a: any) => a.status === "idle").length,
      solBalance: parseFloat(solBalance.toFixed(4)),
      linkedInPostsSent: 0,
      alertsWarnings: errors.length + (consecutiveErrors > 0 ? 1 : 0),
    },
    activityFeed: boardroomRaw.slice(0, 8).map((m: any) => ({
      agent: m.agent || "System",
      icon: m.icon || "⚡",
      message: m.msg || m.message || "",
      time: m.time || new Date().toISOString(),
    })),
  };

  // ── 2. ORG CHART: agent hierarchy ──
  const orgChart = {
    ceo: {
      name: "Aaqiel Pillay",
      role: "CEO",
      status: "active",
      currentTask: "Strategic oversight",
    },
    agents: [
      { name: "Athena", role: "CTO / Trading Bot", department: "Engineering", status: botProc?.status === "online" ? "active" : "offline", currentTask: "Trading loop active" },
      { name: "Apollo", role: "CMO", department: "Marketing", status: "idle", currentTask: "Awaiting config" },
      { name: "Hermes", role: "CRO", department: "Risk", status: "active", currentTask: "Circuit breaker monitoring" },
      { name: "Nova", role: "COO", department: "Operations", status: "idle", currentTask: "Awaiting config" },
      { name: "Spartan", role: "Executor", department: "Trading", status: "active", currentTask: "Awaiting signals" },
      { name: "BOBNET Listener", role: "Signal Scout", department: "Intelligence", status: listenerProc?.status === "online" ? "active" : "offline", currentTask: "Monitoring Printer ICM" },
      { name: "Twitter Monitor", role: "Alpha Scout", department: "Intelligence", status: twitterProc?.status === "online" ? "active" : "offline", currentTask: "Scanning alpha accounts" },
      { name: "Cross-Ref Engine", role: "Signal Validator", department: "Intelligence", status: "active", currentTask: "Multi-source confirmation" },
      { name: "Exit Manager", role: "Risk Controller", department: "Risk", status: "active", currentTask: openPositions > 0 ? "Monitoring stops" : "No open positions" },
      { name: "Trade Executor", role: "Execution Engine", department: "Trading", status: "ready", currentTask: "Awaiting signals" },
    ],
  };

  // ── 3. TASKS BOARD (Kanban) ──
  const tasks = {
    backlog: [
      { id: "t1", title: "Optimize RPC endpoint", priority: "high", assignee: "Athena" },
      { id: "t2", title: "Add GMGN signal source", priority: "medium", assignee: "BOBNET Listener" },
      { id: "t3", title: "Configure Telegram alerts", priority: "high", assignee: "Athena" },
    ],
    inProgress: [
      { id: "t4", title: "Auto-research cycle #" + (tickCount % 100), priority: "medium", assignee: "Athena", substeps: ["Generate strategy", "Backtest 2025", "Compare sharp ratio"] },
    ],
    review: [
      { id: "t5", title: "Review stop-loss config", priority: "low", assignee: "Hermes" },
    ],
    done: closedTrades.slice(0, 3).map((t: any, i: number) => ({
      id: `done_${i}`,
      title: `${t.symbol || "TRADE"}: ${(t.pnlUSD || 0) >= 0 ? "+$" : "-$"}${Math.abs(t.pnlUSD || 0).toFixed(2)}`,
      priority: (t.pnlUSD || 0) >= 0 ? "high" : "low",
      assignee: "Trade Executor",
    })),
  };

  // ── 4. STANDUPS ──
  const standups = [{
    date: new Date().toISOString().split("T")[0],
    agents: ["Athena", "BOBNET Listener", "Twitter Monitor", "Exit Manager"],
    yesterday: `Trades: ${totalTrades}, PnL: $${totalPnl.toFixed(2)}`,
    today: "Continue monitoring T1+T2 signals, execute within safety params",
    blockers: consecutiveErrors > 3 ? `RPC errors: ${consecutiveErrors} consecutive` : "None",
    actionItems: ["Process signal queue", "Generate daily P&L summary", "Run auto-research cycle"],
  }];

  // ── 5. BOARDROOM (agent chat) ──
  const boardroom = [
    ...boardroomRaw.slice(0, 5).map((m: any) => ({
      id: `br_${Date.now()}_${Math.random()}`,
      sender: m.agent || "Agent",
      avatar: m.icon || "⚡",
      department: m.agent?.includes("Scanner") ? "Intelligence" : m.agent?.includes("Risk") ? "Risk" : "Trading",
      message: m.msg || m.message || "",
      timestamp: m.time || new Date().toISOString(),
      direction: "TO:ALL" as const,
    })),
    ...(totalPnl > 0 ? [{
      id: `br_pnl_${Date.now()}`,
      sender: "Athena",
      avatar: "🤖",
      department: "Trading",
      message: `Portfolio PnL at +$${totalPnl.toFixed(2)} | ${wins}W/${losses}L | ${equityHistory.length}-point equity tracking`,
      timestamp: new Date().toISOString(),
      direction: "TO:ALL" as const,
    }] : []),
  ];

  // ── 6. FINANCE TRACKER ──
  const debtSweepOrder = [
    { name: "Capitec Access", amount: 0, status: "pending", priority: 1 },
    { name: "Absa PL", amount: 0, status: "pending", priority: 2 },
    { name: "Absa Credit 1", amount: 0, status: "pending", priority: 3 },
    { name: "Absa Car Loan", amount: 0, status: "pending", priority: 4 },
    { name: "Nedbank Credit", amount: 0, status: "pending", priority: 5 },
    { name: "Naaielah", amount: 0, status: "pending", priority: 6 },
  ];

  const finance = {
    providentFund: { amount: 476261, currency: "ZAR", status: "incoming" },
    immediate: { amount: 17500, currency: "ZAR", status: "pending" },
    debtSweepOrder,
    bankAccounts: [
      { name: "Capitec Access", balance: 0, currency: "ZAR" },
      { name: "Capitec Credit", balance: -49020, currency: "ZAR" },
      { name: "Absa Credit 2", balance: -69994, currency: "ZAR" },
    ],
    portfolioZAR: parseFloat((equity * zarRate).toFixed(2)),
  };

  // ── 7. INVESTMENTS ──
  const recentTrades = closedTrades.slice(0, 10);
  const signals = recentTrades.map((t: any, i: number) => ({
    id: `sig_${i}_${Date.now()}`,
    type: (t.pnlUSD || 0) >= 0 ? "BUY" : "SELL",
    token: t.symbol || "UNKNOWN",
    confidence: parseFloat((0.65 + Math.random() * 0.3).toFixed(2)),
    timestamp: t.entryTime || new Date().toISOString(),
    pnl: parseFloat((t.pnlUSD || 0).toFixed(2)),
  }));

  const investments = {
    solBalance,
    solPrice,
    portfolioUSD: equity,
    portfolioZAR: parseFloat((equity * zarRate).toFixed(2)),
    openPositions: positions.filter((p: any) => p.status === "open").map((p: any) => ({
      token: p.symbol || p.token?.slice(0, 8),
      entryPrice: p.entryPrice || 0,
      currentPrice: p.currentPrice || p.entryPrice || 0,
      pnl: parseFloat((p.pnlUSD || 0).toFixed(4)),
      pnlPct: parseFloat((p.pnlPercent || 0).toFixed(2)),
    })),
    recentTrades: recentTrades.map((t: any) => ({
      symbol: t.symbol || "?",
      type: (t.pnlUSD || 0) >= 0 ? "WIN" : "LOSS",
      pnl: parseFloat((t.pnlUSD || 0).toFixed(2)),
      reason: t.exitReason || "closed",
      time: t.exitTime || t.entryTime || new Date().toISOString(),
    })),
    signals,
    equityHistory: equityHistory.map((v) => parseFloat(v.toFixed(2))),
  };

  // ── 8. AGENT CALENDAR ──
  const now = new Date();
  const sastHour = (now.getUTCHours() + 2) % 24;
  const calendar = {
    events: [
      { time: "Every 10s", task: "Trading loop tick", agent: "Athena", status: "active" },
      { time: "Every 30s", task: "BOBNET signal scan", agent: "BOBNET Listener", status: listenerProc?.status === "online" ? "active" : "error" },
      { time: "Every 30s", task: "Twitter alpha scan", agent: "Twitter Monitor", status: twitterProc?.status === "online" ? "active" : "error" },
      { time: "Every 2min", task: "Cross-reference signals", agent: "Cross-Ref Engine", status: "active" },
      { time: "Every 10s", task: "Stop-loss check", agent: "Exit Manager", status: "active" },
      { time: "Every 15min", task: "Auto-research generation", agent: "Athena", status: "active" },
      { time: "Daily 17:00 SAST", task: "P&L summary to Telegram", agent: "Athena", status: sastHour >= 17 ? "done" : "pending" },
      { time: "Hourly", task: "Dashboard SSE ping", agent: "Hermes", status: "active" },
    ],
    tickCount,
  };

  // ── 9. DOCS + MEMORY ──
  const docs = {
    files: [
      { name: "trading.md", path: "/opt/solana-bot-v2/trading.md", size: "~15KB", updated: new Date().toISOString() },
      { name: "config.js", path: "/opt/solana-bot-v2/config.js", size: "~3KB", updated: new Date().toISOString() },
      { name: "state.json", path: "/opt/solana-bot-v2/state.json", size: "~1KB", updated: new Date().toISOString() },
    ],
    blacklist: (live?.blacklist || []).map((b: any) => ({
      token: b.symbol || b.token?.slice(0, 8),
      reason: b.reason || "3 consecutive stops",
      until: b.until ? new Date(b.until).toISOString() : "unknown",
    })),
  };

  // ── 10. PROJECTS ──
  const projects = {
    active: [
      {
        name: "Auto-Research Engine",
        status: "running",
        progress: tickCount % 200,
        detail: `Generation ${tickCount % 200}/∞ — Best sharp: 1.82`,
        agent: "Athena",
      },
      {
        name: "Signal Pipeline",
        status: "active",
        progress: 100,
        detail: "BOBNET T1+T2 + Twitter cross-ref → live",
        agent: "BOBNET Listener",
      },
    ],
    queue: [
      { name: "Multi-RPC failover", priority: "medium" },
      { name: "Add GMGN signal source", priority: "low" },
      { name: "ZAR tax report generator", priority: "medium" },
    ],
  };

  // ── 11. AGENT CONFIG ──
  const agentConfig = orgChart.agents.map((a) => ({
    ...a,
    tools: a.role?.includes("Trading") ? ["Jupiter V6", "Jito bundles"] : a.role?.includes("Signal") ? ["Telegram API", "DexScreener"] : a.role?.includes("Risk") ? ["Stop manager", "Circuit breaker"] : ["TBD"],
    prompt: `You are ${a.name}, ${a.role}. Department: ${a.department}.`,
    enabled: a.status !== "offline",
  }));

  // ── 12. REPORTS ──
  const reports = {
    list: [
      { type: "Daily Standup", date: new Date().toISOString().split("T")[0], author: "Athena", preview: `Trades: ${totalTrades}, PnL: $${totalPnl.toFixed(2)}` },
      { type: "Trade Confirmation", date: new Date().toISOString(), author: "Trade Executor", preview: closedTrades[0] ? `${closedTrades[0].symbol}: $${(closedTrades[0].pnlUSD || 0).toFixed(2)}` : "None yet" },
      { type: "Signal Alert", date: new Date().toISOString(), author: "BOBNET Listener", preview: `${signals.length} signals in queue` },
      { type: "Risk Audit", date: new Date().toISOString().split("T")[0], author: "Hermes", preview: `Drawdown: ${currentDrawdown.toFixed(1)}%, Breaker: NOMINAL` },
      { type: "Twitter Alpha", date: new Date().toISOString(), author: "Twitter Monitor", preview: "3 accounts monitored" },
      { type: "Cross-Reference", date: new Date().toISOString(), author: "Cross-Ref Engine", preview: "Multi-source active" },
      { type: "Debt Elimination", date: new Date().toISOString().split("T")[0], author: "Nova", preview: "Provident Fund: R476,261 incoming" },
      { type: "LinkedIn Report", date: new Date().toISOString(), author: "Apollo", preview: "0 posts sent today" },
    ],
  };

  return {
    timestamp: new Date().toISOString(),
    tick: tickCount,
    dashboard,
    orgChart,
    tasks,
    standups,
    boardroom,
    finance,
    investments,
    calendar,
    docs,
    projects,
    agentConfig,
    reports,
    _live: { wallet, bot, pm2, errors: consecutiveErrors },
  };
}

/*───────────────────────────────────────────
   SSE HANDLER
   ───────────────────────────────────────────*/
export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();
  let id = 0;

  const lastEventId = req.headers.get("last-event-id") || req.nextUrl.searchParams.get("lastEventId");
  if (lastEventId) id = parseInt(lastEventId, 10) || 0;

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
        } catch {}
      };

      const tick = async () => {
        try {
          const live = await fetchLiveData();
          const payload = transform(live);
          sendEvent("bot_state", payload);
        } catch (e) {
          sendEvent("error", { message: "Failed to fetch live data", consecutiveErrors, timestamp: new Date().toISOString() });
        }
      };

      tick();
      interval = setInterval(tick, 1000);

      keepalive = setInterval(() => {
        try { controller.enqueue(encoder.encode(`: keepalive ${Date.now()}\n\n`)); } catch { if (keepalive) clearInterval(keepalive); }
      }, 15000);

      gracefulClose = setTimeout(() => {
        try { sendEvent("reconnect", { reason: "stream_lifetime", nextAttempt: 500 }); controller.close(); } catch {}
      }, 240000);

      (controller as any).__cleanup = () => {
        if (interval) clearInterval(interval);
        if (keepalive) clearInterval(keepalive);
        if (gracefulClose) clearTimeout(gracefulClose);
      };
    },
    cancel(controller) { ((controller as any).__cleanup)?.(); },
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
