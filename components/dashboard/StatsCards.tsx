import { Users, Globe, Globe2, TrendingUp } from 'lucide-react';
import { StatsData } from '@/types';

interface StatsCardsProps {
  stats: StatsData;
  loading?: boolean;
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  loading,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  loading?: boolean;
}) {
  const colorMap: Record<string, string> = {
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 hover:border-white/10 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{label}</p>
          {loading ? (
            <div className="h-9 w-16 rounded-lg bg-slate-800 animate-pulse mt-2" />
          ) : (
            <p className="text-3xl font-bold text-white">{value}</p>
          )}
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${colorMap[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function StatsCards({ stats, loading }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Leads"
        value={stats.totalLeads}
        icon={Users}
        color="blue"
        loading={loading}
      />
      <StatCard
        label="With Website"
        value={stats.withWebsite}
        icon={Globe}
        color="emerald"
        loading={loading}
      />
      <StatCard
        label="Without Website"
        value={stats.withoutWebsite}
        icon={Globe2}
        color="orange"
        loading={loading}
      />
      <StatCard
        label="Avg. Opportunity Score"
        value={loading ? 0 : `${stats.avgOpportunityScore}/100`}
        icon={TrendingUp}
        color="purple"
        loading={loading}
      />
    </div>
  );
}
