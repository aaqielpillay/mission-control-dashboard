"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  CheckSquare,
  Activity,
  Radio,
  FileText,
  Wallet,
  Calendar,
  Clock,
  AlertTriangle,
  Send,
  Wifi,
  WifiOff,
  Loader2,
  Cpu,
  MemoryStick,
  Logs,
  Settings,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import MetricCard from "@/components/shared/MetricCard";
import AgentAvatar from "@/components/shared/AgentAvatar";
import { StatusBadge } from "@/components/shared/Badges";
import SidePanel from "@/components/progressive-disclosure/SidePanel";
import DetailModal from "@/components/progressive-disclosure/DetailModal";
import { useSSE } from "@/lib/hooks";
import { AGENTS, TASKS, ACTIVITY, SIGNALS, REPORTS } from "@/lib/mock-data";
import { formatTime, timeAgo } from "@/lib/utils";
import type { Agent, DashboardMetrics } from "@/lib/types";

function ActivityDot({ type }: { type: string }) {
  if (type === "success") return <span className="w-1.5 h-1.5 rounded-full bg-success shrink-0" />;
  if (type === "warning") return <span className="w-1.5 h-1.5 rounded-full bg-warning shrink-0" />;
  if (type === "error") return <span className="w-1.5 h-1.5 rounded-full bg-danger shrink-0" />;
  return <span className="w-1.5 h-1.5 rounded-full bg-info shrink-0" />;
}

function TrendIcon({ trend }: { trend: "up" | "down" | "neutral" }) {
  if (trend === "up") return <TrendingUp size={12} className="text-success" />;
  if (trend === "down") return <TrendingDown size={12} className="text-danger" />;
  return <Minus size={12} className="text-txt-ghost" />;
}

