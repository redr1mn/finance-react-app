import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../data/mockData';
import StatusBadge from './StatusBadge';

const categoryDot = {
  Income: 'bg-emerald-500',
  Groceries: 'bg-sky-500',
  Transport: 'bg-amber-500',
  Housing: 'bg-violet-500',
  Entertainment: 'bg-pink-500',
  Utilities: 'bg-teal-500',
  Transfer: 'bg-zinc-400',
  Investment: 'bg-indigo-500',
  Travel: 'bg-cyan-500',
  Fees: 'bg-rose-500',
};

/**
 * RecentActivity — condensed dark table of the 5 most recent transactions.
 */
export default function RecentActivity({ transactions }) {
  const recent = transactions.slice(0, 5);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
        <h3 className="text-base font-bold text-zinc-50">Recent Activity</h3>
        <span className="text-xs font-medium text-zinc-500">Last 5 transactions</span>
      </div>

      <div className="divide-y divide-zinc-800/70">
        {recent.map((t, i) => {
          const positive = t.amount > 0;
          return (
            <div
              key={i}
              className="flex items-center gap-4 px-5 py-3.5 transition-colors duration-200 hover:bg-zinc-800/40"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                  positive
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-rose-500/10 text-rose-400'
                }`}
              >
                {positive ? <ArrowDownLeft size={15} /> : <ArrowUpRight size={15} />}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-100">
                  {t.description}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-xs font-medium text-zinc-500">
                  <span className={`h-1.5 w-1.5 rounded-full ${categoryDot[t.category] || 'bg-zinc-500'}`} />
                  {t.category}
                </div>
              </div>

              <StatusBadge status={t.status} />
              <p
                className={`w-24 shrink-0 text-right text-sm font-semibold tabular-nums ${
                  positive ? 'text-emerald-400' : 'text-zinc-200'
                }`}
              >
                {formatCurrency(t.amount, { signed: true })}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
