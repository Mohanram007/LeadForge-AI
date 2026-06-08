import { Clock, Zap } from 'lucide-react';

export default function PricingSection() {
  return (
    <section className="py-24 bg-slate-950" id="pricing">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-slate-400 mb-6">
          Pricing
        </div>
        <h2 className="text-4xl font-bold text-white mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-slate-400 mb-12">
          We're currently in early access. Pricing plans are coming soon.
        </p>

        <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-12 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-600/20 blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20 border border-blue-500/30 mb-6">
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Coming Soon</h3>
            <p className="text-slate-400 mb-8 max-w-sm mx-auto">
              We're finalizing our pricing plans. Join the waitlist to be notified when we launch and get early-bird pricing.
            </p>

            {/* Teaser tiers */}
            <div className="grid grid-cols-3 gap-4 mb-8 text-left">
              {[
                { name: 'Starter', desc: 'For freelancers', price: '$??' },
                { name: 'Pro', desc: 'For agencies', price: '$??', highlight: true },
                { name: 'Enterprise', desc: 'For teams', price: 'Custom' },
              ].map(({ name, desc, price, highlight }) => (
                <div
                  key={name}
                  className={`rounded-xl border p-4 ${
                    highlight
                      ? 'border-blue-500/50 bg-blue-600/10'
                      : 'border-white/5 bg-slate-800/50'
                  }`}
                >
                  <div className="text-sm font-semibold text-white">{name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
                  <div className="text-lg font-bold text-slate-300 mt-2">{price}</div>
                </div>
              ))}
            </div>

            <button
              id="pricing-waitlist-btn"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
            >
              <Zap className="h-4 w-4" />
              Join the Waitlist
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
