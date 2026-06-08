'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'How does LeadForge AI find businesses?',
    a: 'LeadForge AI uses the Google Places API to search for businesses by category and location. When available, we pull real business data including names, phone numbers, websites, and addresses. When no API key is configured, we use realistic demo data so you can explore the full platform.',
  },
  {
    q: 'How accurate is the website analysis?',
    a: 'Our website analyzer fetches and analyzes the actual HTML of each business website, detecting contact forms, chat widgets, booking systems, social links, and SEO signals. Accuracy is approximately 85-90% for standard websites. Heavily JavaScript-rendered single-page apps may show partial results.',
  },
  {
    q: 'How is the opportunity score calculated?',
    a: 'The score is calculated from 0-100 based on digital gaps: no website (+30), no chat widget (+15), no booking system (+15), no contact form (+10), poor SEO (+10), no social links (+10), and no automation indicators (+10). Higher scores mean more opportunity for AI automation services.',
  },
  {
    q: 'Does the AI email generator require OpenAI?',
    a: "Yes, the personalized email generator uses OpenAI's GPT-4o-mini model. However, if no API key is configured, the system falls back to a high-quality template-based email generator that still personalizes emails based on each business's specific gaps.",
  },
  {
    q: 'Can I export my leads to a CSV?',
    a: 'Yes! Click the "Export CSV" button on the results page to download all your leads with business name, phone, website, address, opportunity score, level, and generated emails — ready to import into any CRM or outreach tool.',
  },
  {
    q: 'Do I need to set up a database?',
    a: 'Yes, LeadForge AI uses Supabase (PostgreSQL) to store leads and analysis results. You\'ll need a free Supabase account and to run the provided SQL migration. The setup takes about 5 minutes.',
  },
  {
    q: 'Is this suitable for agencies?',
    a: 'Absolutely. LeadForge AI is built for freelancers, AI automation consultants, and agencies who want to proactively find businesses that need AI services. The CSV export and email generation features are especially useful for outreach campaigns.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-slate-900/30" id="faq">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-400 mb-4">
            FAQ
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Frequently asked questions</h2>
          <p className="text-slate-400">
            Everything you need to know about LeadForge AI.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <div
              key={i}
              className={`rounded-xl border transition-all ${
                openIndex === i ? 'border-blue-500/30 bg-blue-600/5' : 'border-white/5 bg-slate-900/50'
              }`}
            >
              <button
                id={`faq-item-${i}`}
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="text-sm font-medium text-white">{q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 flex-shrink-0 ml-4 transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-slate-400 leading-relaxed">{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
