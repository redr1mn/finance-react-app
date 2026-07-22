import { useMemo, useState } from 'react';
import { Search, Plus, ChevronDown, Check } from 'lucide-react';
import StatusBadge from './ui/StatusBadge';
import { formatCurrency } from '../data/accounts';

const CATEGORIES = [
  'All',
  'Income',
  'Groceries',
  'Transport',
  'Housing',
  'Entertainment',
  'Utilities',
  'Transfer',
  'Investment',
  'Travel',
  'Fees',
];

function FilterSelect({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);

  const activeLabel = useMemo(() => {
    return options.find((o) => o.value === value)?.label || value;
  }, [value, options]);

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
        <ChevronDown size={14} className={`text-void-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 right-0 mt-1.5 z-50 max-h-60 overflow-y-auto rounded-xl border border-void-800 bg-void-900 p-1 shadow-2xl animate-fade-in custom-scrollbar">
            {options.map((opt) => {
              const selected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
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
 * PaymentsList — filterable transaction history for the active account.
 */
export default function PaymentsList({ account, onNewTransaction, searchQuery, onSearchChange }) {
  const [typeFilter, setTypeFilter] = useState('All'); // 'All' | 'Income' | 'Expense'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [status, setStatus] = useState('All'); // 'All' | 'Completed' | 'Pending'

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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-void-50 font-sans">Payments</h1>
          <p className="text-sm font-medium text-void-500">
            Transaction history for <span className="text-void-300">{account.name}</span>
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

      {/* Filters: Responsive 12-column grid layout */}
      <div className="grid grid-cols-12 gap-4 rounded-2xl border border-void-800 bg-void-900/80 p-4 items-end">
        <div className="col-span-12 md:col-span-6 lg:col-span-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-void-500 mb-1.5 block">
            Search
          </span>
          <div className="relative w-full">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-void-500" />
            <input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search description or category..."
              className="w-full rounded-xl border border-void-800 bg-void-950/60 py-2 pl-9 pr-3 text-sm font-medium text-void-200 placeholder:text-void-500 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
        </div>

        {/* Type Selector Dropdown */}
        <div className="col-span-12 md:col-span-6 lg:col-span-2">
          <FilterSelect
            label="Type"
            value={typeFilter}
            options={typeOptions}
            onChange={setTypeFilter}
          />
        </div>

        {/* Categories Selector Dropdown */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <FilterSelect
            label="Category"
            value={categoryFilter}
            options={categoryOptions}
            onChange={setCategoryFilter}
          />
        </div>

        {/* Status Selector Dropdown */}
        <div className="col-span-12 md:col-span-6 lg:col-span-3">
          <FilterSelect
            label="Status"
            value={status}
            options={statusOptions}
            onChange={setStatus}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-void-800 bg-void-900/80 shadow-lg shadow-black/20">
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
                  <tr
                    key={i}
                    className="text-sm transition-colors duration-200 hover:bg-void-800/40"
                  >
                    <td className="whitespace-nowrap px-5 py-3.5 font-medium text-void-400">
                      {new Date(t.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-void-50">{t.description}</td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-md border border-void-800 bg-void-950/50 px-2 py-0.5 text-xs font-medium text-void-400">
                        {t.category}
                      </span>
                    </td>
                    <td
                      className={`whitespace-nowrap px-5 py-3.5 text-right font-semibold tabular-nums ${positive ? 'text-emerald-400' : 'text-void-200'
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
                  <td colSpan={5} className="px-5 py-12 text-center text-sm font-medium text-void-500">
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
