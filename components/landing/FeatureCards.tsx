import {
  Search,
  Globe,
  Brain,
  Mail,
  Download,
} from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'Business Discovery',
    description:
      'Search thousands of local businesses by category and location. Get instant results with contact details, addresses, and website information.',
    color: 'blue',
  },
  {
    icon: Globe,
    title: 'Website Analysis',
    description:
      'Automatically analyze business websites to detect missing features — contact forms, chat widgets, booking systems, and SEO gaps.',
    color: 'indigo',
  },
  {
    icon: Brain,
    title: 'AI Opportunity Scoring',
    description:
      'Every business gets a 0-100 AI opportunity score based on their digital gaps. Focus on the highest-value prospects first.',
    color: 'purple',
  },
  {
    icon: Mail,
    title: 'Personalized Cold Emails',
    description:
      'AI generates tailored outreach emails for each business, referencing their specific gaps and offering targeted AI solutions.',
    color: 'cyan',
  },
  {
    icon: Download,
    title: 'CSV Export',
    description:
      'Export all your leads, scores, and generated emails to CSV in one click. Ready to import into any CRM or outreach tool.',
    color: 'emerald',
  },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
  purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  cyan: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
};

export default function FeatureCards() {
  return (
    <section className="py-24 bg-slate-950" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-400 mb-4">
            Everything you need
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            The complete AI lead generation toolkit
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            From discovery to outreach, LeadForge AI handles every step of finding and connecting with businesses that need your AI services.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description, color }, i) => (
            <div
              key={title}
              className="group relative rounded-2xl border border-white/5 bg-slate-900/50 p-6 hover:border-white/10 hover:bg-slate-900 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20"
            >
              {/* Glow on hover */}
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity ${colorMap[color].split(' ')[0]}`} />

              <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl border ${colorMap[color]} mb-4`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
