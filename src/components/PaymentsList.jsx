import { useMemo, useState } from 'react';
import { Search, Plus, ChevronDown, Check, Settings } from 'lucide-react';
import StatusBadge from './ui/StatusBadge';
import { formatCurrency } from '../data/accounts';
import { formatTransactionDate, formatTransactionTime } from '../utils/formatters';

const CATEGORIES = [
  'All', 'Income', 'Groceries', 'Transport', 'Housing',
  'Entertainment', 'Utilities', 'Transfer', 'Investment', 'Travel', 'Fees',
];

/**
 * Custom dropdown select component for filtering transaction lists.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.label - Field label displayed above the select trigger.
 * @param {string} props.value - Currently selected option value.
 * @param {Array<{value: string, label: string}>} props.options - Array of available dropdown options.
 * @param {Function} props.onChange - Selection change callback handler.
 */
function FilterSelect({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const activeLabel = useMemo(
    () => options.find((o) => o.value === value)?.label || value,
    [value, options],
  );

  return (
    <div className="relative w-full">
      <span className="text-[10px] font-bold uppercase tracking-wider text-void-500 mb-1.5 block">
        {label}
      </span>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-void-800 bg-void-950/60 px-3.5 py-2.5 text-xs font-semibold text-void-200 hover:bg-void-900 transition active:scale-[0.98] cursor-pointer"
      >
        <span className="truncate">{activeLabel}</span>
        <ChevronDown
          size={13}
          className={`text-void-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 mt-1.5 z-50 max-h-60 overflow-y-auto rounded-xl border border-void-800 bg-void-900 p-1 shadow-2xl animate-fade-in">
            {options.map((opt) => {
              const selected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { onChange(opt.value); setOpen(false); }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition cursor-pointer ${selected ? 'text-violet-400 bg-void-800/40' : 'text-void-300 hover:bg-void-800/70'
                    }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {selected && <Check size={13} className="text-violet-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/**
 * Filterable transaction history view featuring search indexing, category/type/status filtering,
 * budget health summary banner, and paginated/scrolled transaction records.
 *
 * @param {Object} props - Component properties.
 * @param {Object} props.account - Active account object.
 * @param {Function} props.onNewTransaction - Modal trigger callback for adding transactions.
 * @param {Function} props.onEditBudget - Modal trigger callback for updating budget parameters.
 * @param {string} props.searchQuery - Active search query text.
 * @param {Function} props.onSearchChange - Callback handler for updating search query text.
 */
export default function PaymentsList({
  account,
  onNewTransaction,
  onEditBudget,
  searchQuery,
  onSearchChange,
}) {
  const [typeFilter, setTypeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [status, setStatus] = useState('All');

  const filtered = useMemo(() => {
    return account.transactions.filter((t) => {
      const matchesQuery = t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'All' ||
        (typeFilter === 'Income' && t.amount > 0) ||
        (typeFilter === 'Expense' && t.amount < 0);
      const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
      const matchesStatus = status === 'All' || t.status === status;
      return matchesQuery && matchesType && matchesCategory && matchesStatus;
    });
  }, [account, searchQuery, typeFilter, categoryFilter, status]);

  const typeOptions = [
    { value: 'All', label: 'All Types' },
    { value: 'Income', label: 'Income' },
    { value: 'Expense', label: 'Expense' },
  ];
  const categoryOptions = [
    { value: 'All', label: 'All Categories' },
    ...CATEGORIES.filter((c) => c !== 'All').map((c) => ({ value: c, label: c })),
  ];
  const statusOptions = [
    { value: 'All', label: 'All Status' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Pending', label: 'Pending' },
  ];

  const budget = account.budget;
  const spentPct = budget?.monthlyLimit > 0
    ? Math.min((account.monthlySpending / budget.monthlyLimit) * 100, 100)
    : 0;
  const isOver = budget && account.monthlySpending > budget.monthlyLimit;
  const barColor = isOver || spentPct >= 90 ? 'bg-rose-500' : spentPct >= 70 ? 'bg-amber-400' : 'bg-emerald-500';
  const textColor = isOver || spentPct >= 90 ? 'text-rose-400' : spentPct >= 70 ? 'text-amber-400' : 'text-emerald-400';
  const budgetLabel = isOver ? 'Budget exceeded' : spentPct >= 90 ? 'Near Limit' : spentPct >= 70 ? 'Heads Up' : 'On Track';
  const remaining = budget ? budget.monthlyLimit - account.monthlySpending : 0;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-void-50 font-sans">Payments</h1>
          <p className="text-sm font-medium text-void-500">
            Transaction history for{' '}
            <span className="text-void-300">{account.name}</span>
            <span className="mx-2 text-void-700">·</span>
            <span className="rounded-full border border-void-800 bg-void-900 px-2.5 py-0.5 text-xs font-semibold text-void-400">
              {filtered.length} records
            </span>
          </p>
        </div>
        <button
          onClick={onNewTransaction}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:scale-[1.02] hover:bg-violet-700 hover:shadow-violet-500/40 active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          New Transaction
        </button>
      </div>

      {/* ── Budget status banner ─────────────────────────────────── */}
      {budget && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-void-800 bg-void-900/80 p-4 sm:px-5 sm:py-3.5 shadow-lg shadow-black/20">
          {/* Progress + labels */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-void-400">Monthly Budget</span>
              <span className={`text-xs font-bold ${textColor}`}>{budgetLabel}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-void-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                style={{ width: `${spentPct}%` }}
              />
            </div>
            <div className="mt-1 flex items-center justify-between text-[10px] font-medium text-void-500">
              <span>{spentPct.toFixed(1)}% used</span>
              <span>
                {remaining >= 0
                  ? `${formatCurrency(remaining)} remaining`
                  : `${formatCurrency(Math.abs(remaining))} over`}
              </span>
            </div>
          </div>

          {/* Amounts & edit trigger wrapper */}
          <div className="flex items-center justify-between sm:justify-end shrink-0 border-t sm:border-t-0 sm:border-l border-void-800 pt-3 sm:pt-0 sm:pl-4 gap-4">
            <div className="text-left sm:text-right">
              <p className="text-base font-extrabold text-void-50 tracking-tight">
                {formatCurrency(account.monthlySpending)}
              </p>
              <p className="text-[11px] font-medium text-void-500">
                of {formatCurrency(budget.monthlyLimit)} limit
              </p>
            </div>

            {/* Edit button */}
            <button
              onClick={() => onEditBudget(account)}
              title="Edit budget"
              className="shrink-0 flex items-center gap-1.5 rounded-xl border border-void-800 bg-void-950/60 px-3 py-2 text-xs font-semibold text-void-400 transition hover:border-violet-500/50 hover:text-violet-400 active:scale-95 cursor-pointer"
            >
              <Settings size={13} />
              Edit
            </button>
          </div>
        </div>
      )}

      {/* ── Filters ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 rounded-2xl border border-void-800 bg-void-900/80 p-3.5 sm:p-4 items-end">
        <div className="col-span-2 sm:col-span-2 lg:col-span-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-void-500 mb-1.5 block">
            Search
          </span>
          <div className="relative w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-void-500" />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search description or category..."
              className="w-full rounded-xl border border-void-800 bg-void-950/60 py-2.5 pl-9 pr-3 text-sm font-medium text-void-200 placeholder:text-void-500 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </div>
        <div className="col-span-1 sm:col-span-1 lg:col-span-2">
          <FilterSelect label="Type" value={typeFilter} options={typeOptions} onChange={setTypeFilter} />
        </div>
        <div className="col-span-1 sm:col-span-1 lg:col-span-3">
          <FilterSelect label="Category" value={categoryFilter} options={categoryOptions} onChange={setCategoryFilter} />
        </div>
        <div className="col-span-2 sm:col-span-2 lg:col-span-3">
          <FilterSelect label="Status" value={status} options={statusOptions} onChange={setStatus} />
        </div>
      </div>

      {/* ── Mobile Card List View (Visible < md) ───────────────── */}
      <div className="space-y-3 md:hidden">
        {filtered.map((t, i) => {
          const positive = t.amount > 0;
          return (
            <div
              key={i}
              className="rounded-2xl border border-void-800 bg-void-900/80 p-4 space-y-3 shadow-md transition hover:border-void-700"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-void-50 text-sm truncate">{t.description}</p>
                  <p className="text-[11px] font-medium text-void-500 mt-0.5">
                    {formatTransactionDate(t.timestamp || t.date)}
                    <span className="mx-1 text-void-700">·</span>
                    <span>{formatTransactionTime(t.timestamp || t.date, t.description)}</span>
                  </p>
                </div>
                <StatusBadge status={t.status} />
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-void-800/70">
                <span className="rounded-md border border-void-800 bg-void-950/60 px-2 py-0.5 text-xs font-semibold text-void-400">
                  {t.category}
                </span>
                <span className={`text-base font-extrabold tabular-nums ${positive ? 'text-emerald-400' : 'text-void-100'
                  }`}>
                  {formatCurrency(t.amount, { signed: true })}
                </span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-void-800 bg-void-900/80 p-8 text-center flex flex-col items-center justify-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-void-800/80 text-void-400 border border-void-700/50">
              <Search size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-void-100">No matching transactions found</h3>
              <p className="text-xs font-medium text-void-500 mt-1 max-w-sm mx-auto">
                No financial records match your selected type, category, or search query.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                setTypeFilter('All');
                setCategoryFilter('All');
                setStatus('All');
              }}
              className="mt-2 inline-flex items-center gap-2 rounded-xl border border-void-700 bg-void-800/60 px-4 py-2 text-xs font-semibold text-void-200 hover:bg-void-800 hover:text-white transition active:scale-95 cursor-pointer"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </div>

      {/* ── Desktop Table View (Visible >= md) ─────────────────── */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-void-800 bg-void-900/80 shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
            <thead>
              <tr className="border-b border-void-800 text-xs font-semibold uppercase tracking-wider text-void-500">
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Description</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5 text-right">Amount</th>
                <th className="px-5 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-void-800/70">
              {filtered.map((t, i) => {
                const positive = t.amount > 0;
                return (
                  <tr key={i} className="text-sm transition-colors duration-200 hover:bg-void-800/40">
                    <td className="whitespace-nowrap px-5 py-3.5">
                      <span className="block font-medium text-void-400">
                        {formatTransactionDate(t.timestamp || t.date)}
                      </span>
                      <span className="block text-[11px] font-medium text-void-600 mt-0.5">
                        {formatTransactionTime(t.timestamp || t.date, t.description)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-void-50">{t.description}</td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-md border border-void-800 bg-void-950/50 px-2 py-0.5 text-xs font-medium text-void-400">
                        {t.category}
                      </span>
                    </td>
                    <td className={`whitespace-nowrap px-5 py-3.5 text-right font-semibold tabular-nums ${positive ? 'text-emerald-400' : 'text-void-200'
                      }`}>
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
                  <td colSpan={5} className="px-5 py-12">
                    <div className="flex flex-col items-center justify-center gap-2.5 text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-void-800/80 text-void-400 border border-void-700/50">
                        <Search size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-void-200">No transactions match your filters</p>
                        <p className="text-xs font-medium text-void-500 mt-0.5">Try adjusting search keywords or active category filters.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          onSearchChange('');
                          setTypeFilter('All');
                          setCategoryFilter('All');
                          setStatus('All');
                        }}
                        className="mt-1 inline-flex items-center gap-2 rounded-xl border border-void-700 bg-void-800/60 px-3.5 py-1.5 text-xs font-semibold text-void-200 hover:bg-void-800 hover:text-white transition active:scale-95 cursor-pointer"
                      >
                        Reset Search & Filters
                      </button>
                    </div>
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
