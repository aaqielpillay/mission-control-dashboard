"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import AgentAvatar from "@/components/shared/AgentAvatar";
import { AGENTS, REPORTS } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import type { ReportType } from "@/lib/types";

const REPORT_TYPE_CONFIG: Record<ReportType, { label: string; color: string; bg: string; border: string }> = {
  daily_standup: { label: "Daily Standup", color: "text-status-blue", bg: "bg-status-blue/20", border: "border-status-blue/30" },
  trade_confirmation: { label: "Trade Confirmation", color: "text-status-green", bg: "bg-status-green/20", border: "border-status-green/30" },
  signal_alert: { label: "Signal Alert", color: "text-status-yellow", bg: "bg-status-yellow/20", border: "border-status-yellow/30" },
  linkedin_report: { label: "LinkedIn Report", color: "text-accent", bg: "bg-accent/20", border: "border-accent/30" },
  debt_elimination: { label: "Debt Elimination", color: "text-status-red", bg: "bg-status-red/20", border: "border-status-red/30" },
  risk_audit: { label: "Risk Audit", color: "text-orange-400", bg: "bg-orange-400/20", border: "border-orange-400/30" },
  twitter_alpha: { label: "Twitter Alpha", color: "text-cyan-400", bg: "bg-cyan-400/20", border: "border-cyan-400/30" },
  cross_reference: { label: "Cross Reference", color: "text-violet-400", bg: "bg-violet-400/20", border: "border-violet-400/30" },
};

function ReportCard({ report }: { report: typeof REPORTS[0] }) {
  const [expanded, setExpanded] = useState(false);
  const config = REPORT_TYPE_CONFIG[report.type];
  const author = AGENTS.find((a) => a.id === report.authorId);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-4 hover:bg-bg-secondary/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-xs text-txt-muted font-mono flex-shrink-0">{formatDate(report.date)}</span>
          <span className={`badge ${config.bg} ${config.color} border ${config.border} flex-shrink-0`}>
            {config.label}
          </span>
          {author && (
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <AgentAvatar initials={author.avatarInitials} color={author.avatarColor} size="sm" />
              <span className="text-xs text-txt-secondary truncate">{author.name}</span>
            </div>
          )}
          <p className="text-sm text-txt-secondary truncate flex-1 text-left">{report.preview}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-txt-muted hidden sm:block">
            {report.actionItems.length} actions
          </span>
          {expanded ? <ChevronUp size={14} className="text-txt-muted" /> : <ChevronDown size={14} className="text-txt-muted" />}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="border-t border-border overflow-hidden"
          >
            <div className="p-4 space-y-4">
              <div className="text-sm text-txt-secondary leading-relaxed">{report.content}</div>
              {report.actionItems.length > 0 && (
                <div>
                  <span className="text-[10px] text-txt-muted uppercase tracking-wider font-semibold">Action Items</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {report.actionItems.map((item, i) => (
                      <span key={i} className="badge bg-accent/20 text-accent border border-accent/30">{item}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ReportsPage() {
  const [filter, setFilter] = useState<ReportType | "all">("all");
  const types = Object.keys(REPORT_TYPE_CONFIG) as ReportType[];

  const filtered = filter === "all" ? REPORTS : REPORTS.filter((r) => r.type === filter);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-widest text-txt-primary">Reports</h1>
          <p className="text-sm text-txt-muted mt-1">Filed reports — {REPORTS.length} total</p>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-txt-muted" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as ReportType | "all")}
            className="text-xs bg-bg-secondary border border-border rounded-lg px-3 py-1.5 text-txt-secondary"
          >
            <option value="all">All Types</option>
            {types.map((t) => (
              <option key={t} value={t}>{REPORT_TYPE_CONFIG[t].label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {filtered
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
      </div>
    </motion.div>
  );
}
