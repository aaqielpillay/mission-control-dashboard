"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Power } from "lucide-react";
import AgentAvatar from "@/components/shared/AgentAvatar";
import { DepartmentBadge, StatusBadge } from "@/components/shared/Badges";
import { AGENTS } from "@/lib/mock-data";

export default function AgentConfigPage() {
  const [agents, setAgents] = useState(AGENTS);
  const [saved, setSaved] = useState<string | null>(null);

  const updateAgent = (id: string, field: string, value: unknown) => {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, [field]: value } : a)));
  };

  const handleSave = (id: string) => {
    setSaved(id);
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-xl font-bold uppercase tracking-widest text-txt-primary">Agent Config</h1>
        <p className="text-sm text-txt-muted mt-1">Per-agent settings — prompts, toggles, and status</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {agents.filter((a) => !a.isCEO).map((agent) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-5 space-y-4"
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <AgentAvatar initials={agent.avatarInitials} color={agent.avatarColor} status={agent.status} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-txt-primary">{agent.name}</span>
                  <DepartmentBadge dept={agent.department} />
                </div>
                <span className="text-sm text-txt-secondary">{agent.role}</span>
                <div className="mt-1">
                  <StatusBadge status={agent.status} />
                </div>
              </div>
            </div>

            {/* Tools */}
            {agent.tools.length > 0 && (
              <div>
                <span className="text-[10px] text-txt-muted uppercase tracking-wider font-semibold">Tools Access</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {agent.tools.map((tool) => (
                    <span key={tool} className="badge bg-bg-secondary text-txt-secondary border border-border">{tool}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Prompt */}
            <div>
              <label className="text-[10px] text-txt-muted uppercase tracking-wider font-semibold block mb-1">
                Custom Prompt / Instructions
              </label>
              <textarea
                value={agent.customPrompt}
                onChange={(e) => updateAgent(agent.id, "customPrompt", e.target.value)}
                rows={4}
                className="resize-none text-xs leading-relaxed"
                placeholder="Override agent behavior..."
              />
            </div>

            {/* Toggle + Save */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-2">
                <Power size={14} className={agent.enabled ? "text-status-green" : "text-status-red"} />
                <span className="text-xs text-txt-secondary">Agent {agent.enabled ? "Enabled" : "Disabled"}</span>
                <button
                  onClick={() => updateAgent(agent.id, "enabled", !agent.enabled)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${agent.enabled ? "bg-status-green" : "bg-bg-secondary border border-border"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${agent.enabled ? "left-5" : "left-0.5"}`} />
                </button>
              </div>
              <button
                onClick={() => handleSave(agent.id)}
                className="btn btn-primary text-xs"
              >
                {saved === agent.id ? (
                  <span className="text-status-green">Saved ✓</span>
                ) : (
                  <>
                    <Save size={12} /> Save
                  </>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
