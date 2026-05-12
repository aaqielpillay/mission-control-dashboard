"use client";
import { motion } from "framer-motion";
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
  TerminalSquare,
  Wifi,
} from "lucide-react";
import MetricCard from "@/components/shared/MetricCard";
import AgentAvatar from "@/components/shared/AgentAvatar";
import { StatusBadge } from "@/components/shared/Badges";
import { AGENTS, TASKS, ACTIVITY, SIGNALS, REPORTS } from "@/lib/mock-data";
import { formatTime } from "@/lib/utils";

function ActivityDot({ type }: { type: string }) {
  if (type === "success") return <span className="text-status-green text-[0.55rem] leading-none">●</span>;
  if (type === "warning") return <span className="text-warning text-[0.55rem] leading-none">●</span>;
  if (type === "error") return <span className="text-status-red text-[0.55rem] leading-none">●</span>;
  return <span className="text-status-blue text-[0.55rem] leading-none">●</span>;
}

export default function DashboardPage() {
  const activeAgents = AGENTS.filter((a) => a.status === "active" && !a.isCEO).length;
  const tasksCompleted = TASKS.filter((t) => t.status === "done").length;
  const tasksInProgress = TASKS.filter((t) => t.status === "in_progress").length;
  const pendingReview = TASKS.filter((t) => t.status === "review").length;
  const signalsCaught = SIGNALS.filter((s) => new Date(s.timestamp) > new Date(Date.now() - 86400000)).length;
  const reportsFiled = REPORTS.filter((r) => new Date(r.date) > new Date(Date.now() - 86400000)).length;

  const sortedActivity = [...ACTIVITY].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  const latestActivity = sortedActivity[0];
  const latestSignal = SIGNALS.reduce((latest, signal) => {
    return !latest || new Date(signal.timestamp) > new Date(latest.timestamp) ? signal : latest;
  }, SIGNALS[0]);

  const now = new Date();
  const iso = now.toISOString();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="grid gap-5 lg:grid-cols-[1.9fr_1.1fr]">
        <div className="card p-6 bg-[rgba(16,16,16,0.95)] border-border shadow-ambient">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[0.62rem] text-accent uppercase tracking-[0.22em]">Athena // Control Loop</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight font-heading text-txt-primary">
                  Mission Control Dashboard
                </h1>
                <p className="mt-2 text-[0.82rem] text-txt-secondary tracking-[0.02em] max-w-xl">
                  Real-time telemetry feed from autonomous trading agents. All metrics update as soon as SSE packets land
                  in the stream.
                </p>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-2 text-[0.68rem]">
                <div className="flex items-center gap-2 text-accent">
                  <Wifi size={14} />
                  <span className="font-semibold uppercase tracking-[0.16em]">SSE Stable</span>
                </div>
                <div className="text-right">
                  <div className="text-txt-ghost uppercase tracking-[0.14em]">Last Tick</div>
                  <div className="font-mono text-txt-primary">
                    {latestActivity ? formatTime(latestActivity.timestamp) : "--"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-txt-ghost uppercase tracking-[0.14em]">Last Signal</div>
                  <div className="font-mono text-txt-secondary">
                    {latestSignal ? formatTime(latestSignal.timestamp) : "--"}
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-md bg-[rgba(0,0,0,0.35)] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 text-accent">
                  <TerminalSquare size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-[0.62rem] uppercase tracking-[0.18em] text-txt-muted">Stream Endpoint</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <code className="font-mono text-[0.78rem] text-txt-primary bg-[rgba(0,0,0,0.45)] px-3 py-2 rounded-md border border-border-subtle">
                      curl -N https://mission-control-dashboard.vercel.app/api/mission-control/stream
                    </code>
                    <span className="text-[0.6rem] text-txt-muted uppercase tracking-[0.18em]">
                      Issued: {iso}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6 bg-[rgba(16,16,16,0.92)] border-border-subtle">
          <p className="text-[0.62rem] text-txt-muted uppercase tracking-[0.18em]">Live Packet Digest</p>
          <div className="mt-3 space-y-2 font-mono text-[0.78rem] text-txt-secondary">
            {sortedActivity.slice(0, 6).map((entry) => (
              <div key={entry.id} className="flex items-center gap-2">
                <span className="text-accent">{formatTime(entry.timestamp)}</span>
                <span className="text-txt-muted">|</span>
                <span className="text-txt-primary">{entry.agentName}</span>
                <span className="text-txt-muted">→</span>
                <span className="truncate text-txt-secondary">{entry.action}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <MetricCard label="Active Agents" value={`${activeAgents}/10`} icon={<Users size={12} />} color="green" />
        <MetricCard label="Tasks Closed" value={tasksCompleted} icon={<CheckSquare size={12} />} color="white" />
        <MetricCard label="Tasks In Flight" value={tasksInProgress} icon={<Activity size={12} />} color="blue" />
        <MetricCard label="Signals (24h)" value={signalsCaught} icon={<Radio size={12} />} color="yellow" />
        <MetricCard label="Reports Filed" value={reportsFiled} icon={<FileText size={12} />} color="white" />
        <MetricCard label="Open Positions" value={1} icon={<Wallet size={12} />} color="green" />
        <MetricCard label="Meetings Held" value={2} icon={<Calendar size={12} />} color="blue" />
        <MetricCard label="Pending Review" value={pendingReview} icon={<Clock size={12} />} color="yellow" />
        <MetricCard label="SOL Balance" value="18.81" icon={<Wallet size={12} />} color="green" />
        <MetricCard label="LinkedIn Posts" value={4} icon={<Send size={12} />} color="blue" />
        <MetricCard label="Critical Alerts" value={2} icon={<AlertTriangle size={12} />} color="red" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-4">
          <h2 className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-txt-muted">Agent Status Grid</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {AGENTS.filter((a) => !a.isCEO).map((agent, i) => {
              const isActive = agent.status === "active";
              return (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`card p-4 flex items-start gap-3 bg-[rgba(16,16,16,0.9)] ${
                    isActive ? "border-accent" : "border-border"
                  }`}
                >
                  <AgentAvatar
                    initials={agent.avatarInitials}
                    color={agent.avatarColor}
                    status={agent.status}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[0.78rem] font-semibold text-txt-primary truncate">
                        {agent.name}
                      </span>
                      <span className="text-[0.6rem] text-txt-muted uppercase tracking-[0.16em]">
                        {agent.role}
                      </span>
                    </div>
                    <p className="text-[0.72rem] text-txt-secondary mt-1.5 truncate leading-relaxed">
                      {agent.currentTask}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <StatusBadge status={agent.status} />
                      <span className="text-[0.6rem] text-txt-muted font-mono">
                        Success {agent.successRate}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="xl:col-span-1 space-y-4">
          <h2 className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-txt-muted">Activity Feed</h2>
          <div className="card p-5 space-y-3 max-h-[640px] overflow-y-auto bg-[rgba(16,16,16,0.92)]">
            {sortedActivity.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="flex items-start gap-3"
              >
                <ActivityDot type={entry.type} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[0.7rem] font-semibold text-txt-primary uppercase tracking-[0.06em]">
                      {entry.agentName}
                    </span>
                    <span className="text-[0.58rem] text-txt-muted font-mono">
                      {formatTime(entry.timestamp)}
                    </span>
                  </div>
                  <p className="text-[0.68rem] text-txt-secondary mt-0.5 leading-relaxed">
                    {entry.action}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
