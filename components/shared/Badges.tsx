"use client";
import type { Priority, AgentStatus } from "@/lib/types";

interface PriorityBadgeProps {
  priority: Priority;
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const styles = {
    high: "bg-red-500/20 text-red-400 border border-red-500/30",
    medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    low: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
  };
  return (
    <span className={`badge ${styles[priority]}`}>
      {priority}
    </span>
  );
}

interface StatusBadgeProps {
  status: AgentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`status-dot status-${status}`} />
      <span className="text-xs text-txt-secondary capitalize">{status}</span>
    </div>
  );
}

interface DepartmentBadgeProps {
  dept: string;
}

export function DepartmentBadge({ dept }: DepartmentBadgeProps) {
  const colors: Record<string, string> = {
    CEO: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    CTO: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    CMO: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    CRO: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    COO: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    specialist: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };
  return (
    <span className={`badge ${colors[dept] || colors.specialist}`}>
      {dept}
    </span>
  );
}
