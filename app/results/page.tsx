'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import LeadTable from '@/components/leads/LeadTable';
import CSVExportButton from '@/components/leads/CSVExportButton';
import EmptyState from '@/components/ui/EmptyState';
import { Lead } from '@/types';
import {
  List,
  Filter,
  Loader2,
  Globe,
  GlobeOff,
  TrendingUp,
  LayoutList,
} from 'lucide-react';

type FilterType = '' | 'has_website' | 'no_website' | 'high' | 'medium' | 'low';

const FILTER_OPTIONS: { value: FilterType; label: string; icon: React.ElementType }[] = [
  { value: '', label: 'All Leads', icon: LayoutList },
  { value: 'has_website', label: 'Has Website', icon: Globe },
  { value: 'no_website', label: 'No Website', icon: GlobeOff },
  { value: 'high', label: 'High Opportunity', icon: TrendingUp },
  { value: 'medium', label: 'Medium', icon: TrendingUp },
  { value: 'low', label: 'Low', icon: TrendingUp },
];

function ResultsContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const location = searchParams.get('location') || '';

  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('');
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const fetchLeads = async (f: FilterType = filter) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '100', filter: f });
      const res = await fetch(`/api/leads?${params}`);
      if (!res.ok) return;
      const data = await res.json();
      setLeads(data.leads || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleFilterChange = (f: FilterType) => {
    setFilter(f);
    fetchLeads(f);
  };

  const handleAnalyze = async (leadId: string) => {
    setAnalyzingId(leadId);
    try {
      await fetch(`/api/analyze/${leadId}`, { method: 'POST' });
      await fetchLeads();
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleGenerateEmail = async (leadId: string) => {
    setGeneratingId(leadId);
    try {
      await fetch(`/api/email/${leadId}`, { method: 'POST' });
      await fetchLeads();
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <List className="h-5 w-5 text-blue-400" />
              <h1 className="text-2xl font-bold text-white">All Leads</h1>
              {total > 0 && (
                <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400">
                  {total}
                </span>
              )}
            </div>
            {keyword && location && (
              <p className="text-sm text-slate-400">
                Results for <span className="text-white">{keyword}</span> in{' '}
                <span className="text-white">{location}</span>
              </p>
            )}
          </div>
          <CSVExportButton leads={leads} />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Filter className="h-4 w-4 text-slate-500" />
          {FILTER_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              id={`filter-${value || 'all'}`}
              onClick={() => handleFilterChange(value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                filter === value
                  ? 'bg-blue-600/20 border border-blue-500/30 text-blue-400'
                  : 'border border-white/5 bg-slate-900/50 text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="rounded-2xl border border-white/5 bg-slate-900/50">
            <EmptyState
              title="No leads found"
              description="Search for businesses in the dashboard to populate your lead list."
            />
          </div>
        ) : (
          <LeadTable
            leads={leads}
            onAnalyze={handleAnalyze}
            onGenerateEmail={handleGenerateEmail}
            analyzingId={analyzingId}
            generatingId={generatingId}
          />
        )}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
