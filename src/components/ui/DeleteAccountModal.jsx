import { AlertTriangle, Trash2, X } from 'lucide-react';

/**
 * Confirmation dialog for account removal.
 * Prevents accidental deletion of active accounts and warns when attempting
 * to delete the last remaining account in the application state.
 *
 * @param {Object} props
 * @param {boolean} props.open - Modal open state.
 * @param {Object} props.account - Account object targeted for deletion.
 * @param {boolean} props.isOnlyAccount - True if only 1 account remains in state.
 * @param {Function} props.onClose - Modal close handler.
 * @param {Function} props.onConfirm - Deletion confirmation handler.
 */
export default function DeleteAccountModal({
  open,
  account,
  isOnlyAccount,
  onClose,
  onConfirm,
}) {
  if (!open || !account) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-sm max-h-[90vh] overflow-y-auto custom-scrollbar rounded-2xl border border-void-700 bg-void-900 shadow-2xl shadow-black/80">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-void-800 px-4 sm:px-5 py-3.5 sm:py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30">
              <AlertTriangle size={18} />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-void-50">Delete Account</h2>
              <p className="text-xs font-medium text-void-500">Confirm account removal</p>
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

        {/* Content */}
        <div className="px-4 sm:px-5 py-4 sm:py-5 space-y-3">
          {isOnlyAccount ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-300">
              <p className="font-bold mb-1">Cannot Delete Only Account</p>
              <p className="text-amber-300/80">
                You must keep at least one active account in your workspace. Please create another account first before deleting this one.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-void-300">
                Are you sure you want to delete <span className="font-bold text-void-50">{account.name}</span>?
              </p>
              <div className="rounded-xl border border-void-800 bg-void-950/60 p-3 text-xs text-void-400 space-y-1">
                <p>· Owner: <span className="text-void-200 font-semibold">{account.owner}</span></p>
                <p>· Transactions: <span className="text-void-200 font-semibold">{account.transactions?.length ?? 0} items</span></p>
              </div>
              <p className="text-[11px] font-semibold text-rose-400">
                This action cannot be undone.
              </p>
            </>
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
          {!isOnlyAccount && (
            <button
              type="button"
              onClick={() => {
                onConfirm(account.id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-500/25 transition hover:bg-rose-700 active:scale-95 cursor-pointer"
            >
              <Trash2 size={13} />
              Delete Account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
