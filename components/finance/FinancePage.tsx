"use client";
import { motion } from "framer-motion";
import { TrendingDown, CheckCircle2, Circle, Clock } from "lucide-react";
import { DEBTS, BANK_ACCOUNTS, INCOMING_FUNDS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

function DebtCard({ debt }: { debt: typeof DEBTS[0] }) {
  const progress = ((debt.amount - debt.balance) / debt.amount) * 100;
  const isPaid = debt.status === "paid";
  const statusIcon = isPaid ? (
    <CheckCircle2 size={14} className="text-status-green" />
  ) : debt.status === "in_progress" ? (
    <Clock size={14} className="text-status-yellow" />
  ) : (
    <Circle size={14} className="text-txt-muted" />
  );
  const statusColor = isPaid ? "text-status-green" : debt.status === "planned" ? "text-status-yellow" : "text-txt-muted";

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {statusIcon}
          <span className="text-sm font-semibold text-txt-primary">{debt.name}</span>
        </div>
        <span className={`text-xs font-semibold uppercase tracking-wider ${statusColor}`}>{debt.status}</span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <span className="text-lg font-bold font-mono text-txt-primary">
            {formatCurrency(debt.balance > 0 ? debt.balance : debt.amount)}
          </span>
          {debt.balance > 0 && (
            <span className="text-xs text-txt-muted ml-2 line-through">
              {formatCurrency(debt.amount)}
            </span>
          )}
        </div>
        <span className="text-xs text-txt-muted">{debt.bank}</span>
      </div>
      {!isPaid && debt.balance > 0 && (
        <div className="mt-3">
          <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-accent rounded-full"
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-txt-muted">Paid: {formatCurrency(debt.amount - debt.balance)}</span>
            <span className="text-[10px] text-txt-muted">{progress.toFixed(0)}%</span>
          </div>
        </div>
      )}
      {isPaid && (
        <div className="mt-2 text-xs text-status-green font-semibold">Fully Paid ✓</div>
      )}
    </div>
  );
}

export default function FinancePage() {
  const totalPaid = DEBTS.filter((d) => d.status === "paid").reduce((sum, d) => sum + d.amount, 0);
  const totalRemaining = DEBTS.filter((d) => d.status !== "paid").reduce((sum, d) => sum + d.balance, 0);
  const totalDebt = DEBTS.reduce((sum, d) => sum + d.amount, 0);
  const sweepProgress = (totalPaid / totalDebt) * 100;

  const netWorth = BANK_ACCOUNTS.reduce((sum, b) => sum + b.balance, 0);
  const incomingTotal = INCOMING_FUNDS.reduce((sum, f) => sum + f.amount, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="text-xl font-bold uppercase tracking-widest text-txt-primary">Finance Tracker</h1>
        <p className="text-sm text-txt-muted mt-1">Debt elimination + bank balances — Mirror Protocol</p>
      </div>

      {/* Incoming Funds */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {INCOMING_FUNDS.map((fund) => (
          <div key={fund.id} className="card p-4 border-2 border-accent/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-txt-muted uppercase tracking-wider">Incoming</span>
              {fund.available ? (
                <span className="badge bg-status-green/20 text-status-green border border-status-green/30">Available</span>
              ) : (
                <span className="badge bg-status-yellow/20 text-status-yellow border border-status-yellow/30">Pending</span>
              )}
            </div>
            <span className="text-2xl font-bold font-mono text-accent">{formatCurrency(fund.amount)}</span>
            <p className="text-xs text-txt-secondary mt-1">{fund.name}</p>
          </div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <span className="text-xs text-txt-muted uppercase tracking-wider">Total Debt</span>
          <span className="text-xl font-bold font-mono text-txt-primary block mt-1">{formatCurrency(totalDebt)}</span>
        </div>
        <div className="card p-4">
          <span className="text-xs text-txt-muted uppercase tracking-wider">Cleared</span>
          <span className="text-xl font-bold font-mono text-status-green block mt-1">{formatCurrency(totalPaid)}</span>
        </div>
        <div className="card p-4">
          <span className="text-xs text-txt-muted uppercase tracking-wider">Remaining</span>
          <span className="text-xl font-bold font-mono text-status-yellow block mt-1">{formatCurrency(totalRemaining)}</span>
        </div>
        <div className="card p-4">
          <span className="text-xs text-txt-muted uppercase tracking-wider">Net Worth</span>
          <span className="text-xl font-bold font-mono text-accent block mt-1">{formatCurrency(netWorth)}</span>
        </div>
      </div>

      {/* Sweep Progress */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-txt-primary flex items-center gap-2">
            <TrendingDown size={16} className="text-accent" />
            Debt Sweep Progress
          </span>
          <span className="text-sm font-mono font-bold text-accent">{sweepProgress.toFixed(1)}%</span>
        </div>
        <div className="h-3 bg-bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${sweepProgress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-accent to-status-green rounded-full"
          />
        </div>
        <p className="text-xs text-txt-muted mt-2">Phase 1 complete — awaiting provident fund to clear remaining R119,014</p>
      </div>

      {/* Debt Sweep Order */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-txt-muted mb-3">Debt Sweep Order</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DEBTS.sort((a, b) => a.order - b.order).map((debt) => (
            <DebtCard key={debt.id} debt={debt} />
          ))}
        </div>
      </div>

      {/* Bank Accounts */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-txt-muted mb-3">Bank Accounts</h2>
        <div className="card overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Account</th>
                <th>Bank</th>
                <th>Type</th>
                <th className="text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {BANK_ACCOUNTS.map((acc) => (
                <tr key={acc.id}>
                  <td className="text-sm text-txt-primary font-medium">{acc.name}</td>
                  <td className="text-sm text-txt-secondary">{acc.bank}</td>
                  <td className="text-xs text-txt-muted uppercase">{acc.type}</td>
                  <td className={`text-right font-mono text-sm font-bold ${acc.balance < 0 ? "text-status-red" : "text-txt-primary"}`}>
                    {formatCurrency(Math.abs(acc.balance))}
                    {acc.balance < 0 && <span className="text-status-red text-[10px] ml-1">(owed)</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
