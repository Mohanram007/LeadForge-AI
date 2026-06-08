'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import WebsiteAnalysisCard from '@/components/leads/WebsiteAnalysisCard';
import EmailGenerator from '@/components/leads/EmailGenerator';
import RecommendationCard from '@/components/leads/RecommendationCard';
import OpportunityBadge from '@/components/leads/OpportunityBadge';
import { Lead, WebsiteAnalysis, Recommendation } from '@/types';
import { generateRecommendations } from '@/services/RecommendationEngine';
import {
  ArrowLeft,
  Globe,
  Phone,
  MapPin,
  ExternalLink,
  Zap,
  Loader2,
  Building2,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  BarChart3,
  Lightbulb,
  Mail,
} from 'lucide-react';

interface LeadDetailProps {
  params: Promise<{ id: string }>;
}

export default function LeadDetailPage({ params }: LeadDetailProps) {
  const { id } = use(params);
  const router = useRouter();

  const [lead, setLead] = useState<Lead | null>(null);
  const [analysis, setAnalysis] = useState<WebsiteAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const fetchLead = async () => {
    try {
      const res = await fetch(`/api/leads/${id}`);
      if (res.status === 404) {
        setNotFound(true);
        return;
      }
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      const fetchedLead: Lead = data.lead;
      setLead(fetchedLead);

      // Extract analysis (Supabase returns it nested as array or object)
      const wa = Array.isArray(fetchedLead.website_analysis)
        ? (fetchedLead.website_analysis as unknown as WebsiteAnalysis[])[0] ?? null
        : fetchedLead.website_analysis ?? null;
      setAnalysis(wa);

      // Compute recommendations client-side
      const recs = generateRecommendations(
        wa,
        fetchedLead.website_status,
        fetchedLead.opportunity_score ?? 0
      );
      setRecommendations(recs);
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAnalyze = async () => {
    if (!lead) return;
    setAnalyzing(true);
    try {
      const res = await fetch(`/api/analyze/${id}`, { method: 'POST' });
      if (!res.ok) throw new Error('Analysis failed');
      await fetchLead();
    } finally {
      setAnalyzing(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
          <p className="text-slate-400 text-sm">Loading lead details…</p>
        </div>
      </div>
    );
  }

  /* ── Not Found ── */
  if (notFound || !lead) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Lead Not Found</h1>
          <p className="text-slate-400 text-sm mb-6">
            This lead may have been deleted or the link is invalid.
          </p>
          <Link
            href="/results"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Leads
          </Link>
        </div>
      </div>
    );
  }

  const hasAnalysis = analysis !== null;
  const scoreColor =
    (lead.opportunity_score ?? 0) >= 70
      ? 'text-red-400'
      : (lead.opportunity_score ?? 0) >= 40
      ? 'text-orange-400'
      : 'text-emerald-400';

  return (
    <div className="min-h-screen bg-slate-950 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/results"
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            All Leads
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-sm text-slate-300 truncate max-w-xs">{lead.business_name}</span>
        </div>

        {/* ── Hero Header ── */}
        <div className="rounded-2xl border border-white/5 bg-slate-900/60 p-6 mb-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/20">
                <Building2 className="h-7 w-7 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">{lead.business_name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                  {lead.address && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {lead.address}
                    </span>
                  )}
                  {lead.phone_number && (
                    <a
                      href={`tel:${lead.phone_number}`}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      {lead.phone_number}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Score + Badge */}
            <div className="flex flex-col items-start sm:items-end gap-2">
              <OpportunityBadge level={lead.opportunity_level} score={lead.opportunity_score} size="lg" />
              {lead.opportunity_score !== null && (
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-slate-500" />
                  <span className={`text-2xl font-bold ${scoreColor}`}>
                    {lead.opportunity_score}
                    <span className="text-sm font-normal text-slate-500">/100</span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick links row */}
          <div className="mt-5 pt-5 border-t border-white/5 flex flex-wrap items-center gap-3">
            {lead.website && (
              <a
                href={lead.website}
                target="_blank"
                rel="noopener noreferrer"
                id={`visit-website-${id}`}
                className="inline-flex items-center gap-2 rounded-xl border border-blue-500/30 bg-blue-600/10 px-4 py-2 text-sm text-blue-400 hover:bg-blue-600/20 hover:text-blue-300 transition-all"
              >
                <Globe className="h-4 w-4" />
                Visit Website
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {lead.maps_url && (
              <a
                href={lead.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                id={`view-maps-${id}`}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <MapPin className="h-4 w-4" />
                View on Maps
                <ExternalLink className="h-3 w-3" />
              </a>
            )}

            {/* Analyze / Re-analyze button */}
            <button
              id={`analyze-lead-${id}`}
              onClick={handleAnalyze}
              disabled={analyzing}
              className="inline-flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-600/10 px-4 py-2 text-sm text-purple-400 hover:bg-purple-600/20 hover:text-purple-300 disabled:opacity-50 transition-all ml-auto"
            >
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing…
                </>
              ) : hasAnalysis ? (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Re-Analyze
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Run AI Analysis
                </>
              )}
            </button>
          </div>
        </div>

        {/* ── No Website banner ── */}
        {lead.website_status === 'No Website' && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-orange-500/20 bg-orange-500/5 px-5 py-4">
            <AlertTriangle className="h-5 w-5 text-orange-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-orange-300">No Website Detected</p>
              <p className="text-xs text-slate-400 mt-0.5">
                This business doesn't appear to have a website — a massive opportunity for AI digital presence services.
              </p>
            </div>
          </div>
        )}

        {/* ── Analysis complete banner ── */}
        {hasAnalysis && !analyzing && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-300 font-medium">
              Website analysis complete — AI opportunity score calculated.
            </p>
          </div>
        )}

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column — Analysis + Email */}
          <div className="lg:col-span-2 space-y-6">

            {/* Website Analysis */}
            <WebsiteAnalysisCard analysis={analysis} websiteUrl={lead.website} />

            {/* Email Generator */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <h2 className="text-base font-semibold text-white">AI Cold Email Generator</h2>
              </div>
              <EmailGenerator
                leadId={id}
                businessName={lead.business_name}
                existingEmail={lead.generated_email}
              />
            </div>
          </div>

          {/* Right column — Recommendations */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-yellow-400" />
              <h2 className="text-base font-semibold text-white">AI Recommendations</h2>
            </div>

            {recommendations.length === 0 ? (
              <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6 text-center">
                <Zap className="h-8 w-8 text-slate-600 mx-auto mb-3" />
                <p className="text-sm text-slate-500">
                  Run AI analysis to generate personalized recommendations.
                </p>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600/20 border border-blue-500/30 px-4 py-2 text-xs text-blue-400 hover:bg-blue-600/30 transition-all"
                >
                  <Zap className="h-3.5 w-3.5" />
                  Run Analysis
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map((rec, i) => (
                  <RecommendationCard key={rec.title} recommendation={rec} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Metadata footer ── */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <span>Lead ID: <span className="font-mono text-slate-500">{id}</span></span>
          <span>
            Added:{' '}
            {new Date(lead.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
