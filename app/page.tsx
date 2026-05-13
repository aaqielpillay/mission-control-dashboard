"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Kanban, CalendarClock, MessageSquare,
  DollarSign, TrendingUp, Settings, FileText, BookOpen, FolderKanban,
  Menu, X, Wifi, WifiOff, Loader2, ChevronRight,
  Activity, Radio, Zap, Clock, Shield, Cpu, Bot,
  TrendingDown, ArrowUpRight, ArrowDownRight, Minus,
} from "lucide-react";
import { useSSE } from "@/lib/hooks";

/*───────────────────────────────────────────
  SSE DATA SHAPE
  ───────────────────────────────────────────*/
interface SSEPayload {
  type: string; id: number; timestamp: string;
  tick: number;
  dashboard: any; orgChart: any; tasks: any; standups: any;
  boardroom: any; finance: any; investments: any; calendar: any;
  docs: any; projects: any; agentConfig: any; reports: any;
}

/*───────────────────────────────────────────
  UTILITY COMPONENTS
  ───────────────────────────────────────────*/
const StatusDot = ({ status }: { status: string }) => {
  const c = status === "active" || status === "online" ? "bg-success" : status === "idle" || status === "ready" ? "bg-warning" : "bg-danger";
  return <span className={`w-2 h-2 rounded-full ${c} inline-block animate-pulse`} />;
};

