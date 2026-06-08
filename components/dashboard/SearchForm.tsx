'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Loader2 } from 'lucide-react';

const CATEGORY_EXAMPLES = [
  'Restaurant', 'Dentist', 'Gym', 'Salon', 'Real Estate',
  'Hotel', 'Lawyer', 'Clinic', 'Spa', 'Bakery',
];

interface SearchFormProps {
  onSearchStart?: () => void;
  onSearchComplete?: (leads: unknown[]) => void;
}

export default function SearchForm({ onSearchStart, onSearchComplete }: SearchFormProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || !location.trim()) {
      setError('Please enter both a business category and location.');
      return;
    }

    setLoading(true);
    setError('');
    onSearchStart?.();

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: keyword.trim(), location: location.trim() }),
      });

      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();

      onSearchComplete?.(data.leads);
      router.push(`/results?keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`);
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">
      <h2 className="text-lg font-semibold text-white mb-1">Search Businesses</h2>
      <p className="text-sm text-slate-400 mb-6">Find local businesses that need AI services in your target market.</p>

      <form onSubmit={handleSearch} id="business-search-form" className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2" htmlFor="search-keyword">
              Business Category
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                id="search-keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Restaurant, Dentist, Gym..."
                className="w-full rounded-xl border border-white/10 bg-slate-800/50 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2" htmlFor="search-location">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                id="search-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Austin, TX / New York, NY..."
                className="w-full rounded-xl border border-white/10 bg-slate-800/50 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          id="search-submit-btn"
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-blue-600/25"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              Search Businesses
            </>
          )}
        </button>
      </form>

      {/* Quick examples */}
      <div className="mt-4">
        <p className="text-xs text-slate-500 mb-2">Quick examples:</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_EXAMPLES.map((cat) => (
            <button
              key={cat}
              id={`example-${cat.toLowerCase().replace(' ', '-')}`}
              type="button"
              onClick={() => setKeyword(cat)}
              className="rounded-lg border border-white/5 bg-slate-800/50 px-3 py-1 text-xs text-slate-400 hover:border-blue-500/30 hover:text-blue-400 transition-all"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
