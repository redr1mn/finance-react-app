/**
 * Skeleton loader components for initial page loading states.
 */

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-void-800 bg-void-900/80 p-5 shadow-lg animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-3 flex-1">
          <div className="h-4 w-28 rounded bg-void-800" />
          <div className="h-8 w-36 rounded bg-void-800" />
          <div className="h-3 w-44 rounded bg-void-800/60" />
        </div>
        <div className="h-8 w-16 rounded bg-void-800 shrink-0" />
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-2xl border border-void-800 bg-void-900/80 p-5 shadow-lg animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-5 w-32 rounded bg-void-800" />
          <div className="h-3 w-48 rounded bg-void-800/60" />
        </div>
        <div className="h-4 w-24 rounded bg-void-800" />
      </div>
      <div className="h-56 w-full rounded-xl bg-void-800/40" />
    </div>
  );
}

export function TransactionRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 animate-pulse border-b border-void-800/50">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-void-800" />
        <div className="space-y-2">
          <div className="h-4 w-32 rounded bg-void-800" />
          <div className="h-3 w-24 rounded bg-void-800/60" />
        </div>
      </div>
      <div className="h-5 w-20 rounded bg-void-800" />
    </div>
  );
}
