import { OpportunityLevel } from '@/types';

interface OpportunityBadgeProps {
  level: OpportunityLevel | null;
  score?: number | null;
  size?: 'sm' | 'md' | 'lg';
}

const levelConfig: Record<OpportunityLevel, { bg: string; text: string; border: string; dot: string }> = {
  High: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/30',
    dot: 'bg-red-400',
  },
  Medium: {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
    dot: 'bg-orange-400',
  },
  Low: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    dot: 'bg-emerald-400',
  },
};

const sizeMap = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-3 py-1 text-xs gap-1.5',
  lg: 'px-4 py-1.5 text-sm gap-2',
};

export default function OpportunityBadge({ level, score, size = 'md' }: OpportunityBadgeProps) {
  if (!level) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/50 bg-slate-800/50 px-3 py-1 text-xs text-slate-500">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
        Not Scored
      </span>
    );
  }

  const config = levelConfig[level];

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.bg} ${config.text} ${config.border} ${sizeMap[size]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot} flex-shrink-0`} />
      {level}
      {score !== undefined && score !== null && (
        <span className="opacity-70 ml-0.5">({score})</span>
      )}
    </span>
  );
}
