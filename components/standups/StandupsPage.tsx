"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import AgentAvatar from "@/components/shared/AgentAvatar";
import { AGENTS, STANDUPS } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export default function StandupsPage() {
  const [expanded, setExpanded] = useState<string | null>(STANDUPS[0]?.id || null);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-xl font-bold uppercase tracking-widest text-txt-primary">Standups</h1>
        <p className="text-sm text-txt-muted mt-1">Daily autonomous standup meetings — Mirror Protocol team</p>
      </div>

      <div className="space-y-4">
        {STANDUPS.map((standup) => {
          const isOpen = expanded === standup.id;
          return (
            <motion.div
              key={standup.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card overflow-hidden"
            >
              {/* Header */}
              <button
                className="w-full flex items-center justify-between p-4 hover:bg-bg-secondary/50 transition-colors"
                onClick={() => setExpanded(isOpen ? null : standup.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-sm font-bold text-txt-primary">{formatDate(standup.date)}</div>
                  <div className="flex -space-x-2">
                    {standup.participants.map((pid) => {
                      const a = AGENTS.find((ag) => ag.id === pid);
                      if (!a) return null;
                      return (
                        <div key={pid} className="ring-2 ring-bg-card rounded-full">
                          <AgentAvatar initials={a.avatarInitials} color={a.avatarColor} size="sm" />
                        </div>
                      );
                    })}
                  </div>
                  <span className="text-xs text-txt-muted">{standup.participants.length} agents</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-txt-muted hidden sm:block">
                    {standup.reports.length} reports
                  </span>
                  {isOpen ? <ChevronUp size={16} className="text-txt-muted" /> : <ChevronDown size={16} className="text-txt-muted" />}
                </div>
              </button>

              {/* Reports */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    className="border-t border-border overflow-hidden"
                  >
                    <div className="p-4 space-y-4">
                      {standup.reports.map((report) => {
                        const agent = AGENTS.find((a) => a.id === report.agentId);
                        if (!agent) return null;
                        return (
                          <div key={report.agentId} className="flex gap-4 p-4 bg-bg-secondary/50 rounded-lg">
                            <AgentAvatar initials={agent.avatarInitials} color={agent.avatarColor} size="md" />
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-txt-primary">{agent.name}</span>
                                <span className="text-xs text-txt-muted uppercase tracking-wider">{agent.role}</span>
                              </div>
                              <div className="space-y-2 text-xs">
                                <div>
                                  <span className="font-semibold text-txt-secondary">Yesterday: </span>
                                  <span className="text-txt-muted">{report.yesterday}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-txt-secondary">Today: </span>
                                  <span className="text-txt-muted">{report.today}</span>
                                </div>
                                {report.blockers && (
                                  <div className="flex items-start gap-1.5 text-status-red">
                                    <AlertTriangle size={12} className="mt-0.5 flex-shrink-0" />
                                    <span className="font-semibold">Blocker: </span>
                                    <span>{report.blockers}</span>
                                  </div>
                                )}
                                {report.actionItems.length > 0 && (
                                  <div>
                                    <span className="font-semibold text-txt-secondary">Actions: </span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {report.actionItems.map((item, i) => (
                                        <span key={i} className="badge bg-accent/20 text-accent border border-accent/30">{item}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