export default function DashboardPage() {
  // ─── SSE CONNECTION ───
  const sse = useSSE<any>("/api/mission-control/stream", ["message"]);

  // ─── PROGRESSIVE DISCLOSURE STATE ───
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // ─── DERIVED METRICS (live SSE → mock fallback) ───
  const metrics: DashboardMetrics = useMemo(() => {
    const botState = sse.data?.data || sse.data;
    if (botState && typeof botState === "object") {
      return {
        activeAgents: botState.activeAgents ?? AGENTS.filter((a) => a.status === "active" && !a.isCEO).length,
        tasksCompletedToday: botState.tasksCompletedToday ?? TASKS.filter((t) => t.status === "done").length,
        tasksInProgress: botState.tasksInProgress ?? TASKS.filter((t) => t.status === "in_progress").length,
        signalsCaught: botState.signalsCaught ?? SIGNALS.filter((s) => new Date(s.timestamp) > new Date(Date.now() - 86400000)).length,
        reportsFiled: botState.reportsFiled ?? REPORTS.filter((r) => new Date(r.date) > new Date(Date.now() - 86400000)).length,
        openPositions: botState.openPositions ?? 1,
        meetingsHeld: botState.meetingsHeld ?? 2,
        pendingReview: botState.pendingReview ?? TASKS.filter((t) => t.status === "review").length,
        solBalance: botState.solBalance ?? 18.81,
        linkedinPostsSent: botState.linkedinPostsSent ?? 4,
        alerts: botState.alerts ?? 2,
      };
    }
    return {
      activeAgents: AGENTS.filter((a) => a.status === "active" && !a.isCEO).length,
      tasksCompletedToday: TASKS.filter((t) => t.status === "done").length,
      tasksInProgress: TASKS.filter((t) => t.status === "in_progress").length,
      signalsCaught: SIGNALS.filter((s) => new Date(s.timestamp) > new Date(Date.now() - 86400000)).length,
      reportsFiled: REPORTS.filter((r) => new Date(r.date) > new Date(Date.now() - 86400000)).length,
      openPositions: 1,
      meetingsHeld: 2,
      pendingReview: TASKS.filter((t) => t.status === "review").length,
      solBalance: 18.81,
      linkedinPostsSent: 4,
      alerts: 2,
    };
  }, [sse.data]);

  const sortedActivity = useMemo(
    () => [...ACTIVITY].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    []
  );

  // ─── INTERACTION HANDLERS ───
  const handleAgentClick = useCallback((agent: Agent) => {
    setSelectedAgent(agent);
    setPanelOpen(true);
  }, []);

  const handleMetricClick = useCallback((metricKey: string) => {
    setSelectedMetric(metricKey);
    setModalOpen(true);
  }, []);

  const handleClosePanel = useCallback(() => {
    setPanelOpen(false);
    setTimeout(() => setSelectedAgent(null), 300);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setTimeout(() => setSelectedMetric(null), 300);
  }, []);

  // ─── METRIC DEFINITIONS ───
  const metricDefs = [
    { key: "activeAgents", label: "Active Agents", value: `${metrics.activeAgents}/10`, icon: <Users size={14} />, color: "success" as const, trend: "neutral" as const },
    { key: "tasksCompletedToday", label: "Tasks Done", value: metrics.tasksCompletedToday, icon: <CheckSquare size={14} />, color: "accent" as const, trend: "up" as const },
    { key: "tasksInProgress", label: "In Progress", value: metrics.tasksInProgress, icon: <Activity size={14} />, color: "info" as const, trend: "neutral" as const },
    { key: "signalsCaught", label: "Signals (24h)", value: metrics.signalsCaught, icon: <Radio size={14} />, color: "warning" as const, trend: "up" as const },
    { key: "reportsFiled", label: "Reports Filed", value: metrics.reportsFiled, icon: <FileText size={14} />, color: "accent" as const, trend: "neutral" as const },
    { key: "openPositions", label: "Open Positions", value: metrics.openPositions, icon: <Wallet size={14} />, color: "success" as const, trend: "neutral" as const },
    { key: "meetingsHeld", label: "Meetings Held", value: metrics.meetingsHeld, icon: <Calendar size={14} />, color: "info" as const, trend: "neutral" as const },
    { key: "pendingReview", label: "Pending Review", value: metrics.pendingReview, icon: <Clock size={14} />, color: "warning" as const, trend: "down" as const },
    { key: "solBalance", label: "SOL Balance", value: metrics.solBalance, icon: <Wallet size={14} />, color: "success" as const, trend: "up" as const },
    { key: "linkedinPostsSent", label: "LinkedIn Posts", value: metrics.linkedinPostsSent, icon: <Send size={14} />, color: "info" as const, trend: "up" as const },
    { key: "alerts", label: "Alerts", value: metrics.alerts, icon: <AlertTriangle size={14} />, color: "danger" as const, trend: "neutral" as const },
  ];

  const colorClassMap: Record<string, string> = {
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
    info: "text-info",
    accent: "text-accent",
  };

  // ─── MODAL CONTENT BUILDER ───
  const renderMetricModalContent = () => {
    if (!selectedMetric) return null;
    switch (selectedMetric) {
      case "activeAgents":
        return (
          <div className="space-y-4">
            <p className="text-sm text-txt-secondary">Agents currently online and executing tasks.</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-surface-raised rounded-lg border border-border-subtle">
                <div className="text-xs text-txt-muted mb-1">Online</div>
                <div className="text-2xl font-mono font-semibold text-success">{metrics.activeAgents}</div>
              </div>
              <div className="p-3 bg-surface-raised rounded-lg border border-border-subtle">
                <div className="text-xs text-txt-muted mb-1">Idle / Offline</div>
                <div className="text-2xl font-mono font-semibold text-warning">{10 - metrics.activeAgents}</div>
              </div>
            </div>
            <div className="space-y-2">
              {AGENTS.filter((a) => !a.isCEO).map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-2 bg-surface-raised rounded">
                  <div className="flex items-center gap-2">
                    <AgentAvatar initials={agent.avatarInitials} color={agent.avatarColor} status={agent.status} size="sm" />
                    <span className="text-sm text-txt-primary">{agent.name}</span>
                  </div>
                  <StatusBadge status={agent.status} />
                </div>
              ))}
            </div>
          </div>
        );
      case "tasksCompletedToday":
        return (
          <div className="space-y-4">
            <p className="text-sm text-txt-secondary">Task completion breakdown by status.</p>
            <div className="grid grid-cols-2 gap-3">
              {(["backlog", "in_progress", "review", "done"] as const).map((s) => (
                <div key={s} className="p-3 bg-surface-raised rounded-lg border border-border-subtle">
                  <div className="text-xs text-txt-muted mb-1 capitalize">{s.replace("_", " ")}</div>
                  <div className="text-2xl font-mono font-semibold text-txt-primary">{TASKS.filter((t) => t.status === s).length}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case "signalsCaught":
        return (
          <div className="space-y-4">
            <p className="text-sm text-txt-secondary">Signal intelligence feed from BOBNET and cross-reference engines.</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {SIGNALS.map((sig) => (
                <div key={sig.id} className="p-3 bg-surface-raised rounded border border-border-subtle">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-txt-primary">{sig.token}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${sig.executed ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                      {sig.executed ? "EXECUTED" : "PENDING"}
                    </span>
                  </div>
                  <div className="text-xs text-txt-muted mt-1">{sig.source} • AI Score {sig.aiScore} • {sig.confidence}% confidence</div>
                </div>
              ))}
            </div>
          </div>
        );
      case "solBalance":
        return (
          <div className="space-y-4">
            <p className="text-sm text-txt-secondary">On-chain SOL balance and portfolio overview.</p>
            <div className="p-4 bg-surface-raised rounded-lg border border-border-subtle text-center">
              <div className="text-xs text-txt-muted mb-1">Current Balance</div>
              <div className="text-3xl font-mono font-semibold text-txt-primary">{metrics.solBalance} SOL</div>
              <div className="text-sm text-txt-muted mt-1">~≈ ${(metrics.solBalance * 170).toFixed(2)} USD</div>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            <p className="text-sm text-txt-secondary">Detailed breakdown for {metricDefs.find((m) => m.key === selectedMetric)?.label}.</p>
            <div className="p-4 bg-surface-raised rounded-lg border border-border-subtle text-center">
              <div className="text-4xl font-mono font-semibold text-txt-primary">
                {metricDefs.find((m) => m.key === selectedMetric)?.value}
              </div>
            </div>
            <p className="text-xs text-txt-muted">Drill-down views for this metric will be available in the next iteration.</p>
          </div>
        );
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-txt-primary tracking-tight">Dashboard</h1>
          <p className="text-sm text-txt-muted mt-0.5">Real-time overview of mission control operations</p>
        </div>
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            {sse.connecting ? (
              <motion.div key="connecting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Loader2 size={14} className="text-warning animate-spin" />
                <span className="text-xs font-medium text-warning">Connecting…</span>
              </motion.div>
            ) : sse.connected ? (
              <motion.div key="live" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <Wifi size={14} className="text-success" />
                <span className="text-xs font-medium text-success">Live</span>
              </motion.div>
            ) : (
              <motion.div key="offline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <WifiOff size={14} className="text-danger" />
                <span className="text-xs font-medium text-danger">Offline</span>
              </motion.div>
            )}
          </AnimatePresence>
          {sse.error && <span className="text-[10px] text-danger ml-2">{sse.error}</span>}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {metricDefs.map((m, i) => (
          <motion.button
            key={m.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => handleMetricClick(m.key)}
            className="card p-4 flex flex-col gap-2 text-left w-full"
            aria-label={`View details for ${m.label}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-txt-muted font-medium">{m.label}</span>
              {m.icon && <span className="text-txt-ghost">{m.icon}</span>}
            </div>
            <div className="flex items-end gap-2">
              <span className={`text-2xl font-semibold font-mono tracking-tight ${colorClassMap[m.color] || "text-txt-primary"}`}>
                {m.value}
              </span>
              <TrendIcon trend={m.trend} />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Status */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-txt-muted">Agent Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AGENTS.filter((a) => !a.isCEO).map((agent, i) => (
              <motion.button
                key={agent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => handleAgentClick(agent)}
                className="card p-4 flex items-start gap-3 text-left w-full"
                aria-label={`View full details for ${agent.name}, ${agent.role}`}
              >
                <AgentAvatar initials={agent.avatarInitials} color={agent.avatarColor} status={agent.status} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-txt-primary truncate">{agent.name}</span>
                    <StatusBadge status={agent.status} />
                  </div>
                  <span className="text-xs text-txt-muted mt-0.5 block">{agent.role}</span>
                  <p className="text-xs text-txt-secondary mt-1.5 truncate">{agent.currentTask}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-txt-ghost font-mono">{agent.successRate}% success</span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-txt-muted">Activity Feed</h2>
          <div className="card p-4 space-y-3 max-h-[600px] overflow-y-auto" role="log" aria-live="polite" aria-atomic="false">
            {sortedActivity.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-start gap-3"
              >
                <div className="mt-1.5">
                  <ActivityDot type={entry.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-txt-primary">{entry.agentName}</span>
                    <span className="text-[10px] text-txt-ghost font-mono">{formatTime(entry.timestamp)}</span>
                  </div>
                  <p className="text-xs text-txt-secondary mt-0.5 leading-relaxed">{entry.action}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── PROGRESSIVE DISCLOSURE: AGENT SIDE PANEL ─── */}
      <SidePanel
        isOpen={panelOpen}
        onClose={handleClosePanel}
        title={selectedAgent?.name ?? "Agent Details"}
        subtitle={selectedAgent?.role}
        ariaLabel={`${selectedAgent?.name} full agent breakdown`}
      >
        {selectedAgent && (
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center gap-3">
              <AgentAvatar initials={selectedAgent.avatarInitials} color={selectedAgent.avatarColor} status={selectedAgent.status} size="lg" />
              <div>
                <div className="text-sm font-semibold text-txt-primary">{selectedAgent.name}</div>
                <div className="text-xs text-txt-muted">{selectedAgent.department} • {selectedAgent.role}</div>
                <div className="mt-1">
                  <StatusBadge status={selectedAgent.status} />
                </div>
              </div>
            </div>

            {/* Telemetry */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-surface-raised rounded-lg border border-border-subtle">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp size={12} className="text-txt-muted" />
                  <span className="text-xs text-txt-muted">Success Rate</span>
                </div>
                <div className="text-xl font-mono font-semibold text-txt-primary">{selectedAgent.successRate}%</div>
              </div>
              <div className="p-3 bg-surface-raised rounded-lg border border-border-subtle">
                <div className="flex items-center gap-1.5 mb-1">
                  <Clock size={12} className="text-txt-muted" />
                  <span className="text-xs text-txt-muted">Last Active</span>
                </div>
                <div className="text-sm font-mono text-txt-primary">{timeAgo(selectedAgent.lastActive)}</div>
              </div>
              <div className="p-3 bg-surface-raised rounded-lg border border-border-subtle">
                <div className="flex items-center gap-1.5 mb-1">
                  <Cpu size={12} className="text-txt-muted" />
                  <span className="text-xs text-txt-muted">CPU Usage</span>
                </div>
                <div className="text-xl font-mono font-semibold text-txt-primary">{Math.floor(Math.random() * 30 + 5)}%</div>
              </div>
              <div className="p-3 bg-surface-raised rounded-lg border border-border-subtle">
                <div className="flex items-center gap-1.5 mb-1">
                  <MemoryStick size={12} className="text-txt-muted" />
                  <span className="text-xs text-txt-muted">Memory</span>
                </div>
                <div className="text-xl font-mono font-semibold text-txt-primary">{Math.floor(Math.random() * 200 + 80)} MB</div>
              </div>
            </div>

            {/* Current Task */}
            <div>
              <h3 className="text-xs font-semibold text-txt-muted uppercase tracking-wider mb-2">Current Task</h3>
              <div className="p-3 bg-surface-raised rounded-lg border border-border-subtle">
                <p className="text-sm text-txt-secondary">{selectedAgent.currentTask}</p>
              </div>
            </div>

            {/* Tools */}
            <div>
              <h3 className="text-xs font-semibold text-txt-muted uppercase tracking-wider mb-2">Tools</h3>
              <div className="flex flex-wrap gap-2">
                {selectedAgent.tools.map((tool) => (
                  <span key={tool} className="badge">{tool}</span>
                ))}
              </div>
            </div>

            {/* Prompt */}
            {selectedAgent.customPrompt && (
              <div>
                <h3 className="text-xs font-semibold text-txt-muted uppercase tracking-wider mb-2">System Prompt</h3>
                <div className="p-3 bg-surface-raised rounded-lg border border-border-subtle max-h-48 overflow-y-auto">
                  <p className="text-xs text-txt-secondary leading-relaxed font-mono whitespace-pre-wrap">{selectedAgent.customPrompt}</p>
                </div>
              </div>
            )}

            {/* Execution Logs (mock) */}
            <div>
              <h3 className="text-xs font-semibold text-txt-muted uppercase tracking-wider mb-2">Recent Logs</h3>
              <div className="space-y-2">
                {[
                  { level: "INFO" as const, msg: `Heartbeat check passed — ${selectedAgent.name} responsive` },
                  { level: "SUCCESS" as const, msg: `Task "${selectedAgent.currentTask}" updated` },
                  { level: "INFO" as const, msg: `Metrics synced to dashboard` },
                ].map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 bg-surface-raised rounded border border-border-subtle">
                    <span className={`text-[10px] font-bold mt-0.5 ${log.level === "SUCCESS" ? "text-success" : "text-info"}`}>{log.level}</span>
                    <span className="text-xs text-txt-secondary">{log.msg}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Configuration */}
            <div>
              <h3 className="text-xs font-semibold text-txt-muted uppercase tracking-wider mb-2">Configuration</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-surface-raised rounded border border-border-subtle">
                  <div className="flex items-center gap-2">
                    <Settings size={12} className="text-txt-muted" />
                    <span className="text-xs text-txt-secondary">Enabled</span>
                  </div>
                  <span className={`text-xs font-medium ${selectedAgent.enabled ? "text-success" : "text-danger"}`}>{selectedAgent.enabled ? "YES" : "NO"}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-surface-raised rounded border border-border-subtle">
                  <div className="flex items-center gap-2">
                    <Logs size={12} className="text-txt-muted" />
                    <span className="text-xs text-txt-secondary">Agent ID</span>
                  </div>
                  <span className="text-xs font-mono text-txt-muted">{selectedAgent.id}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </SidePanel>

      {/* ─── PROGRESSIVE DISCLOSURE: METRIC MODAL ─── */}
      <DetailModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={metricDefs.find((m) => m.key === selectedMetric)?.label ?? "Metric Details"}
        ariaLabel={`Full breakdown for ${metricDefs.find((m) => m.key === selectedMetric)?.label}`}
      >
        {renderMetricModalContent()}
      </DetailModal>
    </motion.div>
  );
}
