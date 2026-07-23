import { useMemo } from 'react';
import { Wallet, TrendingDown, BarChart3, Plus, Settings } from 'lucide-react';
import StatCard from './ui/StatCard';
import SpendingChart from './charts/SpendingChart';
import CategoryBreakdown from './charts/CategoryBreakdown';
import RecentActivity from './ui/RecentActivity';
import { formatCurrency } from '../data/accounts';

/**
 * Calculates spending utilization metrics and corresponding color classes for budget indicators.
 *
 * @param {number} spent - Total amount spent in the current billing cycle.
 * @param {number} limit - Configured monthly spending limit.
 * @returns {{ pct: number, over: boolean, barColor: string, textColor: string, label: string }}
 * Status metrics object containing computed percentage, overload flag, styling classes, and human-readable label.
 */
function budgetStatus(spent, limit) {
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const over = spent > limit && limit > 0;
  return {
    pct,
    over,
    barColor: over || pct >= 90 ? 'bg-rose-500' : pct >= 70 ? 'bg-amber-400' : 'bg-emerald-500',
    textColor: over || pct >= 90 ? 'text-rose-400' : pct >= 70 ? 'text-amber-400' : 'text-emerald-400',
    label: over ? 'Over Budget' : pct >= 90 ? 'Near Limit' : pct >= 70 ? 'Heads Up' : 'On Track',
  };
}

/**
 * Main dashboard view displaying financial metric stat cards, budget health indicators,
 * quick navigation actions, spending charts, and recent activity log.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.account - Active account object.
 * @param {Array<Object>} props.accounts - List of all user accounts.
 * @param {Function} props.onNavigate - Page navigation callback handler.
 * @param {Function} props.onNewTransaction - Modal trigger callback for creating transactions.
 * @param {Function} props.onEditBudget - Modal trigger callback for updating budget parameters.
 * @param {string} props.searchQuery - Active global search query string.
 */
export default function DashboardHome({
  account,
  accounts,
  onNewTransaction,
  onEditBudget,
  searchQuery,
}) {
  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return account.transactions;
    return account.transactions.filter((tx) =>
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [account.transactions, searchQuery]);

  const budget = account.budget;
  const spending = budgetStatus(account.monthlySpending, budget?.monthlyLimit ?? 0);
  const projectedSavings = Math.max(0, (budget?.initialIncome ?? 0) - account.monthlySpending);
  const savingsPct = budget?.savingsTarget > 0
    ? Math.min((projectedSavings / budget.savingsTarget) * 100, 100)
    : 0;
  const incomeGap = (budget?.initialIncome ?? account.income) - account.income;

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in">

      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-col gap-0.5">
          <p className="text-xs sm:text-sm font-medium text-void-500">{account.name}</p>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-void-50 font-sans">
            Welcome back, {account.owner.split(' ')[0]} 👋
          </h1>
        </div>
        <button
          onClick={onNewTransaction}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:bg-violet-700 active:scale-95 cursor-pointer shrink-0 w-full sm:w-auto"
        >
          <Plus size={16} />
          <span>New Transaction</span>
        </button>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total Balance" value={account.balance} trend={account.trend.balance} icon={Wallet} subtitle="Across selected account" />
        <StatCard title="Monthly Spending" value={account.monthlySpending} trend={account.trend.spending} icon={TrendingDown} subtitle="vs. previous month" />
        <StatCard
          title="Monthly Income"
          value={account.income}
          trend={((account.income - account.monthlySpending) / account.income) * 100}
          icon={BarChart3}
          subtitle={`Net ${formatCurrency(account.income - account.monthlySpending, { signed: true })} this month`}
        />
      </div>

      {/* ── Budget Health ───────────────────────────────────────── */}
      {budget && (
        <div className="rounded-2xl border border-void-800 bg-void-900/80 overflow-hidden shadow-lg shadow-black/20">
          {/* Card header */}
          <div className="flex items-center justify-between border-b border-void-800 px-4 sm:px-5 py-3 sm:py-3.5">
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-void-50">Budget Health</h2>
              <p className="text-[11px] sm:text-xs text-void-500">
                {account.name} ·{' '}
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <button
              onClick={() => onEditBudget(account)}
              className="flex items-center gap-1.5 rounded-lg border border-void-800 bg-void-950/60 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-void-400 transition hover:border-violet-500/50 hover:text-violet-400 active:scale-95 cursor-pointer"
            >
              <Settings size={12} />
              Edit
            </button>
          </div>

          {/* Three metric columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-void-800">

            {/* Spending vs Limit */}
            <div className="px-4 sm:px-5 py-3.5 sm:py-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-void-500 mb-3">
                Spending vs Limit
              </p>
              <div className="flex items-end justify-between mb-2">
                <span className="text-xl font-extrabold text-void-50 tracking-tight">
                  {formatCurrency(account.monthlySpending)}
                </span>
                <span className={`text-xs font-bold ${spending.textColor}`}>{spending.label}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-void-800 mb-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${spending.barColor}`}
                  style={{ width: `${spending.pct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-void-500">{spending.pct.toFixed(1)}% used</span>
                <span className="text-void-500">of {formatCurrency(budget.monthlyLimit)}</span>
              </div>
            </div>

            {/* Income vs Declared */}
            <div className="px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-void-500 mb-3">
                Income vs Declared
              </p>
              <div className="flex items-end justify-between mb-2">
                <span className="text-xl font-extrabold text-void-50 tracking-tight">
                  {formatCurrency(account.income)}
                </span>
                <span className={`text-xs font-bold ${incomeGap >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {incomeGap >= 0 ? '+' : '−'}{formatCurrency(Math.abs(incomeGap))}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-void-800 mb-1.5">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{
                    width: budget.initialIncome > 0
                      ? `${Math.min((account.income / budget.initialIncome) * 100, 100)}%`
                      : '0%',
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-void-500">Actual recorded</span>
                <span className="text-void-500">Declared {formatCurrency(budget.initialIncome)}</span>
              </div>
            </div>

            {/* Savings Target */}
            <div className="px-5 py-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-void-500 mb-3">
                Savings Progress
              </p>
              <div className="flex items-end justify-between mb-2">
                <span className="text-xl font-extrabold text-void-50 tracking-tight">
                  {formatCurrency(projectedSavings)}
                </span>
                <span className={`text-xs font-bold ${savingsPct >= 100 ? 'text-emerald-400' : savingsPct >= 60 ? 'text-amber-400' : 'text-void-500'}`}>
                  {savingsPct >= 100 ? 'Target Met ✓' : `${savingsPct.toFixed(0)}% of goal`}
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-void-800 mb-1.5">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${savingsPct >= 100 ? 'bg-emerald-500' : savingsPct >= 60 ? 'bg-amber-400' : 'bg-violet-500'}`}
                  style={{ width: `${savingsPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-void-500">Projected this month</span>
                <span className="text-void-500">Target {formatCurrency(budget.savingsTarget)}</span>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* ── Charts ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="category-breakdown">
        <SpendingChart data={account.series} />
        <CategoryBreakdown transactions={filteredTransactions} />
      </div>

      {/* ── Recent activity ─────────────────────────────────────── */}
      <RecentActivity accounts={accounts} searchQuery={searchQuery} />
    </div>
  );
}
