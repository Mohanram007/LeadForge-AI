import { Recommendation } from '@/types';
import { Lightbulb, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}

const accentColors = [
  { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', num: 'bg-blue-600/20 text-blue-300' },
  { bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', num: 'bg-purple-600/20 text-purple-300' },
  { bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', text: 'text-cyan-400', num: 'bg-cyan-600/20 text-cyan-300' },
  { bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', num: 'bg-indigo-600/20 text-indigo-300' },
  { bg: 'bg-violet-500/10', border: 'border-violet-500/20', text: 'text-violet-400', num: 'bg-violet-600/20 text-violet-300' },
];

export default function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
  const accent = accentColors[index % accentColors.length];

  return (
    <div className={`rounded-2xl border ${accent.border} ${accent.bg} p-5 hover:scale-[1.01] transition-transform`}>
      <div className="flex items-start gap-4">
        {/* Number */}
        <div className={`flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${accent.num}`}>
          {String(index + 1).padStart(2, '0')}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className={`h-4 w-4 ${accent.text}`} />
            <h4 className="text-sm font-semibold text-white">{recommendation.title}</h4>
          </div>

          {/* Problem */}
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="h-3.5 w-3.5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs font-medium text-red-400">Problem: </span>
              <span className="text-xs text-slate-400">{recommendation.problem}</span>
            </div>
          </div>

          {/* Solution */}
          <div className="flex items-start gap-2 mb-2">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="text-xs font-medium text-emerald-400">Solution: </span>
              <span className="text-xs text-slate-400">{recommendation.solution}</span>
            </div>
          </div>

          {/* Benefit */}
          <div className="flex items-start gap-2">
            <TrendingUp className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 ${accent.text}`} />
            <div>
              <span className={`text-xs font-medium ${accent.text}`}>Benefit: </span>
              <span className="text-xs text-slate-400">{recommendation.benefit}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
