"use client";

export function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  const cls = {
    high: "badge badge-high",
    medium: "badge badge-medium",
    low: "badge badge-low",
  };
  return <span className={cls[priority]}>{priority}</span>;
}

export function DepartmentBadge({ dept }: { dept: string }) {
  return (
    <span className="badge bg-[rgba(240,240,250,0.08)] text-txt-secondary border border-[rgba(255,255,255,0.06)]">
      {dept}
    </span>
  );
}

export function StatusBadge({ status }: { status: "active" | "idle" | "offline" }) {
  const labels = { active: "ACTIVE", idle: "IDLE", offline: "OFF" };
  const dots = { active: "status-dot status-active", idle: "status-dot status-idle", offline: "status-dot status-offline" };

  return (
    <span className="inline-flex items-center gap-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.08em] text-txt-muted">
      <span className={dots[status]} />
      {labels[status]}
    </span>
  );
}
