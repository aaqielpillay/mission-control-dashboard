"use client";
import { motion } from "framer-motion";
import AgentAvatar from "@/components/shared/AgentAvatar";
import { StatusBadge } from "@/components/shared/Badges";
import { AGENTS } from "@/lib/mock-data";
import { truncate } from "@/lib/utils";

function OrgNode({ agent, isCEO = false }: { agent: typeof AGENTS[0]; isCEO?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-2"
    >
      <div className={`card p-3 flex flex-col items-center gap-2 ${isCEO ? "border-accent border-2" : ""}`}>
        <AgentAvatar initials={agent.avatarInitials} color={agent.avatarColor} status={agent.status} size="lg" />
        <div className="text-center">
          <div className="text-sm font-bold text-txt-primary">{agent.name}</div>
          <div className="text-[10px] text-txt-muted uppercase tracking-wider">{agent.role}</div>
        </div>
        {isCEO && <span className="badge bg-accent/20 text-accent border border-accent/30">CEO</span>}
        <StatusBadge status={agent.status} />
        <p className="text-[10px] text-txt-secondary text-center max-w-[120px] leading-tight">
          {truncate(agent.currentTask, 50)}
        </p>
      </div>
    </motion.div>
  );
}

export default function OrgChartPage() {
  const ceo = AGENTS.find((a) => a.isCEO)!;
  const cxo = AGENTS.filter((a) => !a.isCEO && ["CTO", "CMO", "CRO", "COO"].includes(a.department));
  const specialists = AGENTS.filter((a) => !a.isCEO && !["CTO", "CMO", "CRO", "COO"].includes(a.department));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-xl font-bold uppercase tracking-widest text-txt-primary">Org Chart</h1>
        <p className="text-sm text-txt-muted mt-1">AI Team Hierarchy — Mirror Protocol</p>
      </div>

      <div className="card p-6 overflow-x-auto">
        <div className="flex flex-col items-center gap-8 min-w-[700px]">

          {/* CEO */}
          <OrgNode agent={ceo} isCEO />

          {/* SVG Lines from CEO to CXO */}
          <svg className="absolute pointer-events-none" style={{ top: 0, left: 0, width: "100%", height: "100%" }}>
            <line x1="50%" y1="200" x2="20%" y2="280" stroke="#2d2d44" strokeWidth="1.5" />
            <line x1="50%" y1="200" x2="50%" y2="280" stroke="#2d2d44" strokeWidth="1.5" />
            <line x1="50%" y1="200" x2="80%" y2="280" stroke="#2d2d44" strokeWidth="1.5" />
          </svg>

          {/* CXO Row */}
          <div className="flex gap-8 flex-wrap justify-center">
            {cxo.map((agent) => (
              <OrgNode key={agent.id} agent={agent} />
            ))}
          </div>

          {/* SVG Lines from CXO to Specialists */}
          <svg className="absolute pointer-events-none" style={{ top: 0, left: 0, width: "100%", height: "100%" }}>
            <line x1="20%" y1="360" x2="10%" y2="420" stroke="#2d2d44" strokeWidth="1" />
            <line x1="50%" y1="360" x2="30%" y2="420" stroke="#2d2d44" strokeWidth="1" />
            <line x1="80%" y1="360" x2="50%" y2="420" stroke="#2d2d44" strokeWidth="1" />
            <line x1="20%" y1="360" x2="70%" y2="420" stroke="#2d2d44" strokeWidth="1" />
            <line x1="50%" y1="360" x2="90%" y2="420" stroke="#2d2d44" strokeWidth="1" />
          </svg>

          {/* Specialists Row */}
          <div className="flex gap-6 flex-wrap justify-center">
            {specialists.map((agent) => (
              <OrgNode key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
