import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../data/accounts';

/**
 * Metric summary card displaying key financial indicators, trend percentages, and contextual subtitles.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.title - Card title label.
 * @param {number} props.value - Primary numerical value formatted as currency.
 * @param {number} props.trend - Percentage change trend value.
 * @param {React.ComponentType} [props.icon] - Lucide icon component reference.
 * @param {string} [props.subtitle] - Contextual subtitle text.
 */
export default function StatCard({ title, value, trend, icon: Icon, subtitle }) {
  const positive = trend >= 0;
  const glowColor = positive ? 'bg-emerald-500/15' : 'bg-rose-500/15';

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-void-800 bg-void-900/80 p-4 sm:p-5 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:border-void-700 hover:shadow-xl hover:shadow-black/40 flex justify-between items-center gap-3">
      {/* soft bottom-right glow matches status colors */}
      <div className={`pointer-events-none absolute -right-12 -bottom-12 h-36 w-36 rounded-full blur-3xl opacity-55 group-hover:opacity-90 transition-opacity duration-500 ${glowColor}`} />

      {/* Left side info */}
      <div className="flex flex-col gap-2 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-void-800 bg-void-950/60 text-void-400">
            {Icon && <Icon size={18} strokeWidth={2} />}
          </span>
          <p className="text-xs sm:text-sm font-medium text-void-400 truncate">{title}</p>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-void-50 font-sans truncate">
            {formatCurrency(value)}
          </p>
          {subtitle && <p className="mt-0.5 text-[11px] sm:text-xs font-medium text-void-500 truncate">{subtitle}</p>}
        </div>
      </div>

      {/* Right side trend (large, centered vertically, no pill wrapper) */}
      <div className={`relative z-10 flex items-center gap-1 font-extrabold shrink-0 ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
        {positive ? (
          <TrendingUp size={20} strokeWidth={2.5} className="sm:w-6 sm:h-6" />
        ) : (
          <TrendingDown size={20} strokeWidth={2.5} className="sm:w-6 sm:h-6" />
        )}
        <span className="text-base sm:text-xl tracking-tight font-sans">
          {positive ? '+' : '-'}{Math.abs(trend).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}
