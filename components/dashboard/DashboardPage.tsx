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
  Wifi,
} from "lucide-react";
import MetricCard from "@/components/shared/MetricCard";
import AgentAvatar from "@/components/shared/AgentAvatar";
import { StatusBadge } from "@/components/shared/Badges";
import { AGENTS, TASKS, ACTIVITY, SIGNALS, REPORTS } from "@/lib/mock-data";
import { formatTime } from "@/lib/utils";

function ActivityDot({ type }: { type: string }) {
  if (type === "success") return <span className="w-1.5 h-1.5 rounded-full bg-success" />;
  if (type === "warning") return <span className="w-1.5 h-1.5 rounded-full bg-warning" />;
  if (type === "error") return <span className="w-1.5 h-1.5 rounded-full bg-danger" />;
  return <span className="w-1.5 h-1.5 rounded-full bg-info" />;
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-txt-primary tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-txt-muted mt-0.5">
            Real-time overview of mission control operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Wifi size={14} className="text-accent" />
          <span className="text-xs font-medium text-txt-muted">Live</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <MetricCard label="Active Agents" value={`${activeAgents}/10`} icon={<Users size={14} />} color="green" />
        <MetricCard label="Tasks Done" value={tasksCompleted} icon={<CheckSquare size={14} />} />
        <MetricCard label="In Progress" value={tasksInProgress} icon={<Activity size={14} />} color="blue" />
        <MetricCard label="Signals (24h)" value={signalsCaught} icon={<Radio size={14} />} color="yellow" />
        <MetricCard label="Reports Filed" value={reportsFiled} icon={<FileText size={14} />} />
        <MetricCard label="Open Positions" value={1} icon={<Wallet size={14} />} color="green" />
        <MetricCard label="Meetings Held" value={2} icon={<Calendar size={14} />} color="blue" />
        <MetricCard label="Pending Review" value={pendingReview} icon={<Clock size={14} />} color="yellow" />
        <MetricCard label="SOL Balance" value="18.81" icon={<Wallet size={14} />} color="green" />
        <MetricCard label="LinkedIn Posts" value={4} icon={<Send size={14} />} color="blue" />
        <MetricCard label="Alerts" value={2} icon={<AlertTriangle size={14} />} color="red" />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Status */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-txt-muted">Agent Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AGENTS.filter((a) => !a.isCEO).map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="card p-4 flex items-start gap-3"
              >
                <AgentAvatar
                  initials={agent.avatarInitials}
                  color={agent.avatarColor}
                  status={agent.status}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-txt-primary truncate">
                      {agent.name}
                    </span>
                    <StatusBadge status={agent.status} />
                  </div>
                  <span className="text-xs text-txt-muted mt-0.5 block">
                    {agent.role}
                  </span>
                  <p className="text-xs text-txt-secondary mt-1.5 truncate">
                    {agent.currentTask}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-txt-ghost font-mono">
                      {agent.successRate}% success
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-txt-muted">Activity Feed</h2>
          <div className="card p-4 space-y-3 max-h-[600px] overflow-y-auto">
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
                    <span className="text-xs font-medium text-txt-primary">
                      {entry.agentName}
                    </span>
                    <span className="text-[10px] text-txt-ghost font-mono">
                      {formatTime(entry.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-txt-secondary mt-0.5 leading-relaxed">
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
