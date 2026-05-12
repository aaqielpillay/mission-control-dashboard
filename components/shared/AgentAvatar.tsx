"use client";
import { motion } from "framer-motion";

interface AgentAvatarProps {
  initials: string;
  color: string;
  status?: "active" | "idle" | "offline";
  size?: "sm" | "md" | "lg";
}

export default function AgentAvatar({ initials, color, status, size = "md" }: AgentAvatarProps) {
  const sizes = { sm: "w-7 h-7 text-[10px]", md: "w-9 h-9 text-xs", lg: "w-12 h-12 text-sm" };
  const dotSizes = { sm: "w-2 h-2", md: "w-2.5 h-2.5", lg: "w-3 h-3" };
  const dotOffset = { sm: "-mr-0.5 -mb-0.5", md: "-mr-1 -mb-1", lg: "-mr-1.5 -mb-1.5" };

  const statusColor = status === "active" ? "bg-status-green" : status === "idle" ? "bg-status-yellow" : "bg-status-red";

  return (
    <div className="relative inline-flex">
      <div className={`${sizes[size]} rounded-full bg-gradient-to-br ${color} flex items-center justify-center font-bold text-white`}>
        {initials}
      </div>
      {status && (
        <span className={`absolute bottom-0 right-0 ${dotSizes[size]} ${dotOffset[size]} rounded-full ${statusColor} border-2 border-bg-secondary`} />
      )}
    </div>
  );
}
