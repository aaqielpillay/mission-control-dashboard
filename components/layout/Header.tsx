"use client";
import { Menu } from "lucide-react";
import { useClock } from "@/lib/hooks";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const now = useClock();

  const utc = now.toLocaleTimeString("en-GB", { hour12: false, timeZone: "UTC" });
  const sart = now.toLocaleTimeString("en-GB", { hour12: false, timeZone: "Africa/Johannesburg" });
  const date = now.toLocaleDateString("en-GB", { timeZone: "Africa/Johannesburg" });

  return (
    <header className="h-14 bg-transparent border-b border-[rgba(255,255,255,0.05)] flex items-center justify-between px-4 flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded hover:bg-[rgba(255,255,255,0.04)] transition-colors text-txt-muted hover:text-txt-primary lg:hidden"
        >
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-status-green animate-pulse" />
          <span className="text-[0.6rem] font-semibold text-txt-muted uppercase tracking-[0.12em]">
            Live
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        {/* Clocks */}
        <div className="flex items-center gap-5 text-[0.65rem]">
          <div className="text-right">
            <div className="text-txt-ghost uppercase tracking-[0.08em]">UTC</div>
            <div className="text-txt-primary font-mono font-medium">{utc}</div>
          </div>
          <div className="text-right">
            <div className="text-txt-ghost uppercase tracking-[0.08em]">SAST</div>
            <div className="text-txt-primary font-mono font-medium">{sart}</div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-txt-ghost uppercase tracking-[0.08em]">Date</div>
            <div className="text-txt-secondary font-medium">{date}</div>
          </div>
        </div>

        {/* SSE indicator */}
        <div className="flex items-center gap-1.5 text-txt-muted">
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-txt-ghost">SSE</span>
        </div>
      </div>
    </header>
  );
}
