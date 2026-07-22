import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { formatCurrency } from '../../data/accounts';

/**
 * Interactive area chart illustrating monthly spending trends vs. income history.
 *
 * @param {Object} props - Component properties.
 * @param {Array<{month: string, spending: number, income: number}>} props.data - Time series data array.
 */
export default function SpendingChart({ data }) {
  return (
    <div className="rounded-2xl border border-void-800 bg-void-900/80 p-4 sm:p-5 shadow-lg shadow-black/20">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-void-50">Money Usage</h3>
          <p className="text-xs font-medium text-void-500">Monthly spending vs. income</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-void-400">
            <span className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px] shadow-rose-500" />
            Spending
          </span>
          <span className="flex items-center gap-1.5 text-void-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px] shadow-emerald-500" />
            Income
          </span>
        </div>
      </div>

      <div className="h-52 sm:h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 4, left: -22, bottom: 0 }}>
            <defs>
              {/* Violet glow filter for the income area */}
              <filter id="glow-emerald" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Rose glow filter for the spending line */}
              <filter id="glow-rose" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Subtle violet fill gradient under income line */}
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              {/* Subtle rose fill gradient under spending line */}
              <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Grid uses void-800 to match the new border palette */}
            <CartesianGrid strokeDasharray="3 3" stroke="#1e1a2e" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} dy={8} />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={56}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip
              cursor={{ stroke: '#2d2845', strokeWidth: 1, strokeDasharray: '4 4' }}
              contentStyle={{
                backgroundColor: '#0d0b14',
                border: '1px solid #1e1a2e',
                borderRadius: 12,
              }}
              labelStyle={{ color: '#f0eeff', fontWeight: 600 }}
              formatter={(value, name) => [
                formatCurrency(value),
                name === 'spending' ? 'Spending' : 'Income',
              ]}
            />

            {/* Income area — emerald line with soft fill */}
            <Area
              type="monotone"
              dataKey="income"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#incomeGradient)"
              filter="url(#glow-emerald)"
            />
            {/* Spending area — rose line with soft fill */}
            <Area
              type="monotone"
              dataKey="spending"
              stroke="#f43f5e"
              strokeWidth={2.5}
              fill="url(#spendingGradient)"
              filter="url(#glow-rose)"
              activeDot={{ r: 5, fill: '#f43f5e', stroke: '#06040a', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
