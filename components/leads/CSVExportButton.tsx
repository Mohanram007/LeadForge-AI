'use client';

import { useState } from 'react';
import Papa from 'papaparse';
import { Download, Loader2 } from 'lucide-react';
import { Lead } from '@/types';

interface CSVExportButtonProps {
  leads: Lead[];
  filename?: string;
}

export default function CSVExportButton({ leads, filename = 'leadforge-leads' }: CSVExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);

    try {
      const csvData = leads.map((lead) => ({
        'Business Name': lead.business_name,
        'Phone Number': lead.phone_number || '',
        Website: lead.website || '',
        Address: lead.address || '',
        'Maps URL': lead.maps_url || '',
        'Website Status': lead.website_status,
        'Opportunity Score': lead.opportunity_score ?? '',
        'Opportunity Level': lead.opportunity_level || '',
        'Generated Email': lead.generated_email || '',
        'Created At': new Date(lead.created_at).toLocaleDateString(),
      }));

      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      id="csv-export-btn"
      onClick={handleExport}
      disabled={exporting || leads.length === 0}
      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      {exporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      Export CSV ({leads.length})
    </button>
  );
}
