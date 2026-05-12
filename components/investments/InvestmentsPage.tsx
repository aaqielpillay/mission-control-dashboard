"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Radio, Zap, DollarSign, Activity } from "lucide-react";
import { POSITIONS, TRADES, SIGNALS } from "@/lib/mock-data";
import { formatSOL, formatUSD, formatPercent, formatTime, truncateAddress } from "@/lib/utils";

export default function InvestmentsPage() {
  const [solPrice, setSolPrice] = useState(172.48); // mock live price
  const [solBalance] = useState(18.8118);

  const portfolioValue = solBalance * solPrice;
  const totalPnl = POSITIONS.reduce((sum, p) => sum + p.pnl, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-xl font-bold uppercase tracking-widest text-txt-primary">Investments</h1>
        <p className="text-sm text-txt-muted mt-1">Crypto portfolio + trading operations — live data</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign size={14} className="text-accent" />
            <span className="text-xs text-txt-muted uppercase tracking-wider">SOL Balance</span>
          </div>
          <span className="text-xl font-bold font-mono text-txt-primary">{solBalance.toFixed(4)}</span>
          <span className="text-xs text-txt-secondary ml-2">{formatUSD(portfolioValue)}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-accent" />
            <span className="text-xs text-txt-muted uppercase tracking-wider">Portfolio Value</span>
          </div>
          <span className="text-xl font-bold font-mono text-txt-primary">{formatUSD(portfolioValue)}</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            <Activity size={14} className="text-accent" />
            <span className="text-xs text-txt-muted uppercase tracking-wider">SOL Price</span>
          </div>
          <span className="text-xl font-bold font-mono text-status-green">${solPrice}</span>
          <span className="text-xs text-txt-secondary ml-1">USD</span>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-1">
            {totalPnl >= 0 ? <TrendingUp size={14} className="text-status-green" /> : <TrendingDown size={14} className="text-status-red" />}
            <span className="text-xs text-txt-muted uppercase tracking-wider">Total P&L</span>
          </div>
          <span className={`text-xl font-bold font-mono ${totalPnl >= 0 ? "text-status-green" : "text-status-red"}`}>
            {totalPnl >= 0 ? "+" : ""}{formatSOL(totalPnl)}
          </span>
        </div>
      </div>

      {/* Open Positions */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-txt-muted mb-3">Open Positions</h2>
        <div className="card overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Token</th>
                <th>Mint</th>
                <th className="text-right">Entry</th>
                <th className="text-right">Current</th>
                <th className="text-right">Size</th>
                <th className="text-right">P&L</th>
                <th className="text-right">P&L %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {POSITIONS.map((pos) => (
                <tr key={pos.id}>
                  <td className="font-semibold text-txt-primary">{pos.token}</td>
                  <td className="font-mono text-xs text-txt-muted">{truncateAddress(pos.mint, 8)}</td>
                  <td className="text-right font-mono text-sm">{pos.entryPrice.toExponential(2)}</td>
                  <td className={`text-right font-mono text-sm ${pos.currentPrice >= pos.entryPrice ? "text-status-green" : "text-status-red"}`}>
                    {pos.currentPrice.toExponential(2)}
                  </td>
                  <td className="text-right font-mono text-sm">{pos.size.toFixed(0)}</td>
                  <td className={`text-right font-mono text-sm font-bold ${pos.pnl >= 0 ? "text-status-green" : "text-status-red"}`}>
                    {pos.pnl >= 0 ? "+" : ""}{pos.pnl.toFixed(6)}
                  </td>
                  <td className={`text-right font-mono text-sm font-bold ${pos.pnlPercent >= 0 ? "text-status-green" : "text-status-red"}`}>
                    {formatPercent(pos.pnlPercent)}
                  </td>
                  <td>
                    <span className={`badge ${pos.status === "open" ? "bg-status-green/20 text-status-green border border-status-green/30" : "bg-status-yellow/20 text-status-yellow border border-status-yellow/30"}`}>
                      {pos.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Trades */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-txt-muted mb-3">Recent Trades</h2>
        <div className="card overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Token</th>
                <th>Side</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Price</th>
                <th className="text-right">P&L</th>
              </tr>
            </thead>
            <tbody>
              {TRADES.map((trade) => (
                <tr key={trade.id}>
                  <td className="font-mono text-xs text-txt-muted">{formatTime(trade.timestamp)}</td>
                  <td className="font-semibold text-txt-primary">{trade.token}</td>
                  <td>
                    <span className={`badge ${trade.side === "buy" ? "bg-status-green/20 text-status-green border border-status-green/30" : "bg-status-red/20 text-status-red border border-status-red/30"}`}>
                      {trade.side.toUpperCase()}
                    </span>
                  </td>
                  <td className="text-right font-mono text-sm">{trade.amount.toFixed(0)}</td>
                  <td className="text-right font-mono text-sm">{trade.price.toExponential(2)}</td>
                  <td className={`text-right font-mono text-sm font-bold ${trade.pnl > 0 ? "text-status-green" : trade.pnl < 0 ? "text-status-red" : "text-txt-muted"}`}>
                    {trade.pnl > 0 ? "+" : ""}{trade.pnl.toFixed(6)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Signals */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-txt-muted mb-3 flex items-center gap-2">
          <Radio size={14} className="text-status-yellow" />
          Active Signals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SIGNALS.map((sig) => (
            <div key={sig.id} className="card p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="badge bg-status-yellow/20 text-status-yellow border border-status-yellow/30">
                    {sig.source}
                  </span>
                  <span className="text-sm font-bold text-txt-primary">{sig.token}</span>
                </div>
                <span className={`text-xs font-mono ${sig.aiScore >= 25 ? "text-status-green" : "text-status-red"}`}>
                  AI {sig.aiScore}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className={`badge ${sig.direction === "buy" ? "bg-status-green/20 text-status-green" : "bg-status-red/20 text-status-red"}`}>
                  {sig.direction.toUpperCase()}
                </span>
                <span className="text-txt-secondary">Confidence: {sig.confidence}%</span>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-txt-muted font-mono">{truncateAddress(sig.mint, 8)}</span>
                <div className="flex items-center gap-2">
                  {sig.executed ? (
                    <span className="badge bg-status-green/20 text-status-green border border-status-green/30 flex items-center gap-1">
                      <Zap size={10} /> Executed
                    </span>
                  ) : (
                    <span className="badge bg-status-yellow/20 text-status-yellow border border-status-yellow/30">Pending</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
