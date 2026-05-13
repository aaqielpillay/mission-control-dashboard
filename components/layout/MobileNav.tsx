"use client";
import { LayoutGrid, CheckSquare, MessageSquare, TrendingUp, DollarSign } from "lucide-react";

type Section = string; // allow any section id

interface MobileNavProps {
  section: Section;
  onNavigate: (s: Section) => void;
}

const NAV_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Home", icon: <LayoutGrid size={18} /> },
  { id: "tasks", label: "Tasks", icon: <CheckSquare size={18} /> },
  { id: "boardroom", label: "Chat", icon: <MessageSquare size={18} /> },
  { id: "investments", label: "Invest", icon: <TrendingUp size={18} /> },
  { id: "finance", label: "Finance", icon: <DollarSign size={18} /> },
];

export default function MobileNav({ section, onNavigate }: MobileNavProps) {
  return (
    <nav className="flex items-center justify-around h-14 px-2">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded transition-colors ${
            section === item.id
              ? "text-accent"
              : "text-txt-ghost"
          }`}
        >
          {item.icon}
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
