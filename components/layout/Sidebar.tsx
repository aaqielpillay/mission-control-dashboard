"use client";
import { LayoutGrid, GitBranch, CheckSquare, Calendar, MessageSquare, DollarSign, TrendingUp, Settings, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Section } from "@/app/page";

interface SidebarProps {
  section: Section;
  onNavigate: (s: Section) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutGrid size={16} /> },
  { id: "org-chart", label: "Org Chart", icon: <GitBranch size={16} /> },
  { id: "tasks", label: "Tasks", icon: <CheckSquare size={16} /> },
  { id: "standups", label: "Standups", icon: <Calendar size={16} /> },
  { id: "boardroom", label: "Boardroom", icon: <MessageSquare size={16} /> },
  { id: "finance", label: "Finance", icon: <DollarSign size={16} /> },
  { id: "investments", label: "Investments", icon: <TrendingUp size={16} /> },
  { id: "agent-config", label: "Agent Config", icon: <Settings size={16} /> },
  { id: "reports", label: "Reports", icon: <FileText size={16} /> },
];

export default function Sidebar({ section, onNavigate, collapsed, onToggle }: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 66 : 256 }}
      transition={{ duration: 0.22, ease: "easeInOut" }}
      className="h-screen bg-[rgba(5,5,7,0.88)] backdrop-blur-sm border-r border-border flex flex-col relative z-20"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border flex-shrink-0">
        <div className="w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 text-accent bg-[rgba(0,217,146,0.08)] border border-[rgba(0,217,146,0.35)] animate-glow">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L4 10H10L6 18L16 8H10L14 2H10Z" fill="currentColor" />
          </svg>
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-txt-secondary"
          >
            Mission Control
          </motion.span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-5 px-3 overflow-y-auto space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full sidebar-item relative ${section === item.id ? "active" : ""}`}
            title={collapsed ? item.label : undefined}
          >
            {!collapsed && (
              <span
                className={`h-8 w-0.5 rounded-full transition-all ${
                  section === item.id ? "bg-accent" : "bg-transparent"
                }`}
              />
            )}
            <span className="flex-shrink-0 text-[0.85rem]">{item.icon}</span>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="truncate text-[0.68rem] uppercase tracking-[0.1em]"
              >
                {item.label}
              </motion.span>
            )}
          </button>
        ))}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center h-14 border-t border-border text-txt-muted hover:text-accent transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </motion.aside>
  );
}
