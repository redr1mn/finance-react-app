import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatCurrency } from '../data/mockData';

const CATEGORIES = ['All', 'Income', 'Groceries', 'Transport', 'Housing', 'Entertainment', 'Utilities', 'Transfer', 'Investment', 'Travel', 'Fees'];

/**
 * PaymentsList — filterable transaction history for the active account.
 */
export default function PaymentsList({ account, onNewTransaction }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');

  const filtered = useMemo(() => {
    return account.transactions.filter((t) => {
      const matchesQuery = t.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === 'All' || t.category === category;
      const matchesStatus = status === 'All' || t.status === status;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [account, query, category, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-50">Payments</h1>
          <p className="text-sm font-medium text-zinc-500">
            Transaction history for <span className="text-zinc-300">{account.name}</span>
            <span className="mx-2 text-zinc-700">·</span>
            <span className="rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-0.5 text-xs font-semibold text-zinc-400">
              {filtered.length} records
            </span>
          </p>
        </div>
        <button
          onClick={onNewTransaction}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-600 hover:shadow-indigo-500/40 active:scale-95"
        >
          <Plus size={16} />
          New Transaction
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-3">
        <div className="relative min-w-[200px] flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search description..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950/60 py-2 pl-9 pr-3 text-sm font-medium text-zinc-100 placeholder:text-zinc-600 outline-none transition focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-zinc-500" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm font-medium text-zinc-200 outline-none transition focus:border-brand-500/60"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-zinc-900">
                {c}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2 text-sm font-medium text-zinc-200 outline-none transition focus:border-brand-500/60"
          >
            <option value="All" className="bg-zinc-900">All Status</option>
            <option value="Completed" className="bg-zinc-900">Completed</option>
            <option value="Pending" className="bg-zinc-900">Pending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
            <thead>
              <tr className="border-b border-zinc-800 text-xs font-semibold uppercase tracking-wider text-zinc-500">
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Description</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5 text-right">Amount</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/70">
              {filtered.map((t, i) => {
                const positive = t.amount > 0;
                return (
                  <tr
                    key={i}
                    className="text-sm transition-colors duration-200 hover:bg-zinc-800/40"
                  >
                    <td className="whitespace-nowrap px-5 py-3.5 font-medium text-zinc-400">
                      {new Date(t.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-zinc-100">{t.description}</td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-md border border-zinc-800 bg-zinc-950/50 px-2 py-0.5 text-xs font-medium text-zinc-400">
                        {t.category}
                      </span>
                    </td>
                    <td
                      className={`whitespace-nowrap px-5 py-3.5 text-right font-semibold tabular-nums ${
                        positive ? 'text-emerald-400' : 'text-zinc-200'
                      }`}
                    >
                      {formatCurrency(t.amount, { signed: true })}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm font-medium text-zinc-500">
                    No transactions match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
