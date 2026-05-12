"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  color?: "green" | "yellow" | "red" | "blue" | "purple";
}

export default function MetricCard({ label, value, icon, trend, color = "purple" }: MetricCardProps) {
  const colors = {
    green: "text-status-green",
    yellow: "text-status-yellow",
    red: "text-status-red",
    blue: "text-status-blue",
    purple: "text-accent",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-txt-muted uppercase tracking-wider font-semibold">{label}</span>
        {icon && <span className="text-txt-muted">{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-2xl font-bold font-mono ${colors[color]}`}>{value}</span>
        {trend && (
          <span className={`text-xs ${trend === "up" ? "text-status-green" : trend === "down" ? "text-status-red" : "text-txt-muted"}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        )}
      </div>
    </motion.div>
  );
}
