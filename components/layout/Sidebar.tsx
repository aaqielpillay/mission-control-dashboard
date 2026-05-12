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
  { id: "dashboard", label: "Dashboard", icon: <LayoutGrid size={20} /> },
  { id: "org-chart", label: "Org Chart", icon: <GitBranch size={20} /> },
  { id: "tasks", label: "Tasks Board", icon: <CheckSquare size={20} /> },
  { id: "standups", label: "Standups", icon: <Calendar size={20} /> },
  { id: "boardroom", label: "Boardroom", icon: <MessageSquare size={20} /> },
  { id: "finance", label: "Finance Tracker", icon: <DollarSign size={20} /> },
  { id: "investments", label: "Investments", icon: <TrendingUp size={20} /> },
  { id: "agent-config", label: "Agent Config", icon: <Settings size={20} /> },
  { id: "reports", label: "Reports", icon: <FileText size={20} /> },
];

export default function Sidebar({ section, onNavigate, collapsed, onToggle }: SidebarProps) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 260 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-screen bg-bg-secondary border-r border-border flex flex-col relative z-10"
    >
      {/* Logo / Header */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-border flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">MP</span>
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm font-bold uppercase tracking-widest text-txt-primary"
          >
            Mission Control
          </motion.span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-0.5">
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
                className="truncate"
              >
                {item.label}
              </motion.span>
            )}
          </button>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center h-12 border-t border-border text-txt-muted hover:text-txt-primary transition-colors"
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </motion.aside>
  );
}
