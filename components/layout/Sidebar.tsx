"use client";
import {
  LayoutGrid,
  GitBranch,
  CheckSquare,
  Calendar,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Settings,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

type Section = string; // allow any section id

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
      animate={{ width: collapsed ? 60 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-screen bg-surface border-r border-border-subtle flex flex-col relative z-20"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-border-subtle flex-shrink-0">
        <div className="w-7 h-7 rounded bg-accent/20 flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L3 8H8L5 15L13 6H8L11 1H8Z" fill="#5e6ad2" />
          </svg>
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm font-semibold text-txt-primary tracking-tight"
          >
            Mission Control
          </motion.span>
        )}
      </div>

      {/* Nav */}
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

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="flex items-center justify-center h-12 border-t border-border-subtle text-txt-ghost hover:text-txt-muted transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </motion.aside>
  );
}
