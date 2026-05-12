"use client";

interface AgentAvatarProps {
  initials: string;
  color: string;
  status?: "active" | "idle" | "offline";
  size?: "sm" | "md" | "lg";
}

export default function AgentAvatar({ initials, color, status, size = "md" }: AgentAvatarProps) {
  const sizes = { sm: "w-7 h-7 text-[0.6rem]", md: "w-9 h-9 text-[0.7rem]", lg: "w-12 h-12 text-xs" };
  const dotSizes = { sm: "w-1.5 h-1.5", md: "w-2 h-2", lg: "w-2.5 h-2.5" };
  const dotOffset = { sm: "-right-0.5 -bottom-0.5", md: "-right-0.5 -bottom-0.5", lg: "-right-1 -bottom-1" };

  const statusColor =
    status === "active" ? "bg-status-green" :
    status === "idle" ? "bg-status-yellow" :
    "bg-status-red";

  return (
    <div className="relative inline-flex flex-shrink-0">
      <div
        className={`${sizes[size]} rounded-full bg-gradient-to-br ${color} flex items-center justify-center font-bold text-white`}
      >
        {initials}
      </div>
      {status && (
        <span
          className={`absolute ${dotSizes[size]} ${dotOffset[size]} rounded-full ${statusColor} ring-1 ring-black`}
        />
      )}
    </div>
  );
}
