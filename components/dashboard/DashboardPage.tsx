"use client";
import { motion } from "framer-motion";
import { Users, CheckSquare, Activity, Radio, FileText, Wallet, Calendar, Clock, AlertTriangle, Send } from "lucide-react";
import MetricCard from "@/components/shared/MetricCard";
import AgentAvatar from "@/components/shared/AgentAvatar";
import { StatusBadge } from "@/components/shared/Badges";
import { AGENTS, TASKS, ACTIVITY, SIGNALS, REPORTS } from "@/lib/mock-data";
import { formatTime } from "@/lib/utils";

function ActivityDot({ type }: { type: string }) {
  if (type === "success") return <span className="text-status-green text-[0.5rem] leading-none">●</span>;
  if (type === "warning") return <span className="text-status-yellow text-[0.5rem] leading-none">●</span>;
  if (type === "error") return <span className="text-status-red text-[0.5rem] leading-none">●</span>;
  return <span className="text-status-blue text-[0.5rem] leading-none">●</span>;
}

export default function DashboardPage() {
  const activeAgents = AGENTS.filter((a) => a.status === "active" && !a.isCEO).length;
  const tasksCompleted = TASKS.filter((t) => t.status === "done").length;
  const tasksInProgress = TASKS.filter((t) => t.status === "in_progress").length;
  const pendingReview = TASKS.filter((t) => t.status === "review").length;
  const signalsCaught = SIGNALS.filter((s) => new Date(s.timestamp) > new Date(Date.now() - 86400000)).length;
  const reportsFiled = REPORTS.filter((r) => new Date(r.date) > new Date(Date.now() - 86400000)).length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* ═══ PAGE HEADER ═══ */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-[0.15em] text-txt-primary">
            Dashboard
          </h1>
          <p className="text-[0.65rem] text-txt-muted uppercase tracking-[0.1em] mt-1">
            Mission Control — Real-time telemetry
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-status-green animate-pulse" />
          <span className="text-[0.6rem] font-semibold text-txt-muted uppercase tracking-[0.12em]">Live</span>
        </div>
      </div>

      {/* ═══ METRICS GRID ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        <MetricCard label="Active Agents" value={`${activeAgents}/10`} icon={<Users size={12} />} color="green" />
        <MetricCard label="Tasks Done" value={tasksCompleted} icon={<CheckSquare size={12} />} color="white" />
        <MetricCard label="In Progress" value={tasksInProgress} icon={<Activity size={12} />} color="blue" />
        <MetricCard label="Signals Today" value={signalsCaught} icon={<Radio size={12} />} color="yellow" />
        <MetricCard label="Reports Filed" value={reportsFiled} icon={<FileText size={12} />} color="white" />
        <MetricCard label="Open Positions" value={1} icon={<Wallet size={12} />} color="green" />
        <MetricCard label="Meetings Held" value={2} icon={<Calendar size={12} />} color="blue" />
        <MetricCard label="Pending Review" value={pendingReview} icon={<Clock size={12} />} color="yellow" />
        <MetricCard label="SOL Balance" value="18.81" icon={<Wallet size={12} />} color="green" />
        <MetricCard label="LinkedIn Posts" value={4} icon={<Send size={12} />} color="blue" />
        <MetricCard label="Alerts" value={2} icon={<AlertTriangle size={12} />} color="red" />
      </div>

      {/* ═══ TWO-COLUMN LAYOUT ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Agents Section — 3 columns */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-txt-muted">
            Agent Status
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
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
                    <span className="text-[0.75rem] font-semibold text-txt-primary truncate">
                      {agent.name}
                    </span>
                  </div>
                  <span className="text-[0.55rem] text-txt-muted uppercase tracking-[0.1em]">
                    {agent.role}
                  </span>
                  <p className="text-[0.7rem] text-txt-secondary mt-1.5 truncate leading-relaxed">
                    {agent.currentTask}
                  </p>
                  <div className="flex items-center gap-3 mt-2.5">
                    <StatusBadge status={agent.status} />
                    <span className="text-[0.55rem] text-txt-ghost font-mono">
                      {agent.successRate}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Activity Feed — 1 column */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-txt-muted">
            Activity Feed
          </h2>
          <div className="card p-4 space-y-2.5 max-h-[620px] overflow-y-auto">
            {ACTIVITY
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map((entry, i) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="flex items-start gap-2 py-1"
                >
                  <ActivityDot type={entry.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[0.7rem] font-semibold text-txt-primary">
                        {entry.agentName}
                      </span>
                      <span className="text-[0.55rem] text-txt-ghost font-mono">
                        {formatTime(entry.timestamp)}
                      </span>
                    </div>
                    <p className="text-[0.65rem] text-txt-secondary mt-0.5 leading-relaxed">
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
