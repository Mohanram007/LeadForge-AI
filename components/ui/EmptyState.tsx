import { Search, Inbox } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  title = 'No leads yet',
  description = 'Search for businesses to start building your lead list.',
  actionLabel = 'Search Businesses',
  actionHref = '/dashboard',
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800/80 border border-white/5 mb-4">
        <Inbox className="h-8 w-8 text-slate-500" />
      </div>
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-6">{description}</p>
      {actionHref && (
        <Link
          href={actionHref}
          id="empty-state-cta"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
        >
          <Search className="h-4 w-4" />
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
