import { Search, Globe, Brain, Mail, Download, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: Search,
    title: 'Search Businesses',
    description: 'Enter a business category (Restaurant, Dentist, Gym, etc.) and location. We search thousands of local businesses instantly.',
    color: 'blue',
  },
  {
    number: '02',
    icon: Globe,
    title: 'Analyze Website',
    description: "We automatically visit each business's website and analyze it for missing features, SEO gaps, and automation opportunities.",
    color: 'indigo',
  },
  {
    number: '03',
    icon: Brain,
    title: 'Find AI Opportunities',
    description: 'Our AI scores each business from 0-100 based on digital gaps — the higher the score, the bigger the opportunity.',
    color: 'purple',
  },
  {
    number: '04',
    icon: Mail,
    title: 'Generate Outreach Email',
    description: 'With one click, our AI generates a personalized, human-sounding cold email tailored to each business and their specific gaps.',
    color: 'cyan',
  },
  {
    number: '05',
    icon: Download,
    title: 'Export Leads',
    description: 'Export all your leads, scores, and generated emails to CSV for use in your CRM, email tool, or outreach sequences.',
    color: 'emerald',
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string; line: string }> = {
  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', line: 'bg-blue-500/30' },
  indigo: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400', line: 'bg-indigo-500/30' },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', line: 'bg-purple-500/30' },
  cyan: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', line: 'bg-cyan-500/30' },
  emerald: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', line: 'bg-emerald-500/30' },
};

export default function HowItWorks() {
  return (
    <section className="py-24 bg-slate-900/30" id="how-it-works">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-400 mb-4">
            Simple workflow
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            From search to outreach in 5 steps
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            LeadForge AI automates the entire lead generation workflow, so you can focus on closing deals instead of researching prospects.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-px bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-emerald-500/30" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map(({ number, icon: Icon, title, description, color }, i) => {
              const c = colorMap[color];
              return (
                <div key={title} className="relative flex flex-col items-center text-center group">
                  {/* Icon */}
                  <div className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl border ${c.border} ${c.bg} mb-6 group-hover:scale-110 transition-transform`}>
                    <span className={`absolute -top-2 -right-2 text-xs font-bold ${c.text} bg-slate-950 rounded-full px-1.5 py-0.5 border ${c.border}`}>
                      {number}
                    </span>
                    <Icon className={`h-8 w-8 ${c.text}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
