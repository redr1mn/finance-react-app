import { useState } from 'react';
import { X, Target, Wallet, TrendingUp, Loader2 } from 'lucide-react';
import { formatCurrency } from '../../data/accounts';

/**
 * Centered modal dialog for adjusting monthly budget limits, declared income,
 * and monthly savings targets for a selected account.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.account - Target account object being edited.
 * @param {Function} props.onSave - Callback handler invoked with (accountId, newBudget).
 * @param {Function} props.onClose - Modal close handler.
 */
export default function BudgetPanel({ account, onSave, onClose }) {
  const [limit, setLimit]   = useState(String(account.budget.monthlyLimit));
  const [income, setIncome] = useState(String(account.budget.initialIncome));
  const [savings, setSavings] = useState(String(account.budget.savingsTarget));
  const [isSaving, setIsSaving] = useState(false);

  const parsedLimit   = parseFloat(limit)   || 0;
  const parsedIncome  = parseFloat(income)  || 0;
  const parsedSavings = parseFloat(savings) || 0;

  const spentPct  = parsedLimit > 0 ? Math.min((account.monthlySpending / parsedLimit) * 100, 100) : 0;
  const isOver    = account.monthlySpending > parsedLimit;
  const statusKey = isOver ? 'rose' : spentPct >= 80 ? 'amber' : 'emerald';

  const barColor  = statusKey === 'rose' ? 'bg-rose-500'  : statusKey === 'amber' ? 'bg-amber-400'   : 'bg-emerald-500';
  const textColor = statusKey === 'rose' ? 'text-rose-400': statusKey === 'amber' ? 'text-amber-400' : 'text-emerald-400';
  const statusLabel = isOver ? 'Over Budget' : spentPct >= 80 ? 'Near Limit' : 'On Track';

  const projectedSavings = Math.max(0, parsedIncome - account.monthlySpending);

  const handleSave = () => {
    if (isSaving) return;
    setIsSaving(true);
    setTimeout(() => {
      onSave(account.id, {
        monthlyLimit:   parsedLimit,
        initialIncome:  parsedIncome,
        savingsTarget:  parsedSavings,
      });
      setIsSaving(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl border border-void-700 bg-void-900 shadow-2xl shadow-black/70">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-void-800 px-4 sm:px-5 py-3.5 sm:py-4">
          <div className="flex items-center gap-3">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${account.accent} text-sm font-bold text-white shadow-md`}>
              {account.initials}
            </span>
            <div>
              <h2 className="text-sm font-bold text-void-50">Budget Settings</h2>
              <p className="text-xs font-medium text-void-500">{account.name} · {account.owner}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-void-400 transition hover:bg-void-800 hover:text-void-200 active:scale-95 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current month status */}
        <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-void-800 bg-void-950/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-void-400">This Month's Spending</p>
            <span className={`text-xs font-bold ${textColor}`}>{statusLabel}</span>
          </div>
          <div className="flex items-center justify-between text-xs font-medium mb-2">
            <span className="text-void-500">
              Spent: <span className="text-void-200 font-semibold">{formatCurrency(account.monthlySpending)}</span>
            </span>
            <span className="text-void-500">
              Limit: <span className="text-void-200 font-semibold">{formatCurrency(parsedLimit)}</span>
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-void-800">
            <div
              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
              style={{ width: `${spentPct}%` }}
            />
          </div>
          <p className={`mt-1.5 text-right text-[11px] font-bold ${textColor}`}>
            {spentPct.toFixed(1)}% of limit used
          </p>
        </div>

        {/* Editable fields */}
        <div className="space-y-4 sm:space-y-5 px-4 sm:px-5 py-4 sm:py-5">

          {/* Monthly Spending Limit */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-void-500">
              <Target size={11} className="text-violet-400" />
              Monthly Spending Limit
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-void-500">$</span>
              <input
                type="number"
                step="50"
                min="0"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className="w-full rounded-xl border border-void-800 bg-void-950/60 py-2.5 pl-7 pr-3 text-sm font-semibold text-void-200 placeholder:text-void-500 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
            <p className="mt-1 text-[11px] text-void-500">
              Current month spending: {formatCurrency(account.monthlySpending)}
            </p>
          </div>

          {/* Initial Monthly Income */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-void-500">
              <TrendingUp size={11} className="text-emerald-400" />
              Declared Monthly Income
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-void-500">$</span>
              <input
                type="number"
                step="100"
                min="0"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full rounded-xl border border-void-800 bg-void-950/60 py-2.5 pl-7 pr-3 text-sm font-semibold text-void-200 placeholder:text-void-500 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
            <p className="mt-1 text-[11px] text-void-500">
              Recorded income this month: {formatCurrency(account.income)}
            </p>
          </div>

          {/* Savings Target */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-void-500">
              <Wallet size={11} className="text-sky-400" />
              Monthly Savings Target
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-void-500">$</span>
              <input
                type="number"
                step="50"
                min="0"
                value={savings}
                onChange={(e) => setSavings(e.target.value)}
                className="w-full rounded-xl border border-void-800 bg-void-950/60 py-2.5 pl-7 pr-3 text-sm font-semibold text-void-200 placeholder:text-void-500 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
            <p className="mt-1 text-[11px] text-void-500">
              Projected savings: {formatCurrency(projectedSavings)}
              {projectedSavings >= parsedSavings && parsedSavings > 0 && (
                <span className="ml-1.5 text-emerald-400 font-semibold">· Target met ✓</span>
              )}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-void-800 px-4 sm:px-5 py-3.5 sm:py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-void-800 bg-void-950/60 px-4 py-2 text-sm font-semibold text-void-300 transition hover:bg-void-800 active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-700 active:scale-95 disabled:opacity-50 cursor-pointer min-w-[120px]"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Budget</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
