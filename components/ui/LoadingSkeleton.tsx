export default function LoadingSkeleton({ rows = 3, className = '' }: { rows?: number; className?: string }) {
  return (
    <div className={`space-y-3 animate-pulse ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="rounded-xl bg-slate-800/50 h-14 w-full" />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 animate-pulse">
      <div className="h-4 w-1/3 bg-slate-800 rounded mb-4" />
      <div className="h-8 w-1/2 bg-slate-800 rounded" />
    </div>
  );
}
