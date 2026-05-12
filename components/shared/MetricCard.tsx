"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  color?: "green" | "yellow" | "red" | "blue" | "accent";
}

const colorMap = {
  green: "text-success",
  yellow: "text-warning",
  red: "text-danger",
  blue: "text-info",
  accent: "text-accent",
};

export default function MetricCard({ label, value, icon, trend, color = "accent" }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 flex flex-col gap-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-txt-muted font-medium">{label}</span>
        {icon && <span className="text-txt-ghost">{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <span className={`text-2xl font-semibold font-mono tracking-tight ${colorMap[color]}`}>
          {value}
        </span>
        {trend && (
          <span className={`text-xs ${trend === "up" ? "text-success" : trend === "down" ? "text-danger" : "text-txt-ghost"}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        )}
      </div>
    </motion.div>
  );
}
