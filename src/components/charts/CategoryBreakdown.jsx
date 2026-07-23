import { useMemo } from 'react';
import {
  Cell,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
} from 'recharts';
import { formatCurrency } from '../../data/accounts';

/** Color mapping per transaction category, synchronized across charts and badge indicators. */
const CATEGORY_COLORS = {
  Income: '#10b981', // emerald-500
  Groceries: '#0ea5e9', // sky-500
  Transport: '#f59e0b', // amber-500
  Housing: '#8b5cf6', // violet-500
  Entertainment: '#ec4899', // pink-500
  Utilities: '#14b8a6', // teal-500
  Transfer: '#b3a8cc', // void-400
  Investment: '#8b5cf6', // violet-500
  Travel: '#06b6d4', // cyan-500
  Fees: '#f43f5e', // rose-500
};

/**
 * Displays monthly expense distribution per category as an interactive donut chart
 * accompanied by side annotation legends.
 *
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.transactions - List of transaction objects for the selected account.
 */
export default function CategoryBreakdown({ transactions }) {
  const data = useMemo(() => {
    const totals = {};
    transactions.forEach((t) => {
      if (t.amount >= 0) return; // expenses only
      const key = t.category;
      totals[key] = (totals[key] || 0) + Math.abs(t.amount);
    });
    return Object.entries(totals)
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount * 100) / 100,
        color: CATEGORY_COLORS[category] || '#7b6fa0',
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const totalSpent = data.reduce((sum, d) => sum + d.amount, 0);
  const midIndex = Math.ceil(data.length / 2);
  const leftData = data.slice(0, midIndex);
  const rightData = data.slice(midIndex);

  return (
    <div className="rounded-2xl border border-void-800 bg-void-900/80 p-4 sm:p-5 shadow-lg shadow-black/20">
      <div className="mb-4">
        <h3 className="text-base font-bold text-void-50 font-sans">Spending by Category</h3>
        <p className="text-xs font-medium text-void-500">
          Monthly distribution
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {/* Row for Pie + Left/Right Annotations */}
        <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row gap-4 items-center justify-center">
          {/* Left Side Annotations */}
          <div className="hidden md:flex lg:hidden xl:flex flex-col gap-2 flex-1 w-full max-w-[200px]">
            {leftData.map((item) => (
              <div key={item.category} className="flex items-center gap-2 rounded-lg border border-void-800 bg-void-950/30 p-2 transition hover:bg-void-950/70">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate text-[11px] font-semibold text-void-400">{item.category}</span>
                <span className="ml-auto text-[10px] font-bold text-void-200 tabular-nums">
                  {totalSpent > 0 ? `${((item.amount / totalSpent) * 100).toFixed(1)}%` : '0%'}
                </span>
              </div>
            ))}
            {leftData.length === 0 && <div className="text-[11px] text-void-600">No data</div>}
          </div>

          {/* Center Pie Chart */}
          <div className="relative h-56 sm:h-64 w-[210px] sm:w-[240px] shrink-0 flex items-center justify-center">
            {/* Center Total Overlay inside the donut hole */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-void-500">
                Total Spent
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-void-50 font-sans tracking-tight">
                {formatCurrency(totalSpent)}
              </span>
            </div>

            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={84}
                  paddingAngle={0}
                  dataKey="amount"
                  nameKey="category"
                >
                  {data.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} stroke="none" strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0d0b14',
                    border: '1px solid #1e1a2e',
                    borderRadius: 12,
                  }}
                  itemStyle={{ color: '#f0eeff' }}
                  formatter={(value, name) => {
                    const pct = totalSpent > 0 ? ((value / totalSpent) * 100).toFixed(1) + '%' : '0%';
                    return [`${formatCurrency(value)} (${pct})`, `${name} · Spent`];
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Right Side Annotations */}
          <div className="hidden md:flex lg:hidden xl:flex flex-col gap-2 flex-1 w-full max-w-[200px]">
            {rightData.map((item) => (
              <div key={item.category} className="flex items-center gap-2 rounded-lg border border-void-800 bg-void-950/30 p-2 transition hover:bg-void-950/70">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate text-[11px] font-semibold text-void-400">{item.category}</span>
                <span className="ml-auto text-[10px] font-bold text-void-200 tabular-nums">
                  {totalSpent > 0 ? `${((item.amount / totalSpent) * 100).toFixed(1)}%` : '0%'}
                </span>
              </div>
            ))}
            {rightData.length === 0 && <div className="text-[11px] text-void-600">No data</div>}
          </div>
        </div>

        {/* Fallback Mobile / Cramped Desktop Legend */}
        <div className="flex flex-wrap gap-2 md:hidden lg:flex xl:hidden justify-center px-1">
          {data.map((item) => (
            <div key={item.category} className="flex items-center gap-1.5 rounded-lg border border-void-800 bg-void-950/30 px-2 py-1">
              <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] font-semibold text-void-400">{item.category}</span>
              <span className="text-[10px] font-bold text-void-200">
                {totalSpent > 0 ? `${((item.amount / totalSpent) * 100).toFixed(1)}%` : '0%'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
