"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  color?: "green" | "yellow" | "red" | "blue" | "white";
}

const colorMap = {
  green: "text-status-green",
  yellow: "text-status-yellow",
  red: "text-status-red",
  blue: "text-status-blue",
  white: "text-txt-primary",
};

export default function MetricCard({ label, value, icon, trend, color = "white" }: MetricCardProps) {
  const borderHighlight = color === "white" ? "border-border" : "border-border";
  const accentColor = colorMap[color] ?? "text-txt-primary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`card p-4 flex flex-col gap-2 bg-[rgba(16,16,16,0.9)] ${borderHighlight}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[0.55rem] font-semibold text-txt-muted uppercase tracking-[0.16em]">{label}</span>
        {icon && <span className="text-txt-ghost">{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-xl font-bold font-mono tracking-tight ${accentColor}`}>{value}</span>
        {trend && (
          <span className={`text-xs ${trend === "up" ? "text-status-green" : trend === "down" ? "text-status-red" : "text-txt-muted"}`}>
            {trend === "up" ? "▲" : trend === "down" ? "▼" : "--"}
          </span>
        )}
      </div>
    </motion.div>
  );
}
