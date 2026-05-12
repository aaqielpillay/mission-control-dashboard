"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, ArrowRight } from "lucide-react";
import AgentAvatar from "@/components/shared/AgentAvatar";
import { DepartmentBadge } from "@/components/shared/Badges";
import { AGENTS, COMMS } from "@/lib/mock-data";
import { formatTime } from "@/lib/utils";

export default function BoardroomPage() {
  const [filter, setFilter] = useState<string>("all");
  const [messages] = useState(COMMS);

  const filtered = filter === "all" ? messages : messages.filter(
    (m) => m.senderId === filter || m.recipientId === filter
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest text-txt-primary">Boardroom</h1>
          <p className="text-sm text-txt-muted mt-1">Live inter-agent communications — Mirror Protocol team</p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-xs bg-bg-secondary border border-border rounded-lg px-3 py-1.5 text-txt-secondary w-auto"
        >
          <option value="all">All Agents</option>
          {AGENTS.filter((a) => !a.isCEO).map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
        <span className="text-xs text-txt-muted">Live feed — {filtered.length} messages</span>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {[...filtered]
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
          .map((msg, i) => {
            const sender = AGENTS.find((a) => a.id === msg.senderId);
            const recipient = AGENTS.find((a) => a.id === msg.recipientId);
            if (!sender) return null;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="card p-4"
              >
                <div className="flex items-start gap-3">
                  <AgentAvatar initials={sender.avatarInitials} color={sender.avatarColor} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-txt-primary">{sender.name}</span>
                      <DepartmentBadge dept={sender.department} />
                      <ArrowRight size={12} className="text-txt-muted" />
                      <span className="text-xs text-txt-secondary">{recipient?.name || "All"}</span>
                      <span className="text-[10px] text-txt-muted font-mono ml-auto">{formatTime(msg.timestamp)}</span>
                    </div>
                    <p className="text-sm text-txt-secondary mt-2 leading-relaxed">{msg.content}</p>
                    {!msg.read && (
                      <span className="inline-block mt-2 badge bg-accent/20 text-accent border border-accent/30 text-[10px]">New</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
      </div>
    </motion.div>
  );
}
