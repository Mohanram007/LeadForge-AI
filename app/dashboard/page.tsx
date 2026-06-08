'use client';

import { useState, useEffect } from 'react';
import SearchForm from '@/components/dashboard/SearchForm';
import StatsCards from '@/components/dashboard/StatsCards';
import LeadTable from '@/components/leads/LeadTable';
import EmptyState from '@/components/ui/EmptyState';
import { Lead, StatsData } from '@/types';
import { Zap, RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalLeads: 0,
    withWebsite: 0,
    withoutWebsite: 0,
    avgOpportunityScore: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch('/api/leads?limit=5');
      if (!res.ok) return;
      const data = await res.json();
      setRecentLeads(data.leads || []);

      const total = data.total || 0;

      // Get breakdown stats
      const [withRes, withoutRes] = await Promise.all([
        fetch('/api/leads?filter=has_website&limit=1'),
        fetch('/api/leads?filter=no_website&limit=1'),
      ]);
      const withData = await withRes.json();
      const withoutData = await withoutRes.json();

      // Calculate avg score from first 20 leads
      const scoreRes = await fetch('/api/leads?limit=20');
      const scoreData = await scoreRes.json();
      const scoredLeads = (scoreData.leads || []).filter((l: Lead) => l.opportunity_score !== null);
      const avg =
        scoredLeads.length > 0
          ? Math.round(scoredLeads.reduce((s: number, l: Lead) => s + (l.opportunity_score || 0), 0) / scoredLeads.length)
          : 0;

      setStats({
        totalLeads: total,
        withWebsite: withData.total || 0,
        withoutWebsite: withoutData.total || 0,
        avgOpportunityScore: avg,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleAnalyze = async (leadId: string) => {
    setAnalyzingId(leadId);
    try {
      await fetch(`/api/analyze/${leadId}`, { method: 'POST' });
      await fetchStats();
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-5 w-5 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            </div>
            <p className="text-sm text-slate-400">
              Find businesses, analyze opportunities, and generate outreach emails.
            </p>
          </div>
          <button
            id="dashboard-refresh"
            onClick={fetchStats}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8">
          <StatsCards stats={stats} loading={loadingStats} />
        </div>

        {/* Search */}
        <div className="mb-8">
          <SearchForm onSearchComplete={() => fetchStats()} />
        </div>

        {/* Recent Leads */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-white">Recent Leads</h2>
            <a href="/results" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              View all →
            </a>
          </div>

          {recentLeads.length === 0 && !loadingStats ? (
            <div className="rounded-2xl border border-white/5 bg-slate-900/50">
              <EmptyState
                title="No leads yet"
                description="Use the search above to find local businesses that need AI services."
                actionLabel="Search Businesses"
                actionHref="/dashboard"
              />
            </div>
          ) : (
            <LeadTable leads={recentLeads} onAnalyze={handleAnalyze} analyzingId={analyzingId} />
          )}
        </div>
      </div>
    </div>
  );
}
