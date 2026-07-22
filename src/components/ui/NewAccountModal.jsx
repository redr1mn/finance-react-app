import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, CreditCard, User, Palette, DollarSign, Target, ChevronDown, Check } from 'lucide-react';

const ACCENT_OPTIONS = [
  { label: 'Violet', value: 'bg-violet-600', hex: '#7c3aed' },
  { label: 'Emerald', value: 'bg-emerald-600', hex: '#059669' },
  { label: 'Amber', value: 'bg-amber-500', hex: '#f59e0b' },
  { label: 'Sky', value: 'bg-sky-600', hex: '#0284c7' },
  { label: 'Rose', value: 'bg-rose-600', hex: '#e11d48' },
];

function OwnerSelect({ label, value, users, onChange }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, openUp: false });
  const selectedUser = users.find((u) => u.id === value) || users[0];

  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < 200 && rect.top > 200;
      setCoords({
        top: openUp ? rect.top - 6 : rect.bottom + 6,
        left: rect.left,
        width: rect.width,
        openUp,
      });
    }
  };

  const handleToggle = () => {
    if (!open) {
      updateCoords();
    }
    setOpen(!open);
  };

  useEffect(() => {
    if (!open) return;
    const handleScrollOrResize = () => updateCoords();
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);
    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [open]);

  return (
    <div className="w-full">
      <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-void-500">
        <User size={11} className="text-emerald-400" />
        {label}
      </label>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-void-800 bg-void-950/60 px-3.5 py-2.5 text-xs font-semibold text-void-200 hover:bg-void-900 transition outline-none cursor-pointer"
      >
        <div className="flex items-center gap-2 truncate">
          <span className={`h-4 w-4 rounded-full ${selectedUser?.avatar || 'bg-violet-600'} flex items-center justify-center text-[8px] text-white font-bold shrink-0`}>
            {selectedUser?.initials?.[0] || 'U'}
          </span>
          <span className="truncate">{selectedUser?.name}</span>
        </div>
        <ChevronDown size={14} className={`text-void-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && createPortal(
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} aria-hidden="true" />
          <div
            style={{
              position: 'fixed',
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              ...(coords.openUp
                ? { bottom: `${window.innerHeight - coords.top}px` }
                : { top: `${coords.top}px` }),
            }}
            className="z-[9999] max-h-48 overflow-y-auto rounded-xl border border-void-700 bg-void-900 p-1 shadow-2xl shadow-black/90 animate-fade-in custom-scrollbar"
          >
            {users.map((u) => {
              const selected = u.id === value;
              return (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => {
                    onChange(u.id);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition cursor-pointer ${
                    selected ? 'text-violet-400 bg-void-800/60' : 'text-void-300 hover:bg-void-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`h-4 w-4 rounded-full ${u.avatar} flex items-center justify-center text-[8px] text-white font-bold shrink-0`}>
                      {u.initials[0]}
                    </span>
                    <span className="truncate">{u.name}</span>
                  </div>
                  {selected && <Check size={13} className="text-violet-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </>,
        document.body,
      )}
    </div>
  );
}

/**
 * Modal dialog for creating a new personal finance account.
 *
 * @param {Object} props
 * @param {boolean} props.open - Modal visibility state.
 * @param {Array<Object>} props.users - List of users to select owner from.
 * @param {Function} props.onClose - Modal close handler.
 * @param {Function} props.onSubmit - Submission callback receiving new account object.
 */
export default function NewAccountModal({ open, users, onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState(users[0]?.id || 'user-alex');
  const [accent, setAccent] = useState('bg-violet-600');
  const [balance, setBalance] = useState('');
  const [limit, setLimit] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const parsedBalance = parseFloat(balance) || 0;
  const parsedLimit = parseFloat(limit) || 3000;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter an account name.');
      return;
    }

    const selectedUser = users.find((u) => u.id === userId) || users[0];
    const newId = `acc-${Date.now().toString(36)}`;

    const newAccount = {
      id: newId,
      userId: selectedUser.id,
      name: name.trim(),
      owner: selectedUser.name,
      initials: selectedUser.initials,
      accent,
      balance: parsedBalance,
      monthlySpending: 0,
      income: 0,
      trend: { balance: 0, spending: 0 },
      budget: {
        monthlyLimit: parsedLimit,
        initialIncome: 5000,
        savingsTarget: 1000,
      },
      series: [
        { month: 'Jan', spending: 0, income: 0 },
        { month: 'Feb', spending: 0, income: 0 },
        { month: 'Mar', spending: 0, income: 0 },
        { month: 'Apr', spending: 0, income: 0 },
        { month: 'May', spending: 0, income: 0 },
        { month: 'Jun', spending: 0, income: 0 },
        { month: 'Jul', spending: 0, income: 0 },
      ],
      transactions: [],
    };

    onSubmit(newAccount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl border border-void-700 bg-void-900 shadow-2xl shadow-black/80"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-void-800 px-4 sm:px-5 py-3.5 sm:py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <CreditCard size={18} />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-void-50">Create New Account</h2>
              <p className="text-xs font-medium text-void-500">Add a checking, savings, or investment pool</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-void-400 transition hover:bg-void-800 hover:text-void-200 active:scale-95 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4 px-4 sm:px-5 py-4 sm:py-5">
          {/* Account Name */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-void-500">
              <CreditCard size={11} className="text-violet-400" />
              Account Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Travel Vault, Crypto Reserve"
              className="w-full rounded-xl border border-void-800 bg-void-950/60 px-3.5 py-2.5 text-sm font-semibold text-void-200 placeholder:text-void-500 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          {/* Account Owner */}
          <OwnerSelect
            label="Account Owner"
            value={userId}
            users={users}
            onChange={setUserId}
          />

          {/* Color Accent Picker */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-void-500">
              <Palette size={11} className="text-amber-400" />
              Accent Theme
            </label>
            <div className="flex items-center gap-2.5">
              {ACCENT_OPTIONS.map((opt) => {
                const selected = opt.value === accent;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAccent(opt.value)}
                    title={opt.label}
                    className={`h-7 w-7 rounded-md ${opt.value} transition-all cursor-pointer flex items-center justify-center ${
                      selected ? 'ring-1 ring-white ring-offset-1 ring-offset-void-900' : 'opacity-60 hover:opacity-100'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Initial Balance & Monthly Budget */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-void-500">
                <DollarSign size={11} className="text-emerald-400" />
                Initial Balance
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-void-500">$</span>
                <input
                  type="number"
                  step="100"
                  min="0"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-void-800 bg-void-950/60 py-2 pl-7 pr-3 text-xs font-semibold text-void-200 placeholder:text-void-500 outline-none transition focus:border-violet-500/60"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-void-500">
                <Target size={11} className="text-sky-400" />
                Monthly Limit
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-void-500">$</span>
                <input
                  type="number"
                  step="100"
                  min="0"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  placeholder="3000"
                  className="w-full rounded-xl border border-void-800 bg-void-950/60 py-2 pl-7 pr-3 text-xs font-semibold text-void-200 placeholder:text-void-500 outline-none transition focus:border-violet-500/60"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400">
              {error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-void-800 px-4 sm:px-5 py-3.5 sm:py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-void-800 bg-void-950/60 px-4 py-2 text-xs font-semibold text-void-300 transition hover:bg-void-800 active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-violet-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:bg-violet-700 active:scale-95 cursor-pointer"
          >
            <Plus size={14} />
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}
