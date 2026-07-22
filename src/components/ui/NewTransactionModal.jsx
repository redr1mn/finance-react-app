import { useEffect, useState, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowDownLeft, ArrowUpRight, ChevronDown, Check, Loader2 } from 'lucide-react';
import { formatCurrency } from '../../data/accounts';

const CATEGORIES = ['Groceries', 'Transport', 'Housing', 'Entertainment', 'Utilities', 'Transfer', 'Investment', 'Travel', 'Fees', 'Income'];

const today = () => new Date().toISOString().slice(0, 10);

/**
 * Custom select dropdown component for modal forms.
 * Portals directly to document.body with smart directional positioning
 * to escape all modal clipping boundaries and scroll containers.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.label - Input label text.
 * @param {string} props.value - Currently selected value.
 * @param {Array<{value: string, label: string}>} props.options - Select options array.
 * @param {boolean} [props.disabled=false] - Whether the select input is disabled.
 * @param {Function} props.onChange - Value change callback handler.
 */
function ModalSelect({ label, value, options, disabled, onChange }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, openUp: false });

  const activeLabel = useMemo(() => {
    return options.find((o) => o.value === value)?.label || value;
  }, [value, options]);

  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < 220 && rect.top > 220;
      setCoords({
        top: openUp ? rect.top - 6 : rect.bottom + 6,
        left: rect.left,
        width: rect.width,
        openUp,
      });
    }
  };

  const handleToggle = () => {
    if (disabled) return;
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
    <div className={`w-full ${disabled ? 'opacity-50' : ''}`}>
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-void-500">
        {label}
      </span>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-void-800 bg-void-950/60 px-3 py-2.5 text-sm font-semibold text-void-200 hover:bg-void-900 transition outline-none disabled:cursor-not-allowed cursor-pointer"
      >
        <span className="truncate">{activeLabel}</span>
        {!disabled && (
          <ChevronDown size={14} className={`text-void-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        )}
      </button>

      {open && !disabled && createPortal(
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
            className="z-[9999] max-h-52 overflow-y-auto rounded-xl border border-void-700 bg-void-900 p-1.5 shadow-2xl shadow-black/90 animate-fade-in custom-scrollbar"
          >
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
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-semibold transition cursor-pointer ${selected ? 'text-violet-400 bg-void-800/60' : 'text-void-300 hover:bg-void-800/70'
                    }`}
                >
                  <span className="truncate">{opt.label}</span>
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
 * Modal dialog component for recording new income or expense transactions.
 * Supports amount, category, date, description, and status inputs with inline loading state.
 *
 * @param {Object} props - Component properties.
 * @param {boolean} props.open - Visibility state of the modal.
 * @param {Function} props.onClose - Modal dismissal callback.
 * @param {Function} props.onSubmit - Submission handler receiving the new transaction record.
 */
export default function NewTransactionModal({ open, onClose, onSubmit }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [date, setDate] = useState(today());
  const [status, setStatus] = useState('Completed');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const categoryOptions = useMemo(() => {
    return CATEGORIES.map((c) => ({ value: c, label: c }));
  }, []);

  if (!open) return null;

  const parsedAmount = parseFloat(amount);
  const valid = description.trim() && !Number.isNaN(parsedAmount) && parsedAmount > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!valid || isSubmitting) {
      if (!valid) setError('Please enter a description and a valid amount greater than zero.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        date,
        description: description.trim(),
        category: type === 'income' ? 'Income' : category,
        amount: type === 'income' ? Math.abs(parsedAmount) : -Math.abs(parsedAmount),
        status,
      });
      setIsSubmitting(false);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl border border-void-800 bg-void-900 shadow-2xl shadow-black/60"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-void-800 px-4 sm:px-5 py-3.5 sm:py-4">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-void-50">New Transaction</h2>
            <p className="text-xs font-medium text-void-500">Add an entry to this account</p>
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

        {/* Body */}
        <div className="space-y-4 px-4 sm:px-5 py-4 sm:py-5">
          {/* Type toggle */}
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-void-800 bg-void-950/60 p-1">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition ${type === 'expense'
                  ? 'bg-rose-500/15 text-rose-400 ring-1 ring-inset ring-rose-500/30'
                  : 'text-void-400 hover:text-void-200'
                }`}
            >
              <ArrowUpRight size={15} /> Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition ${type === 'income'
                  ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-inset ring-emerald-500/30'
                  : 'text-void-400 hover:text-void-200'
                }`}
            >
              <ArrowDownLeft size={15} /> Income
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-void-500">
              Amount
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-void-500">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-lg border border-void-800 bg-void-950/60 py-2.5 pl-7 pr-3 text-sm font-semibold text-void-200 placeholder:text-void-500 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-void-500">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Coffee at Blue Bottle"
              className="w-full rounded-lg border border-void-800 bg-void-950/60 px-3 py-2.5 text-sm font-medium text-void-200 placeholder:text-void-500 outline-none transition focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20"
            />
          </div>

          {/* Category + Date row */}
          <div className="grid grid-cols-2 gap-2 relative z-20">
            <ModalSelect
              label="Category"
              value={category}
              options={categoryOptions}
              disabled={type === 'income'}
              onChange={setCategory}
            />
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-void-500">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-lg border border-void-800 bg-void-950/60 px-3 py-2.5 text-sm font-medium text-void-200 outline-none transition focus:border-violet-500/60 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-void-500">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Completed', 'Pending'].map((s) => {
                const isActive = status === s;
                const isCompleted = s === 'Completed';
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`rounded-lg border py-2 text-sm font-semibold transition cursor-pointer ${isActive
                        ? isCompleted
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                          : 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                        : 'border-void-800 bg-void-950/60 text-void-400 hover:text-void-200'
                      }`}
                  >
                    {s}
                  </button>
                );
              })}
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
            className="rounded-xl border border-void-800 bg-void-950/60 px-4 py-2 text-sm font-semibold text-void-300 transition hover:bg-void-800 active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!valid || isSubmitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:bg-violet-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer min-w-[130px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Add Transaction</span>
            )}
          </button>
        </div>

        {/* Preview hint */}
        {valid && (
          <div className="border-t border-void-800 bg-void-950/40 px-4 sm:px-5 py-2.5 text-center text-xs font-medium text-void-500">
            This will add{' '}
            <span className={type === 'income' ? 'text-emerald-400' : 'text-rose-400'}>
              {formatCurrency(
                (type === 'income' ? 1 : -1) * Math.abs(parsedAmount || 0),
                { signed: true },
              )}
            </span>{' '}
            to the account.
          </div>
        )}
      </form>
    </div>
  );
}
