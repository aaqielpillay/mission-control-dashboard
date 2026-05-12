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
      animate={{ width: collapsed ? 64 : 260 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-screen bg-transparent border-r border-[rgba(255,255,255,0.05)] flex flex-col relative z-10"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-[rgba(255,255,255,0.05)] flex-shrink-0">
        <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 text-txt-primary">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="2" width="7" height="7" rx="1" fill="currentColor" opacity="0.3" />
            <rect x="11" y="2" width="7" height="7" rx="1" fill="currentColor" opacity="0.6" />
            <rect x="2" y="11" width="7" height="7" rx="1" fill="currentColor" opacity="0.6" />
            <rect x="11" y="11" width="7" height="7" rx="1" fill="currentColor" />
          </svg>
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-xs font-bold uppercase tracking-[0.15em] text-txt-primary"
          >
            Mission Control
          </motion.span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full sidebar-item ${section === item.id ? "active" : ""}`}
            title={collapsed ? item.label : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="truncate text-[0.7rem] uppercase tracking-[0.08em]"
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
        className="flex items-center justify-center h-12 border-t border-[rgba(255,255,255,0.05)] text-txt-muted hover:text-txt-primary transition-colors"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
    </motion.aside>
  );
}
