import { useMemo } from 'react';
import { Wallet, TrendingDown, ArrowRight, BarChart3, Plus, Settings } from 'lucide-react';
import StatCard from './ui/StatCard';
import SpendingChart from './charts/SpendingChart';
import CategoryBreakdown from './charts/CategoryBreakdown';
import RecentActivity from './ui/RecentActivity';
import { formatCurrency } from '../data/accounts';

/** Returns spending-utilisation status object for colour theming */
function budgetStatus(spent, limit) {
  const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const over = spent > limit && limit > 0;
  return {
    pct,
    over,
    barColor:   over || pct >= 90 ? 'bg-rose-500'    : pct >= 70 ? 'bg-amber-400'   : 'bg-emerald-500',
    textColor:  over || pct >= 90 ? 'text-rose-400'  : pct >= 70 ? 'text-amber-400' : 'text-emerald-400',
    label:      over ? 'Over Budget' : pct >= 90 ? 'Near Limit' : pct >= 70 ? 'Heads Up' : 'On Track',
  };
}

/**
 * DashboardHome — stat cards, budget health, quick actions, charts, activity.
 */
export default function DashboardHome({
  account,
  accounts,
  onNavigate,
  onNewTransaction,
  onEditBudget,
  searchQuery,
}) {
  const actions = [
    { label: 'Go to Payments', icon: ArrowRight, primary: true,  onClick: () => onNavigate('payments') },
    {
      label: 'Analytics', icon: BarChart3, primary: false, onClick: () =>
        document.getElementById('category-breakdown')?.scrollIntoView({ behavior: 'smooth' }),
    },
    { label: 'New Transaction', icon: Plus, primary: false, onClick: onNewTransaction },
  ];

  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return account.transactions;
    return account.transactions.filter((tx) =>
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [account.transactions, searchQuery]);

  // Budget calculations
  const budget = account.budget;
  const spending  = budgetStatus(account.monthlySpending, budget?.monthlyLimit ?? 0);
  const projectedSavings = Math.max(0, (budget?.initialIncome ?? 0) - account.monthlySpending);
  const savingsPct = budget?.savingsTarget > 0
    ? Math.min((projectedSavings / budget.savingsTarget) * 100, 100)
    : 0;
  const incomeGap = (budget?.initialIncome ?? account.income) - account.income;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium text-void-500">{account.name}</p>
        <h1 className="text-2xl font-bold tracking-tight text-void-50 font-sans">
          Welcome back, {account.owner.split(' ')[0]} 👋
        </h1>
      </div>

      {/* ── Stat cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total Balance"    value={account.balance}        trend={account.trend.balance}  icon={Wallet}      subtitle="Across selected account" />
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
          <div className="flex items-center justify-between border-b border-void-800 px-5 py-3.5">
            <div>
              <h2 className="text-sm font-bold text-void-50">Budget Health</h2>
              <p className="text-xs text-void-500">
                {account.name} ·{' '}
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <button
              onClick={() => onEditBudget(account)}
              className="flex items-center gap-1.5 rounded-lg border border-void-800 bg-void-950/60 px-3 py-1.5 text-xs font-semibold text-void-400 transition hover:border-violet-500/50 hover:text-violet-400 active:scale-95"
            >
              <Settings size={12} />
              Edit Budget
            </button>
          </div>

          {/* Three metric columns */}
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-void-800">

            {/* Spending vs Limit */}
            <div className="px-5 py-4">
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

      {/* ── Quick actions ───────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={a.onClick}
            className={`group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer ${
              a.primary
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25 hover:bg-violet-700 hover:shadow-violet-500/40'
                : 'border border-void-800 bg-void-900 text-void-200 hover:border-void-700 hover:bg-void-800'
            }`}
          >
            <a.icon size={16} />
            {a.label}
          </button>
        ))}
      </div>

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
