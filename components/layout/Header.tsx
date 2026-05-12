"use client";
import { Menu } from "lucide-react";
import { useClock } from "@/lib/hooks";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const now = useClock();

  const utc = now.toLocaleTimeString("en-GB", { hour12: false, timeZone: "UTC" });
  const sast = now.toLocaleTimeString("en-GB", { hour12: false, timeZone: "Africa/Johannesburg" });
  const date = now.toLocaleDateString("en-GB", { timeZone: "Africa/Johannesburg" });

  return (
    <header className="h-12 bg-surface border-b border-border-subtle flex items-center justify-between px-4 flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded hover:bg-surface-raised transition-colors text-txt-ghost hover:text-txt-muted lg:hidden"
        >
          <Menu size={16} />
        </button>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium text-txt-muted">Live</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <div className="text-txt-ghost text-[10px]">UTC</div>
            <div className="text-txt-secondary font-mono font-medium">{utc}</div>
          </div>
          <div className="text-right">
            <div className="text-txt-ghost text-[10px]">SAST</div>
            <div className="text-txt-secondary font-mono font-medium">{sast}</div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-txt-ghost text-[10px]">Date</div>
            <div className="text-txt-muted font-medium">{date}</div>
          </div>
        </div>

        <div className="h-4 w-px bg-border-subtle" />

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-medium text-txt-ghost uppercase tracking-wider">SSE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        </div>
      </div>
    </header>
  );
}
