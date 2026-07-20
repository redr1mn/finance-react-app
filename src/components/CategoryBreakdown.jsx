import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency } from '../data/mockData';

// Solid color per category — kept in sync with RecentActivity dots.
const CATEGORY_COLORS = {
  Income: '#10b981',
  Groceries: '#0ea5e9',
  Transport: '#f59e0b',
  Housing: '#8b5cf6',
  Entertainment: '#ec4899',
  Utilities: '#14b8a6',
  Transfer: '#a1a1aa',
  Investment: '#6366f1',
  Travel: '#06b6d4',
  Fees: '#f43f5e',
};

/**
 * CategoryBreakdown — total amount spent per category (expenses only) for the
 * active account, rendered as a solid-color bar chart.
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
        color: CATEGORY_COLORS[category] || '#71717a',
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const totalSpent = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg shadow-black/20">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-zinc-50">Spending by Category</h3>
          <p className="text-xs font-medium text-zinc-500">
            Total spent · {formatCurrency(totalSpent)}
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              dy={8}
              interval={0}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={56}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip
              cursor={{ fill: 'rgba(63, 63, 70, 0.25)' }}
              contentStyle={{
                backgroundColor: '#18181b',
                border: '1px solid #27272a',
                borderRadius: 12,
              }}
              labelStyle={{ color: '#fafafa', fontWeight: 600 }}
              formatter={(value) => [formatCurrency(value), 'Spent']}
            />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((entry) => (
                <Cell key={entry.category} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
