import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../data/mockData';

/**
 * StatCard — a premium dark metric card with a positive/negative trend chip.
 *
 * Props:
 *   title, value, trend (number, signed), icon, subtitle
 */
export default function StatCard({ title, value, trend, icon: Icon, subtitle }) {
  const positive = trend >= 0;
  const tone = positive
    ? 'text-emerald-400 bg-emerald-500/10 ring-emerald-500/20'
    : 'text-rose-400 bg-rose-500/10 ring-rose-500/20';

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/40">
      {/* soft glow on hover */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-500/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/60 text-zinc-300">
            {Icon && <Icon size={18} strokeWidth={2} />}
          </span>
          <p className="text-sm font-medium text-zinc-400">{title}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ring-1 ring-inset ${tone}`}
        >
          {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {Math.abs(trend).toFixed(1)}%
        </span>
      </div>

      <p className="mt-4 text-3xl font-bold tracking-tight text-zinc-50">
        {formatCurrency(value)}
      </p>
      {subtitle && <p className="mt-1 text-xs font-medium text-zinc-500">{subtitle}</p>}
    </div>
  );
}
