'use client';

import { useState } from 'react';
import { Loader2, Mail, Copy, Check, Sparkles } from 'lucide-react';

interface EmailGeneratorProps {
  leadId: string;
  businessName: string;
  existingEmail?: string | null;
}

export default function EmailGenerator({ leadId, businessName, existingEmail }: EmailGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<{ subject: string; body: string } | null>(
    existingEmail ? parseExistingEmail(existingEmail) : null
  );
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  function parseExistingEmail(raw: string): { subject: string; body: string } {
    const lines = raw.split('\n');
    const subjectLine = lines.find((l) => l.startsWith('Subject:'));
    const subject = subjectLine ? subjectLine.replace('Subject:', '').trim() : 'Generated Email';
    const bodyStart = lines.findIndex((l) => l === '') + 1;
    const body = lines.slice(bodyStart).join('\n').trim();
    return { subject, body };
  }

  const handleGenerate = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/email/${leadId}`, { method: 'POST' });
      if (!response.ok) throw new Error('Generation failed');
      const data = await response.json();
      setEmail({ subject: data.subject, body: data.body });
    } catch (err) {
      setError('Failed to generate email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!email) return;
    const text = `Subject: ${email.subject}\n\n${email.body}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-blue-400" />
          <h3 className="text-base font-semibold text-white">AI Email Generator</h3>
        </div>
        {email && (
          <button
            id={`copy-email-${leadId}`}
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Email
              </>
            )}
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Email Preview */}
      {email ? (
        <div className="space-y-3">
          {/* Subject */}
          <div className="rounded-xl bg-slate-800/50 border border-white/5 p-4">
            <div className="text-xs font-medium text-slate-500 mb-1">Subject Line</div>
            <div className="text-sm text-white font-medium">{email.subject}</div>
          </div>

          {/* Body */}
          <div className="rounded-xl bg-slate-800/50 border border-white/5 p-4">
            <div className="text-xs font-medium text-slate-500 mb-2">Email Body</div>
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{email.body}</pre>
          </div>

          {/* Regenerate */}
          <button
            id={`regenerate-email-${leadId}`}
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-blue-400 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate a different version
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/20 mb-4">
            <Sparkles className="h-6 w-6 text-blue-400" />
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Generate a personalized cold email for{' '}
            <span className="text-white font-medium">{businessName}</span> using AI.
          </p>
          <button
            id={`generate-email-${leadId}`}
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-blue-600/25"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Email
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
