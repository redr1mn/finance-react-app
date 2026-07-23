import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast Notification component for surfacing non-intrusive action feedback.
 *
 * @param {Object} props
 * @param {string} props.message - Toast message content.
 * @param {'success' | 'error' | 'info'} [props.type='success'] - Toast status theme.
 * @param {Function} props.onClose - Callback to dismiss the toast notification.
 */
export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />,
    error: <AlertCircle size={18} className="text-rose-400 shrink-0" />,
    info: <Info size={18} className="text-sky-400 shrink-0" />,
  };

  const borderThemes = {
    success: 'border-emerald-500/40 bg-void-900/95 text-void-50',
    error: 'border-rose-500/40 bg-void-900/95 text-void-50',
    info: 'border-sky-500/40 bg-void-900/95 text-void-50',
  };

  return (
    <div className={`fixed bottom-5 right-5 z-[9999] flex items-center gap-3 max-w-sm rounded-2xl border p-3.5 px-4 shadow-2xl shadow-black/80 backdrop-blur-md animate-fade-in ${borderThemes[type] || borderThemes.success}`}>
      {icons[type] || icons.success}
      <span className="text-xs font-semibold text-void-100 flex-1">{message}</span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss toast"
        className="text-void-400 hover:text-void-100 transition p-1 cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
}
