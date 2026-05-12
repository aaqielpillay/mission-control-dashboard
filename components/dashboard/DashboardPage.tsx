"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Radio,
  AlertTriangle,
  Wifi,
  WifiOff,
  Loader2,
  Zap,
  Cpu,
  MemoryStick,
  Clock,
  BarChart3,
  ShieldAlert,
  Flame,
  MessageSquare,
  DollarSign,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import SidePanel from "@/components/progressive-disclosure/SidePanel";
import DetailModal from "@/components/progressive-disclosure/DetailModal";
import { useSSE } from "@/lib/hooks";

/*───────────────────────────────────────────
  TYPE DEFINITIONS
  ───────────────────────────────────────────*/
interface TradingData {
  equity: number;
  equityHistory: number[];
  winRate: number;
  totalTrades: number;
  dailyPnl: number;
  totalPnl: number;
}

interface Signal {
  id: string;
  type: "BUY" | "SELL";
  token: string;
  confidence: number;
  timestamp: string;
}

interface SentimentData {
  fearGreed: number;
  socialVolume: number;
  trend: "BULLISH" | "BEARISH" | "NEUTRAL";
}

interface AgentVitals {
  status: string;
  apiLatency: number;
  uptime: number;
  cpu: number;
  memory: number;
}

interface RiskData {
  currentDrawdown: number;
  maxDrawdown: number;
  var: number;
  openPositions: number;
  maxPositions: number;
}

interface LogEntry {
  level: "INFO" | "SUCCESS" | "WARN" | "ERROR";
  message: string;
  timestamp: string;
}

interface BotState {
  timestamp: string;
  trading: TradingData;
  signals: Signal[];
  sentiment: SentimentData;
  agent: AgentVitals;
  risk: RiskData;
  logs: LogEntry[];
}

/*───────────────────────────────────────────
  UTILITY COMPONENTS
  ───────────────────────────────────────────*/

function TrendIcon({ value }: { value: number }) {
  if (value > 0) return <ArrowUpRight size={14} className="text-success" />;
  if (value < 0) return <ArrowDownRight size={14} className="text-danger" />;
  return <Minus size={14} className="text-txt-ghost" />;
}

function StatusDot({ status }: { status: string }) {
  const color =
    status === "ONLINE" || status === "active"
      ? "bg-success"
      : status === "Idle" || status === "idle"
      ? "bg-warning"
      : "bg-danger";
  return <span className={`w-2 h-2 rounded-full ${color} inline-block`} />;
}

function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
}) {
  const map = {
    default: "bg-surface-raised border-border text-txt-muted",
    success: "bg-success-bg border-success-border text-success",
    warning: "bg-warning-bg border-warning-border text-warning",
    danger: "bg-danger-bg border-danger-border text-danger",
    info: "bg-info-bg border-info-border text-info",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${map[variant]}`}>
      {children}
    </span>
  );
}

function MetricCard({
  label,
  value,
  sub,
  icon,
  variant = "default",
  onClick,
  children,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  icon?: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  const borderHover =
    variant === "success"
      ? "hover:border-success-border"
      : variant === "warning"
      ? "hover:border-warning-border"
      : variant === "danger"
      ? "hover:border-danger-border"
      : "hover:border-border-active";

  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`card p-4 flex flex-col gap-2 text-left w-full ${borderHover}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-txt-muted font-medium uppercase tracking-wider">
          {label}
        </span>
        {icon && <span className="text-txt-ghost">{icon}</span>}
      </div>
      <div className="text-2xl font-mono font-semibold text-txt-primary tracking-tight">
        {value}
      </div>
      {sub && <span className="text-xs text-txt-muted">{sub}</span>}
      {children}
    </motion.button>
  );
}

/*───────────────────────────────────────────
  MINI SPARKLINE
  ───────────────────────────────────────────*/
function Sparkline({ data, width = 120, height = 32 }: { data: number[]; width?: number; height?: number }) {
  if (!data.length) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });
  const first = data[0];
  const last = data[data.length - 1];
  const color = last >= first ? "#6B9E75" : "#B85C5C";

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        points={points.join(" ")}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={width} cy={parseFloat(points[points.length - 1].split(",")[1])} r={2} fill={color} />
    </svg>
  );
}

