import { useMemo } from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../../data/accounts';
import StatusBadge from './StatusBadge';

const categoryDot = {
  Income: 'bg-emerald-500',
  Groceries: 'bg-sky-500',
  Transport: 'bg-amber-500',
  Housing: 'bg-violet-500',
  Entertainment: 'bg-pink-500',
  Utilities: 'bg-teal-500',
  Transfer: 'bg-void-400',
  Investment: 'bg-violet-500',
  Travel: 'bg-cyan-500',
  Fees: 'bg-rose-500',
};

/**
 * Generates a deterministic formatted timestamp string from a transaction description.
 *
 * @param {string} description - Transaction description string.
 * @returns {string} Formatted 12-hour timestamp (e.g. "09:45 AM").
 */
function fakeTime(description) {
  let h = 0;
  for (let i = 0; i < description.length; i++) {
    h = (h * 31 + description.charCodeAt(i)) & 0xffffffff;
  }
  const hour = ((h >>> 0) % 14) + 8;
  const min = ((h >>> 8) & 0xff) % 60;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${String(h12).padStart(2, '0')}:${String(min).padStart(2, '0')} ${ampm}`;
}

/**
 * Compact activity feed component displaying the 5 most recent transactions across all user accounts.
 * Supports active search filtering by description, category, or account name.
 *
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.accounts - List of all user accounts containing transaction records.
 * @param {string} props.searchQuery - Active global search query string.
 */
export default function RecentActivity({ accounts, searchQuery }) {
  const recent = useMemo(() => {
    // Flatten transactions across all user accounts with account metadata
    const all = accounts.flatMap((acc) =>
      acc.transactions.map((t) => ({
        ...t,
        accountName: acc.name,
        accountAccent: acc.accent,
      }))
    );

    // Sort transactions in descending chronological order
    all.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Filter results matching active search query
    if (!searchQuery) return all.slice(0, 5);
    
    const query = searchQuery.toLowerCase();
    return all
      .filter((t) =>
        t.description.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.accountName.toLowerCase().includes(query)
      )
      .slice(0, 5);
  }, [accounts, searchQuery]);

  return (
    <div className="rounded-2xl border border-void-800 bg-void-900/80 shadow-lg shadow-black/20">
      <div className="flex items-center justify-between border-b border-void-800 px-5 py-4">
        <div>
          <h3 className="text-base font-bold text-void-50">Recent Activity</h3>
          <p className="text-xs font-medium text-void-500">Across all accounts</p>
        </div>
        <span className="text-xs font-semibold rounded-full border border-void-800 bg-void-800/50 px-2 py-0.5 text-void-400">
          Last 5 entries
        </span>
      </div>

      <div className="divide-y divide-void-800/70">
        {recent.map((t, i) => {
          const positive = t.amount > 0;
          return (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-3.5 transition-colors duration-200 hover:bg-void-800/40"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
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
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <p className="truncate text-sm font-semibold text-void-50">
                      {t.description}
                    </p>
                    <span className="inline-flex items-center rounded-md bg-void-800/60 px-1.5 py-0.5 text-[10px] font-medium text-void-400 ring-1 ring-inset ring-void-700/50">
                      {t.accountName}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs font-medium text-void-500">
                    <span className={`h-1.5 w-1.5 rounded-full ${categoryDot[t.category] || 'bg-void-500'}`} />
                    <span>{t.category}</span>
                    <span className="text-void-700">·</span>
                    <span>
                      {new Date(t.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                      <span className="text-void-600 ml-1.5 font-medium">
                        {fakeTime(t.description)}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pl-12 sm:pl-0 shrink-0 border-t sm:border-t-0 border-void-800/40 pt-2 sm:pt-0">
                <StatusBadge status={t.status} />
                <p
                  className={`sm:w-24 text-right text-sm font-semibold tabular-nums ${
                    positive ? 'text-emerald-400' : 'text-void-200'
                  }`}
                >
                  {formatCurrency(t.amount, { signed: true })}
                </p>
              </div>
            </div>
          );
        })}
        {recent.length === 0 && (
          <div className="px-5 py-8 text-center text-sm font-medium text-void-500">
            No recent activity found.
          </div>
        )}
      </div>
    </div>
  );
}
