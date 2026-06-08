'use client';

import Link from 'next/link';
import { ArrowRight, Search, Zap, TrendingUp } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400 mb-8 backdrop-blur-sm">
          <Zap className="h-3.5 w-3.5" />
          <span>AI-Powered Lead Generation Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
          Find Businesses That{' '}
          <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-indigo-400 bg-clip-text text-transparent">
            Need AI Services
          </span>{' '}
          In Minutes
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Discover local businesses, analyze their websites, identify automation opportunities, and generate personalized outreach emails instantly.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/dashboard"
            id="hero-cta-primary"
            className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white hover:bg-blue-500 transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25"
          >
            Start Finding Leads
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all backdrop-blur-sm"
          >
            See How It Works
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
          {[
            { value: '10K+', label: 'Businesses Found' },
            { value: '95%', label: 'Analysis Accuracy' },
            { value: '3min', label: 'Avg. Time to Lead' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-slate-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Floating UI preview */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-sm p-4 shadow-2xl shadow-black/50 overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <div className="h-3 w-3 rounded-full bg-green-500/70" />
              <div className="flex-1 mx-4 h-7 rounded-md bg-slate-800/80 flex items-center px-3">
                <span className="text-xs text-slate-500">leadforge.ai/dashboard</span>
              </div>
            </div>
            {/* Mock dashboard preview */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Total Leads', value: '48', color: 'blue' },
                { label: 'With Website', value: '31', color: 'emerald' },
                { label: 'Without Website', value: '17', color: 'orange' },
                { label: 'Avg. Score', value: '72', color: 'purple' },
              ].map(({ label, value, color }) => (
                <div key={label} className={`rounded-xl bg-${color}-500/10 border border-${color}-500/20 p-3 text-left`}>
                  <div className="text-xs text-slate-400">{label}</div>
                  <div className={`text-2xl font-bold text-${color}-400 mt-1`}>{value}</div>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-slate-800/50 p-3">
              <div className="flex gap-2 mb-3">
                <div className="flex-1 h-9 rounded-lg bg-slate-700/50 flex items-center px-3">
                  <Search className="h-3.5 w-3.5 text-slate-500 mr-2" />
                  <span className="text-xs text-slate-500">Restaurant</span>
                </div>
                <div className="flex-1 h-9 rounded-lg bg-slate-700/50 flex items-center px-3">
                  <span className="text-xs text-slate-500">Austin, TX</span>
                </div>
                <div className="h-9 px-4 rounded-lg bg-blue-600 flex items-center text-xs text-white font-medium">Search</div>
              </div>
              {[
                { name: "Bella's Italian Kitchen", score: 85, level: 'High', status: 'Has Website' },
                { name: 'Austin Dental Associates', score: 100, level: 'High', status: 'No Website' },
                { name: 'FitLife Gym & Wellness', score: 65, level: 'Medium', status: 'Has Website' },
              ].map(({ name, score, level, status }) => (
                <div key={name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <span className="text-xs text-slate-300">{name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      level === 'High' ? 'bg-red-500/20 text-red-400' :
                      level === 'Medium' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>{level}</span>
                    <span className="text-xs text-slate-400">{score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