/*───────────────────────────────────────────
  GAUGE
  ───────────────────────────────────────────*/
function Gauge({ value, label, size = 64 }: { value: number; label: string; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value > 70 ? "text-success" : value > 40 ? "text-warning" : "text-danger";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={4}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${color} transition-all duration-500`}
        />
      </svg>
      <span className={`text-sm font-mono font-semibold ${color}`}>{value}</span>
      <span className="text-[10px] text-txt-muted uppercase tracking-wider">{label}</span>
    </div>
  );
}

/*───────────────────────────────────────────
  MAIN DASHBOARD
  ───────────────────────────────────────────*/

interface SSEPayload<T> {
  type: string;
  data: T;
  timestamp: string;
  id: number;
}

export default function DashboardPage() {
  const sse = useSSE<SSEPayload<BotState>>("/api/mission-control/stream", ["message"]);
  const payload = sse.data;
  const data = payload?.data || null;

  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTitle, setPanelTitle] = useState("");
  const [panelContent, setPanelContent] = useState<React.ReactNode>(null);

  const openPanel = useCallback((title: string, content: React.ReactNode) => {
    setPanelTitle(title);
    setPanelContent(content);
    setPanelOpen(true);
  }, []);

  const trading: TradingData = data?.trading || {
    equity: 1000,
    equityHistory: Array(30).fill(1000),
    winRate: 0,
    totalTrades: 0,
    dailyPnl: 0,
    totalPnl: 0,
  };

  const signals: Signal[] = data?.signals || [];
  const sentiment: SentimentData = data?.sentiment || { fearGreed: 50, socialVolume: 0, trend: "NEUTRAL" };
  const agent: AgentVitals = data?.agent || { status: "OFFLINE", apiLatency: 0, uptime: 0, cpu: 0, memory: 0 };
  const risk: RiskData = data?.risk || { currentDrawdown: 0, maxDrawdown: 0, var: 0, openPositions: 0, maxPositions: 5 };
  const logs: LogEntry[] = data?.logs || [];

  const pnlColor = trading.dailyPnl >= 0 ? "text-success" : "text-danger";
  const pnlSub = trading.dailyPnl >= 0 ? `+$${trading.dailyPnl.toFixed(2)}` : `-$${Math.abs(trading.dailyPnl).toFixed(2)}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-txt-primary tracking-tight">Mission Control</h1>
          <p className="text-sm text-txt-muted mt-0.5">Real-time trading telemetry</p>
        </div>
        <div className="flex items-center gap-2">
          {sse.connecting ? (
            <div className="flex items-center gap-2">
              <Loader2 size={14} className="text-warning animate-spin" />
              <span className="text-xs font-medium text-warning">Connecting…</span>
            </div>
          ) : sse.connected ? (
            <div className="flex items-center gap-2">
              <Wifi size={14} className="text-success" />
              <span className="text-xs font-medium text-success">Live</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <WifiOff size={14} className="text-danger" />
              <span className="text-xs font-medium text-danger">Offline</span>
            </div>
          )}
          {sse.error && <span className="text-[10px] text-danger ml-2">{sse.error}</span>}
        </div>
      </div>

      {/* ─── TRADING PERFORMANCE ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          label="Equity"
          value={`$${trading.equity.toFixed(2)}`}
          icon={<DollarSign size={14} />}
          variant="success"
          onClick={() =>
            openPanel(
              "Equity Breakdown",
              <div className="space-y-4">
                <div className="p-4 bg-surface-raised rounded-lg border border-border-subtle">
                  <Sparkline data={trading.equityHistory} width={360} height={80} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-surface-raised rounded border border-border-subtle">
                    <div className="text-xs text-txt-muted">Peak</div>
                    <div className="text-lg font-mono text-txt-primary">${Math.max(...trading.equityHistory).toFixed(2)}</div>
                  </div>
                  <div className="p-3 bg-surface-raised rounded border border-border-subtle">
                    <div className="text-xs text-txt-muted">Low</div>
                    <div className="text-lg font-mono text-txt-primary">${Math.min(...trading.equityHistory).toFixed(2)}</div>
                  </div>
                </div>
                <p className="text-xs text-txt-muted">30-tick equity history. Updated every 1s from live simulation.</p>
              </div>
            )
          }
        >
          <div className="mt-1">
            <Sparkline data={trading.equityHistory} />
          </div>
        </MetricCard>

        <MetricCard
          label="Win Rate"
          value={`${trading.winRate.toFixed(1)}%`}
          sub={`${trading.totalTrades} trades`}
          icon={<Target size={14} />}
          variant={trading.winRate >= 50 ? "success" : "warning"}
          onClick={() =>
            openPanel(
              "Trading Statistics",
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-surface-raised rounded border border-border-subtle">
                    <div className="text-xs text-txt-muted">Total Trades</div>
                    <div className="text-2xl font-mono text-txt-primary">{trading.totalTrades}</div>
                  </div>
                  <div className="p-3 bg-surface-raised rounded border border-border-subtle">
                    <div className="text-xs text-txt-muted">Win Rate</div>
                    <div className="text-2xl font-mono text-success">{trading.winRate.toFixed(1)}%</div>
                  </div>
                  <div className="p-3 bg-surface-raised rounded border border-border-subtle">
                    <div className="text-xs text-txt-muted">Daily P&L</div>
                    <div className={`text-2xl font-mono ${trading.dailyPnl >= 0 ? "text-success" : "text-danger"}`}>
                      {trading.dailyPnl >= 0 ? "+" : ""}${trading.dailyPnl.toFixed(2)}
                    </div>
                  </div>
                  <div className="p-3 bg-surface-raised rounded border border-border-subtle">
                    <div className="text-xs text-txt-muted">Total P&L</div>
                    <div className={`text-2xl font-mono ${trading.totalPnl >= 0 ? "text-success" : "text-danger"}`}>
                      {trading.totalPnl >= 0 ? "+" : ""}${trading.totalPnl.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )
          }
        />

        <MetricCard
          label="Daily P&L"
          value={pnlSub}
          icon={<TrendIcon value={trading.dailyPnl} />}
          variant={trading.dailyPnl >= 0 ? "success" : "danger"}
        />

        <MetricCard
          label="Open Positions"
          value={`${risk.openPositions}/${risk.maxPositions}`}
          icon={<BarChart3 size={14} />}
          variant={risk.openPositions >= risk.maxPositions ? "warning" : "default"}
          onClick={() =>
            openPanel(
              "Risk Metrics",
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-surface-raised rounded border border-border-subtle">
                    <div className="text-xs text-txt-muted">Current Drawdown</div>
                    <div className="text-2xl font-mono text-danger">{risk.currentDrawdown.toFixed(2)}%</div>
                  </div>
                  <div className="p-3 bg-surface-raised rounded border border-border-subtle">
                    <div className="text-xs text-txt-muted">Max Drawdown</div>
                    <div className="text-2xl font-mono text-danger">{risk.maxDrawdown.toFixed(2)}%</div>
                  </div>
                  <div className="p-3 bg-surface-raised rounded border border-border-subtle">
                    <div className="text-xs text-txt-muted">Value at Risk</div>
                    <div className="text-2xl font-mono text-warning">{risk.var.toFixed(2)}%</div>
                  </div>
                  <div className="p-3 bg-surface-raised rounded border border-border-subtle">
                    <div className="text-xs text-txt-muted">Open / Max</div>
                    <div className="text-2xl font-mono text-txt-primary">{risk.openPositions}/{risk.maxPositions}</div>
                  </div>
                </div>
                <p className="text-xs text-txt-muted">Risk metrics computed from equity history every tick.</p>
              </div>
            )
          }
        />

        <MetricCard
          label="Agent Status"
          value={agent.status}
          sub={`${agent.cpu.toFixed(1)}% CPU · ${agent.memory.toFixed(1)}% MEM`}
          icon={<Cpu size={14} />}
          variant={agent.status === "ONLINE" ? "success" : "danger"}
          onClick={() =>
            openPanel(
              "Agent Vitals",
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-surface-raised rounded border border-border-subtle">
                    <div className="text-xs text-txt-muted">Status</div>
                    <div className="text-xl font-mono text-success">{agent.status}</div>
                  </div>
                  <div className="p-3 bg-surface-raised rounded border border-border-subtle">
                    <div className="text-xs text-txt-muted">Uptime</div>
                    <div className="text-xl font-mono text-txt-primary">{agent.uptime}s</div>
                  </div>
                  <div className="p-3 bg-surface-raised rounded border border-border-subtle">
                    <div className="text-xs text-txt-muted">API Latency</div>
                    <div className="text-xl font-mono text-txt-primary">{agent.apiLatency}ms</div>
                  </div>
                  <div className="p-3 bg-surface-raised rounded border border-border-subtle">
                    <div className="text-xs text-txt-muted">CPU / Memory</div>
                    <div className="text-xl font-mono text-txt-primary">{agent.cpu.toFixed(1)}% / {agent.memory.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            )
          }
        />

        <MetricCard
          label="Sentiment"
          value={sentiment.trend}
          sub={`F&G: ${sentiment.fearGreed}`}
          icon={<Flame size={14} />}
          variant={
            sentiment.trend === "BULLISH"
              ? "success"
              : sentiment.trend === "BEARISH"
              ? "danger"
              : "warning"
          }
        />
      </div>

      {/* ─── TWO COLUMN LAYOUT ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Signals */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-txt-muted">Signal Feed</h2>
            <Badge variant="info">{signals.length} active</Badge>
          </div>
          <div className="card p-0 overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto">
              {signals.length === 0 ? (
                <div className="p-8 text-center text-txt-muted text-sm">No signals yet. Waiting for market conditions…</div>
              ) : (
                <div className="divide-y divide-border-subtle">
                  {signals.map((sig) => (
                    <div key={sig.id} className="p-4 flex items-center justify-between hover:bg-surface-raised transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          sig.type === "BUY" ? "bg-success-bg text-success" : "bg-danger-bg text-danger"
                        }`}>
                          {sig.type === "BUY" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-txt-primary">{sig.token}</span>
                            <Badge variant={sig.type === "BUY" ? "success" : "danger"}>{sig.type}</Badge>
                          </div>
                          <div className="text-xs text-txt-muted mt-0.5">
                            Confidence {(sig.confidence * 100).toFixed(0)}% · {new Date(sig.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-txt-ghost font-mono">{sig.id.slice(0, 12)}…</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Sentiment + Logs */}
        <div className="space-y-6">
          {/* Sentiment Gauges */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-txt-muted">Market Sentiment</h2>
            <div className="card p-4 flex items-center justify-around">
              <Gauge value={sentiment.fearGreed} label="Fear & Greed" />
              <div className="w-px h-12 bg-border-subtle" />
              <div className="flex flex-col items-center gap-1">
                <MessageSquare size={20} className="text-info" />
                <span className="text-sm font-mono font-semibold text-txt-primary">{sentiment.socialVolume.toLocaleString()}</span>
                <span className="text-[10px] text-txt-muted uppercase tracking-wider">Social Vol</span>
              </div>
            </div>
          </div>

          {/* Execution Log */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-txt-muted">Execution Log</h2>
            <div className="card p-4 max-h-[300px] overflow-y-auto" role="log" aria-live="polite">
              <div className="space-y-2">
                {logs.length === 0 ? (
                  <div className="text-center text-txt-muted text-sm py-4">No activity yet</div>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className={`mt-0.5 font-bold text-[10px] ${
                        log.level === "SUCCESS" ? "text-success" :
                        log.level === "WARN" ? "text-warning" :
                        log.level === "ERROR" ? "text-danger" : "text-info"
                      }`}>
                        {log.level}
                      </span>
                      <span className="text-txt-secondary leading-relaxed">{log.message}</span>
                      <span className="text-txt-ghost ml-auto font-mono whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── PROGRESSIVE DISCLOSURE PANEL ─── */}
      <SidePanel isOpen={panelOpen} onClose={() => setPanelOpen(false)} title={panelTitle}>
        {panelContent}
      </SidePanel>
    </motion.div>
  );
}
