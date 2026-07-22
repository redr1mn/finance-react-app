import { CheckCircle2, Clock } from 'lucide-react';

/**
 * Status badge component rendering color-coded indicators for transaction state.
 *
 * @param {Object} props - Component properties.
 * @param {'Completed' | 'Pending'} props.status - Transaction completion status string.
 */
export default function StatusBadge({ status }) {
  const completed = status === 'Completed';
  return (
    <span
      className={`hidden shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset sm:inline-flex ${
        completed
          ? 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'
          : 'bg-amber-500/10 text-amber-400 ring-amber-500/20'
      }`}
    >
      {completed ? <CheckCircle2 size={12} /> : <Clock size={12} />}
      {status}
    </span>
  );
}
