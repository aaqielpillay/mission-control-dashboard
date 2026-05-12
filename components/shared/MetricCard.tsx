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
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-4 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-[0.6rem] font-semibold text-txt-muted uppercase tracking-[0.1em]">{label}</span>
        {icon && <span className="text-txt-ghost">{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-xl font-bold font-mono tracking-tight ${colorMap[color]}`}>{value}</span>
        {trend && (
          <span className={`text-xs ${trend === "up" ? "text-status-green" : trend === "down" ? "text-status-red" : "text-txt-muted"}`}>
            {trend === "up" ? "▲" : trend === "down" ? "▼" : "—"}
          </span>
        )}
      </div>
    </motion.div>
  );
}
