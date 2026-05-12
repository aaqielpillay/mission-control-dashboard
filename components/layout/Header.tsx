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
    <header className="h-16 bg-[rgba(5,5,7,0.9)] backdrop-blur-sm border-b border-border flex items-center justify-between px-5 flex-shrink-0">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md border border-border text-txt-muted hover:text-accent hover:border-accent transition-colors lg:hidden"
        >
          <Menu size={18} />
        </button>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[0.62rem] font-semibold text-txt-muted uppercase tracking-[0.18em]">
            Telemetry Online
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-5 text-[0.68rem]">
          <div className="text-right">
            <div className="text-txt-ghost uppercase tracking-[0.14em]">UTC</div>
            <div className="text-txt-primary font-mono font-semibold tracking-tight">{utc}</div>
          </div>
          <div className="text-right">
            <div className="text-txt-ghost uppercase tracking-[0.14em]">SAST</div>
            <div className="text-txt-primary font-mono font-semibold tracking-tight">{sart}</div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-txt-ghost uppercase tracking-[0.14em]">Date</div>
            <div className="text-txt-secondary font-medium">{date}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-accent">
          <span className="text-[0.62rem] font-semibold uppercase tracking-[0.16em]">SSE LINK</span>
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        </div>
      </div>
    </header>
  );
}
