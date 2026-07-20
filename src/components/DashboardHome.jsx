import { Wallet, TrendingDown, ArrowRight, BarChart3, Plus } from 'lucide-react';
import StatCard from './StatCard';
import MoneyUsageChart from './MoneyUsageChart';
import CategoryBreakdown from './CategoryBreakdown';
import RecentActivity from './RecentActivity';
import { formatCurrency } from '../data/mockData';

/**
 * DashboardHome — the "Home" view: stat cards, quick actions, charts, activity.
 */
export default function DashboardHome({ account, onNavigate, onNewTransaction }) {
  const actions = [
    { label: 'Go to Payments', icon: ArrowRight, primary: true, onClick: () => onNavigate('payments') },
    { label: 'Quick Analytics', icon: BarChart3, primary: false, onClick: () => {
      document.getElementById('category-breakdown')?.scrollIntoView({ behavior: 'smooth' });
    }},
    { label: 'New Transaction', icon: Plus, primary: false, onClick: onNewTransaction },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-zinc-500">{account.name}</p>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-50">
          Welcome back, {account.owner.split(' ')[0]} 👋
        </h1>
      </div>

      {/* Stat cards — equal-height grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Balance"
          value={account.balance}
          trend={account.trend.balance}
          icon={Wallet}
          subtitle="Across selected account"
        />
        <StatCard
          title="Monthly Spending"
          value={account.monthlySpending}
          trend={account.trend.spending}
          icon={TrendingDown}
          subtitle="vs. previous month"
        />
        <StatCard
          title="Monthly Income"
          value={account.income}
          trend={((account.income - account.monthlySpending) / account.income) * 100}
          icon={BarChart3}
          subtitle={`Net ${formatCurrency(account.income - account.monthlySpending, { signed: true })} this month`}
        />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3">
        {actions.map((a) => (
          <button
            key={a.label}
            onClick={a.onClick}
            className={`group inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
              a.primary
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-600 hover:shadow-indigo-500/40'
                : 'border border-zinc-800 bg-zinc-900 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800'
            }`}
          >
            <a.icon size={16} />
            {a.label}
          </button>
        ))}
      </div>

      {/* Money usage chart */}
      <MoneyUsageChart data={account.series} />

      {/* Category breakdown */}
      <div id="category-breakdown">
        <CategoryBreakdown transactions={account.transactions} />
      </div>

      {/* Recent activity */}
      <RecentActivity transactions={account.transactions} />
    </div>
  );
}
