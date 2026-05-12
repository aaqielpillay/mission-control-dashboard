"use client";
import { motion } from "framer-motion";
import { Users, CheckSquare, Activity, Radio, FileText, Wallet, Calendar, Clock, AlertTriangle, Send, Bell } from "lucide-react";
import MetricCard from "@/components/shared/MetricCard";
import AgentAvatar from "@/components/shared/AgentAvatar";
import { PriorityBadge, StatusBadge } from "@/components/shared/Badges";
import { AGENTS, TASKS, ACTIVITY, SIGNALS, REPORTS } from "@/lib/mock-data";
import { formatTime, timeAgo } from "@/lib/utils";

function ActivityColorDot({ type }: { type: string }) {
  if (type === "success") return <span className="text-status-green">●</span>;
  if (type === "warning") return <span className="text-status-yellow">●</span>;
  if (type === "error") return <span className="text-status-red">●</span>;
  return <span className="text-status-blue">●</span>;
}

export default function DashboardPage() {
  const activeAgents = AGENTS.filter((a) => a.status === "active" && !a.isCEO).length;
  const tasksCompleted = TASKS.filter((t) => t.status === "done").length;
  const tasksInProgress = TASKS.filter((t) => t.status === "in_progress").length;
  const pendingReview = TASKS.filter((t) => t.status === "review").length;
  const signalsCaught = SIGNALS.filter((s) => new Date(s.timestamp) > new Date(Date.now() - 86400000)).length;
  const reportsFiled = REPORTS.filter((r) => new Date(r.date) > new Date(Date.now() - 86400000)).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest text-txt-primary">Dashboard</h1>
          <p className="text-sm text-txt-muted mt-1">Mission Control — Real-time overview</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-txt-muted">
          <span className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
          <span>Live</span>
        </div>
      </div>

      {/* 11 Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <MetricCard label="Active Agents" value={`${activeAgents}/10`} icon={<Users size={14} />} color="green" />
        <MetricCard label="Tasks Done" value={tasksCompleted} icon={<CheckSquare size={14} />} color="purple" />
        <MetricCard label="In Progress" value={tasksInProgress} icon={<Activity size={14} />} color="blue" />
        <MetricCard label="Signals Today" value={signalsCaught} icon={<Radio size={14} />} color="yellow" />
        <MetricCard label="Reports Filed" value={reportsFiled} icon={<FileText size={14} />} color="purple" />
        <MetricCard label="Open Positions" value={1} icon={<Wallet size={14} />} color="green" />
        <MetricCard label="Meetings Held" value={2} icon={<Calendar size={14} />} color="blue" />
        <MetricCard label="Pending Review" value={pendingReview} icon={<Clock size={14} />} color="yellow" />
        <MetricCard label="SOL Balance" value="18.81" icon={<Wallet size={14} />} color="green" />
        <MetricCard label="LinkedIn Posts" value={4} icon={<Send size={14} />} color="blue" />
        <MetricCard label="Alerts" value={2} icon={<AlertTriangle size={14} />} color="red" />
      </div>

      {/* Main Grid: Agent Cards + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Status Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-txt-muted">Agent Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {AGENTS.filter((a) => !a.isCEO).map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
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
                    <span className="text-sm font-semibold text-txt-primary truncate">{agent.name}</span>
                  </div>
                  <span className="text-[10px] text-txt-muted uppercase tracking-wider">{agent.role}</span>
                  <p className="text-xs text-txt-secondary mt-1 truncate">{agent.currentTask}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <StatusBadge status={agent.status} />
                    <span className="text-[10px] text-txt-muted">{agent.successRate}% success</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-txt-muted">Activity Feed</h2>
          <div className="card p-4 space-y-3 max-h-[600px] overflow-y-auto">
            {ACTIVITY.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-start gap-2.5"
              >
                <ActivityColorDot type={entry.type} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-accent">{entry.agentName}</span>
                    <span className="text-[10px] text-txt-muted font-mono">{formatTime(entry.timestamp)}</span>
                  </div>
                  <p className="text-xs text-txt-secondary mt-0.5 leading-relaxed">{entry.action}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
