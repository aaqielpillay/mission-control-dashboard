"use client";
import { Menu, Wifi, WifiOff } from "lucide-react";
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
    <header className="h-14 bg-bg-secondary border-b border-border flex items-center justify-between px-4 flex-shrink-0">
      {/* Left: Menu + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-bg-card transition-colors text-txt-secondary hover:text-txt-primary lg:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-status-green animate-pulse" />
          <span className="text-xs font-medium text-txt-secondary uppercase tracking-wider">
            Live
          </span>
        </div>
      </div>

      {/* Right: Clock + Connection */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <div className="text-txt-muted">UTC</div>
            <div className="text-txt-primary font-mono font-medium">{utc}</div>
          </div>
          <div className="text-right">
            <div className="text-txt-muted">SAST</div>
            <div className="text-txt-primary font-mono font-medium">{sart}</div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="text-txt-muted">Date</div>
            <div className="text-txt-secondary font-medium">{date}</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-status-green">
          <Wifi size={14} />
          <span className="text-[10px] font-semibold uppercase tracking-wider">SSE</span>
        </div>
      </div>
    </header>
  );
}
