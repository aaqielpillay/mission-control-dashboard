"use client";

interface AgentAvatarProps {
  initials: string;
  color: string;
  status?: "active" | "idle" | "offline";
  size?: "sm" | "md" | "lg";
}

export default function AgentAvatar({ initials, color, status, size = "md" }: AgentAvatarProps) {
  const sizes = { sm: "w-6 h-6 text-[10px]", md: "w-8 h-8 text-xs", lg: "w-10 h-10 text-sm" };
  const dotSizes = { sm: "w-1.5 h-1.5", md: "w-2 h-2", lg: "w-2.5 h-2.5" };
  const dotOffset = { sm: "-right-0.5 -bottom-0.5", md: "-right-0.5 -bottom-0.5", lg: "-right-1 -bottom-1" };

  const statusColor =
    status === "active" ? "bg-success" :
    status === "idle" ? "bg-warning" :
    "bg-danger";

  return (
    <div className="relative inline-flex flex-shrink-0">
      <div
        className={`${sizes[size]} rounded-full bg-gradient-to-br ${color} flex items-center justify-center font-semibold text-white`}
      >
        {initials}
      </div>
      {status && (
        <span
          className={`absolute ${dotSizes[size]} ${dotOffset[size]} rounded-full ${statusColor} ring-2 ring-surface`}
        />
      )}
    </div>
  );
}
