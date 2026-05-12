"use client";

export function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  const cls = {
    high: "badge badge-danger",
    medium: "badge badge-warning",
    low: "badge badge-success",
  };
  return <span className={cls[priority]}>{priority}</span>;
}

export function DepartmentBadge({ dept }: { dept: string }) {
  return <span className="badge">{dept}</span>;
}

export function StatusBadge({ status }: { status: "active" | "idle" | "offline" }) {
  const labels = { active: "Active", idle: "Idle", offline: "Offline" };
  const dots = {
    active: "status-dot status-active",
    idle: "status-dot status-idle",
    offline: "status-dot status-offline",
  };
  const colors = {
    active: "text-success",
    idle: "text-warning",
    offline: "text-danger",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${colors[status]}`}>
      <span className={dots[status]} />
      {labels[status]}
    </span>
  );
}
