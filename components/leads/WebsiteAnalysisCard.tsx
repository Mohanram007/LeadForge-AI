import { WebsiteAnalysis } from '@/types';
import { CheckCircle2, XCircle, Globe, MessageSquare, Calendar, Share2, Smartphone, TrendingUp } from 'lucide-react';

interface WebsiteAnalysisCardProps {
  analysis: WebsiteAnalysis | null;
  websiteUrl?: string | null;
}

interface FeatureRowProps {
  icon: React.ElementType;
  label: string;
  present: boolean;
}

function FeatureRow({ icon: Icon, label, present }: FeatureRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-slate-500" />
        <span className="text-sm text-slate-300">{label}</span>
      </div>
      {present ? (
        <div className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-xs font-medium">Present</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-red-400">
          <XCircle className="h-4 w-4" />
          <span className="text-xs font-medium">Missing</span>
        </div>
      )}
    </div>
  );
}

export default function WebsiteAnalysisCard({ analysis, websiteUrl }: WebsiteAnalysisCardProps) {
  if (!analysis) {
    return (
      <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">
        <h3 className="text-base font-semibold text-white mb-2">Website Analysis</h3>
        <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
          No analysis available. Run analysis to see results.
        </div>
      </div>
    );
  }

  const seoLabel =
    analysis.seo_score >= 75 ? 'Good' : analysis.seo_score >= 50 ? 'Fair' : 'Poor';
  const seoColor =
    analysis.seo_score >= 75
      ? 'text-emerald-400'
      : analysis.seo_score >= 50
      ? 'text-orange-400'
      : 'text-red-400';

  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white">Website Analysis</h3>
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            <Globe className="h-3 w-3" />
            Visit Site
          </a>
        )}
      </div>

      {/* Page info */}
      {(analysis.page_title || analysis.meta_description) && (
        <div className="rounded-xl bg-slate-800/50 p-4 mb-4 space-y-1">
          {analysis.page_title && (
            <p className="text-xs text-slate-500 font-medium">
              Title: <span className="text-slate-300">{analysis.page_title}</span>
            </p>
          )}
          {analysis.meta_description && (
            <p className="text-xs text-slate-500 font-medium">
              Meta: <span className="text-slate-400">{analysis.meta_description.substring(0, 120)}...</span>
            </p>
          )}
        </div>
      )}

      {/* Features */}
      <div className="divide-y divide-white/0">
        <FeatureRow icon={MessageSquare} label="Contact Form" present={analysis.has_contact_form} />
        <FeatureRow icon={MessageSquare} label="Chat Widget" present={analysis.has_chat_widget} />
        <FeatureRow icon={Calendar} label="Booking System" present={analysis.has_booking_system} />
        <FeatureRow icon={Share2} label="Social Media Links" present={analysis.has_social_links} />
        <FeatureRow icon={Smartphone} label="Mobile Friendly" present={analysis.mobile_friendly} />
      </div>

      {/* SEO Score */}
      <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-800/50 px-4 py-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-slate-500" />
          <span className="text-sm text-slate-300">SEO Score</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 rounded-full bg-slate-700 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                analysis.seo_score >= 75 ? 'bg-emerald-500' : analysis.seo_score >= 50 ? 'bg-orange-500' : 'bg-red-500'
              }`}
              style={{ width: `${analysis.seo_score}%` }}
            />
          </div>
          <span className={`text-sm font-semibold ${seoColor}`}>
            {analysis.seo_score}/100 ({seoLabel})
          </span>
        </div>
      </div>
    </div>
  );
}