const Badge = ({ children, variant = "default" }: { children: any; variant?: string }) => {
  const map: any = {
    success: "bg-success-bg border-success-border text-success",
    warning: "bg-warning-bg border-warning-border text-warning",
    danger: "bg-danger-bg border-danger-border text-danger",
    info: "bg-info-bg border-info-border text-info",
    default: "bg-surface-raised border-border text-txt-muted",
  };
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${map[variant] || map.default}`}>{children}</span>;
};

/*───────────────────────────────────────────
  NAVIGATION
  ───────────────────────────────────────────*/
const NAV_ITEMS = [
  { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { id: "investments", icon: TrendingUp, label: "Investments" },
  { id: "boardroom", icon: MessageSquare, label: "Boardroom" },
  { id: "calendar", icon: CalendarClock, label: "Calendar" },
  { id: "tasks", icon: Kanban, label: "Tasks" },
  { id: "projects", icon: FolderKanban, label: "Projects" },
  { id: "org", icon: Users, label: "Org Chart" },
  { id: "docs", icon: BookOpen, label: "Docs" },
  { id: "finance", icon: DollarSign, label: "Finance" },
  { id: "agents", icon: Settings, label: "Agents" },
  { id: "reports", icon: FileText, label: "Reports" },
];

/*───────────────────────────────────────────
  SECTION COMPONENTS
  ───────────────────────────────────────────*/
function Section({ id, title, icon: Icon, children, badge }: any) {
  return (
    <section id={id} className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={16} className="text-accent" />}
          <h2 className="text-sm font-semibold text-txt-primary uppercase tracking-wider">{title}</h2>
        </div>
        {badge && <Badge variant="info">{badge}</Badge>}
      </div>
      {children}
    </section>
  );
}

function MetricTile({ label, value, sub, icon: Icon, color = "default" }: any) {
  const colors: any = { success: "text-success", warning: "text-warning", danger: "text-danger", info: "text-info", default: "text-txt-primary" };
  return (
    <motion.div whileHover={{ y: -2 }} className="bg-surface rounded-lg p-4 border border-border-subtle hover:border-border-active transition-colors">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] text-txt-muted uppercase tracking-widest">{label}</span>
        {Icon && <Icon size={12} className="text-txt-ghost" />}
      </div>
      <div className={`text-xl font-mono font-semibold ${colors[color]}`}>{value}</div>
      {sub && <div className="text-[10px] text-txt-muted mt-1">{sub}</div>}
    </motion.div>
  );
}

/*───────────────────────────────────────────
  MAIN DASHBOARD
  ───────────────────────────────────────────*/
export default function MissionControlPage() {
  const sse = useSSE<SSEPayload>("/api/mission-control/stream", ["message"]);
  const data = (sse.data as any)?.data || (sse.data as any);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("dashboard");

  if (!data) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 size={40} className="text-accent animate-spin mx-auto" />
          <p className="text-txt-muted font-mono text-sm">INITIALIZING MISSION CONTROL…</p>
        </div>
      </div>
    );
  }

  const d = data.dashboard || {};
  const m = d.metrics || {};
  const inv = data.investments || {};
  const brd = data.boardroom || [];
  const cal = data.calendar || {};
  const tsk = data.tasks || {};
  const proj = data.projects || {};
  const org = data.orgChart || {};
  const docs = data.docs || {};
  const fin = data.finance || {};
  const agents = data.agentConfig || [];
  const reps = data.reports || {};
  const stand = data.standups || [];

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* ── SIDEBAR ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed lg:sticky top-0 left-0 z-50 h-screen w-[240px] bg-surface border-r border-border flex flex-col shrink-0"
          >
            <div className="p-4 border-b border-border flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Zap size={14} className="text-white" />
              </div>
              <div>
                <div className="text-xs font-bold text-txt-primary tracking-wider">MISSION CONTROL</div>
                <div className="text-[9px] text-txt-muted font-mono">v2.0 · {data.tick || 0} ticks</div>
              </div>
            </div>
            <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveSection(item.id); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    activeSection === item.id ? "bg-accent-glow text-accent border border-accent/20" : "text-txt-muted hover:text-txt-primary hover:bg-surface-hover"
                  }`}
                >
                  <item.icon size={14} />
                  <span>{item.label}</span>
                  {activeSection === item.id && <ChevronRight size={12} className="ml-auto" />}
                </button>
              ))}
            </nav>
            <div className="p-3 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-txt-muted">
                {sse.connected ? <Wifi size={12} className="text-success" /> : sse.connecting ? <Loader2 size={12} className="text-warning animate-spin" /> : <WifiOff size={12} className="text-danger" />}
                <span className="font-mono">{sse.connected ? "LIVE" : sse.connecting ? "CONNECTING" : "OFFLINE"}</span>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── MAIN ── */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 bg-canvas/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors">
            {sidebarOpen ? <X size={16} className="text-txt-muted" /> : <Menu size={16} className="text-txt-muted" />}
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3 text-[10px] font-mono text-txt-muted">
            <span className="flex items-center gap-1"><Clock size={12} />{new Date().toLocaleTimeString("en-ZA", { timeZone: "Africa/Johannesburg" })} SAST</span>
            <span className="flex items-center gap-1"><Activity size={12} />Tick {data.tick || 0}</span>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-6 max-w-[1600px]">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
              {activeSection === "dashboard" && (
                <Section id="dashboard" title="Command Center" icon={LayoutDashboard} badge="LIVE">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                    <MetricTile label="Active Agents" value={m.activeAgents || 0} icon={Bot} color="success" />
                    <MetricTile label="Tasks In Progress" value={m.tasksInProgress || 0} icon={Activity} color="info" />
                    <MetricTile label="Signals Caught" value={m.signalsCaught || 0} icon={Radio} color="info" />
                    <MetricTile label="Open Positions" value={m.openPositions || 0} icon={TrendingUp} color={m.openPositions > 0 ? "warning" : "default"} />
                    <MetricTile label="SOL Balance" value={m.solBalance?.toFixed(3) || "0"} icon={DollarSign} sub="SOL" color="success" />
                    <MetricTile label="Alerts" value={m.alertsWarnings || 0} icon={Shield} color={m.alertsWarnings > 0 ? "danger" : "success"} />
                  </div>
                  {/* Activity Feed */}
                  <div className="mt-4">
                    <h3 className="text-xs font-semibold text-txt-muted uppercase tracking-wider mb-2">Activity Feed</h3>
                    <div className="space-y-1 max-h-[200px] overflow-y-auto">
                      {(d.activityFeed || []).slice(0, 6).map((a: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-txt-muted py-1.5 px-2 rounded hover:bg-surface-hover transition-colors">
                          <span>{a.icon}</span>
                          <span className="font-medium text-txt-secondary">{a.agent}</span>
                          <span className="flex-1 truncate">{a.message}</span>
                          <span className="font-mono text-[9px] text-txt-ghost">{a.time ? new Date(a.time).toLocaleTimeString() : ""}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Section>
              )}

              {activeSection === "investments" && (
                <div className="space-y-6">
                  <Section id="investments" title="Portfolio" icon={TrendingUp} badge="LIVE">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <MetricTile label="SOL Balance" value={inv.solBalance?.toFixed(4) || "0"} sub={`$${inv.portfolioUSD?.toFixed(2) || "0"} / R${inv.portfolioZAR?.toFixed(2) || "0"}`} color="success" />
                      <MetricTile label="SOL Price" value={`$${inv.solPrice?.toFixed(2) || "0"}`} sub="USD" />
                      <MetricTile label="Open Positions" value={`${inv.openPositions?.length || 0}`} color={inv.openPositions?.length > 0 ? "warning" : "default"} />
                      <MetricTile label="Equity (30-tick)" value={`$${inv.portfolioUSD?.toFixed(2) || "0"}`} color={inv.portfolioUSD > 50 ? "success" : "default"} />
                    </div>
                  </Section>

                  {/* Signals */}
                  <Section id="signals" title="Active Signals" icon={Radio} badge={`${inv.signals?.length || 0} signals`}>
                    <div className="max-h-[300px] overflow-y-auto space-y-1">
                      {(inv.signals || []).slice(0, 10).map((s: any, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-surface border border-border-subtle">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${s.type === "BUY" ? "bg-success-bg text-success" : "bg-danger-bg text-danger"}`}>
                            {s.type === "BUY" ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          </div>
                          <div className="flex-1"><div className="text-sm font-medium text-txt-primary">{s.token}</div><div className="text-[10px] text-txt-muted">Confidence: {(s.confidence * 100).toFixed(0)}%</div></div>
                          <Badge variant={s.type === "BUY" ? "success" : "danger"}>{s.type}</Badge>
                        </div>
                      ))}
                    </div>
                  </Section>

                  {/* Recent Trades */}
                  <Section id="trades" title="Recent Trades" icon={Activity}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead><tr className="text-txt-muted border-b border-border"><th className="text-left pb-2 font-medium">Symbol</th><th className="text-left pb-2 font-medium">Type</th><th className="text-right pb-2 font-medium">PnL</th><th className="text-right pb-2 font-medium">Reason</th></tr></thead>
                        <tbody>
                          {(inv.recentTrades || []).slice(0, 8).map((t: any, i: number) => (
                            <tr key={i} className="border-b border-border-subtle hover:bg-surface-hover transition-colors">
                              <td className="py-2 text-txt-primary font-medium">{t.symbol}</td>
                              <td className="py-2"><Badge variant={t.type === "WIN" ? "success" : "danger"}>{t.type}</Badge></td>
                              <td className={`py-2 text-right font-mono ${t.pnl >= 0 ? "text-success" : "text-danger"}`}>{t.pnl >= 0 ? "+" : ""}${t.pnl.toFixed(2)}</td>
                              <td className="py-2 text-right text-txt-muted truncate max-w-[120px]">{t.reason}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Section>
                </div>
              )}

              {activeSection === "boardroom" && (
                <Section id="boardroom" title="Agent Communication" icon={MessageSquare} badge={`${brd.length} messages`}>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {brd.map((msg: any, i: number) => (
                      <div key={msg.id || i} className="p-3 rounded-lg bg-surface border border-border-subtle">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{msg.avatar}</span>
                          <span className="text-sm font-semibold text-txt-primary">{msg.sender}</span>
                          <Badge variant="info">{msg.department}</Badge>
                          <span className="text-[9px] text-txt-ghost font-mono ml-auto">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ""}</span>
                        </div>
                        <p className="text-xs text-txt-secondary ml-8">{msg.message}</p>
                        <div className="text-[9px] text-txt-ghost ml-8 mt-1">{msg.direction}</div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {activeSection === "calendar" && (
                <Section id="calendar" title="Agent Scheduler" icon={CalendarClock} badge={`${cal.events?.length || 0} jobs`}>
                  <div className="space-y-2">
                    {(cal.events || []).map((ev: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-border-subtle hover:border-border-active transition-colors">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-[9px] font-mono font-bold ${ev.status === "active" ? "bg-success-bg text-success" : ev.status === "done" ? "bg-info-bg text-info" : "bg-warning-bg text-warning"}`}>{ev.time}</div>
                        <div className="flex-1"><div className="text-sm font-medium text-txt-primary">{ev.task}</div><div className="text-[10px] text-txt-muted">{ev.agent}</div></div>
                        <StatusDot status={ev.status} />
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {activeSection === "tasks" && (
                <Section id="tasks" title="Kanban Board" icon={Kanban}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {["Backlog", "In Progress", "Review", "Done"].map((col) => {
                      const key = col === "Backlog" ? "backlog" : col === "In Progress" ? "inProgress" : col === "Review" ? "review" : "done";
                      const items = tsk[key] || [];
                      return (
                        <div key={col} className="bg-surface rounded-lg p-3 border border-border-subtle">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-semibold text-txt-muted uppercase tracking-wider">{col}</h3>
                            <Badge>{items.length}</Badge>
                          </div>
                          <div className="space-y-2">
                            {items.map((t: any, i: number) => (
                              <div key={t.id || i} className="p-3 bg-surface-raised rounded border border-border-subtle hover:border-border-active cursor-grab transition-colors">
                                <div className="flex items-start gap-2">
                                  <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${t.priority === "high" ? "bg-danger" : t.priority === "medium" ? "bg-warning" : "bg-info"}`} />
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-txt-primary">{t.title}</div>
                                    <div className="text-[9px] text-txt-muted mt-1">{t.assignee}</div>
                                    {t.substeps && <div className="mt-2 space-y-0.5">{t.substeps.map((s: string, j: number) => <div key={j} className="text-[9px] text-txt-ghost flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-txt-ghost" />{s}</div>)}</div>}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Section>
              )}

              {activeSection === "projects" && (
                <Section id="projects" title="Active Projects" icon={FolderKanban}>
                  <div className="space-y-3">
                    {(proj.active || []).map((p: any, i: number) => (
                      <div key={i} className="p-4 rounded-lg bg-surface border border-border-subtle">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-txt-primary">{p.name}</span>
                          <Badge variant={p.status === "running" ? "success" : "info"}>{p.status}</Badge>
                        </div>
                        <div className="w-full h-1.5 bg-surface-raised rounded-full mb-2">
                          <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${Math.min(100, p.progress)}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-txt-muted">
                          <span>{p.detail}</span>
                          <span>{p.agent}</span>
                        </div>
                      </div>
                    ))}
                    {proj.queue && <h3 className="text-xs font-semibold text-txt-muted uppercase tracking-wider mt-4 mb-2">Queue</h3>}
                    {(proj.queue || []).map((q: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded bg-surface-hover text-xs text-txt-muted">
                        <span className={`w-1.5 h-1.5 rounded-full ${q.priority === "high" ? "bg-danger" : q.priority === "medium" ? "bg-warning" : "bg-info"}`} />
                        <span>{q.name}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {activeSection === "org" && (
                <Section id="org" title="Organizational Chart" icon={Users}>
                  {/* CEO Node */}
                  <div className="flex justify-center mb-4">
                    <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-center w-48">
                      <div className="w-10 h-10 bg-accent rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm">{org.ceo?.name?.charAt(0)}</div>
                      <div className="text-sm font-bold text-txt-primary">{org.ceo?.name}</div>
                      <div className="text-[10px] text-accent font-medium">{org.ceo?.role}</div>
                      <StatusDot status={org.ceo?.status} />
                    </div>
                  </div>
                  {/* Agent Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {(org.agents || []).map((a: any, i: number) => (
                      <motion.div key={i} whileHover={{ y: -2 }} className="p-3 rounded-lg bg-surface border border-border-subtle text-center">
                        <div className="w-8 h-8 bg-surface-raised rounded-full mx-auto mb-1.5 flex items-center justify-center text-xs font-bold text-txt-primary">{a.name?.charAt(0)}</div>
                        <div className="text-xs font-semibold text-txt-primary">{a.name}</div>
                        <div className="text-[9px] text-txt-muted">{a.role}</div>
                        <div className="mt-1 flex items-center justify-center gap-1">
                          <StatusDot status={a.status} />
                          <span className="text-[8px] text-txt-ghost">{a.status}</span>
                        </div>
                        <div className="text-[8px] text-txt-ghost mt-1 truncate">{a.currentTask}</div>
                      </motion.div>
                    ))}
                  </div>
                </Section>
              )}

              {activeSection === "docs" && (
                <Section id="docs" title="Documentation & Memory" icon={BookOpen}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(docs.files || []).map((f: any, i: number) => (
                      <div key={i} className="p-4 rounded-lg bg-surface border border-border-subtle hover:border-border-active transition-colors cursor-pointer">
                        <div className="flex items-center gap-2 mb-2"><FileText size={14} className="text-accent" /><span className="text-sm font-medium text-txt-primary font-mono">{f.name}</span></div>
                        <div className="flex items-center gap-3 text-[10px] text-txt-muted font-mono"><span>{f.path}</span><span>{f.size}</span><span className="ml-auto">Updated: {f.updated ? new Date(f.updated).toLocaleDateString() : ""}</span></div>
                      </div>
                    ))}
                  </div>
                  {docs.blacklist?.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-xs font-semibold text-txt-muted uppercase tracking-wider mb-2">Blacklist ({docs.blacklist.length})</h3>
                      <div className="space-y-1">{(docs.blacklist || []).map((b: any, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-txt-muted p-2 rounded bg-danger-bg border border-danger-border">
                          <Shield size={12} className="text-danger" />
                          <span className="font-mono text-danger">{b.token}</span>
                          <span className="flex-1">{b.reason}</span>
                          <span className="text-[9px]">Until: {b.until ? new Date(b.until).toLocaleDateString() : "?"}</span>
                        </div>
                      ))}</div>
                    </div>
                  )}
                </Section>
              )}

              {activeSection === "finance" && (
                <Section id="finance" title="Finance Tracker" icon={DollarSign}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <MetricTile label="Provident Fund" value={`R${(fin.providentFund?.amount || 0).toLocaleString()}`} sub={fin.providentFund?.status} color="success" />
                    <MetricTile label="Immediate" value={`R${(fin.immediate?.amount || 0).toLocaleString()}`} sub={fin.immediate?.status} color="warning" />
                    <MetricTile label="Portfolio ZAR" value={`R${(fin.portfolioZAR || 0).toFixed(2)}`} color="success" />
                    <MetricTile label="Debt Items" value={fin.debtSweepOrder?.length || 0} sub="In sweep order" color="warning" />
                  </div>
                  <h3 className="text-xs font-semibold text-txt-muted uppercase tracking-wider mb-2">Debt Sweep Order</h3>
                  <div className="space-y-1">{(fin.debtSweepOrder || []).map((d: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded bg-surface border border-border-subtle">
                      <span className="text-[10px] font-bold text-txt-muted w-5">{d.priority}</span>
                      <span className="text-sm text-txt-primary flex-1">{d.name}</span>
                      <span className={`text-xs font-mono ${(d.amount || 0) >= 0 ? "text-success" : "text-danger"}`}>R{Math.abs(d.amount || 0).toLocaleString()}</span>
                      <Badge variant={d.status === "pending" ? "warning" : "success"}>{d.status}</Badge>
                    </div>
                  ))}</div>
                </Section>
              )}

              {activeSection === "agents" && (
                <Section id="agents" title="Agent Configuration" icon={Settings} badge={`${agents.length} agents`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(agents || []).map((a: any, i: number) => (
                      <div key={i} className="p-4 rounded-lg bg-surface border border-border-subtle hover:border-border-active transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2"><StatusDot status={a.status} /><span className="text-sm font-semibold text-txt-primary">{a.name}</span></div>
                          <Badge variant={a.enabled ? "success" : "danger"}>{a.enabled ? "ENABLED" : "DISABLED"}</Badge>
                        </div>
                        <div className="text-[10px] text-txt-muted space-y-0.5"><span className="text-txt-secondary">{a.role}</span> · <span>{a.department}</span></div>
                        <div className="mt-2 flex flex-wrap gap-1">{(a.tools || []).map((t: string, j: number) => (<span key={j} className="px-1.5 py-0.5 rounded text-[8px] bg-surface-raised text-txt-muted font-mono">{t}</span>))}</div>
                        <div className="mt-2 text-[9px] text-txt-ghost italic truncate">{a.prompt}</div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {activeSection === "reports" && (
                <Section id="reports" title="Reports" icon={FileText} badge={`${reps.list?.length || 0} reports`}>
                  <div className="space-y-2">
                    {(reps.list || []).map((r: any, i: number) => (
                      <div key={i} className="p-3 rounded-lg bg-surface border border-border-subtle hover:border-border-active cursor-pointer transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={r.type?.includes("Risk") ? "warning" : r.type?.includes("Trade") ? "success" : "info"}>{r.type}</Badge>
                          <span className="text-[9px] text-txt-ghost font-mono">{r.date}</span>
                          <span className="text-[9px] text-txt-muted ml-auto">by {r.author}</span>
                        </div>
                        <p className="text-xs text-txt-secondary">{r.preview}</p>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
