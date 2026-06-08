'use client';

import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { Lead } from '@/types';
import OpportunityBadge from './OpportunityBadge';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ExternalLink,
  Globe,
  GlobeOff,
  Eye,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

interface LeadTableProps {
  leads: Lead[];
  onAnalyze?: (leadId: string) => Promise<void>;
  onGenerateEmail?: (leadId: string) => Promise<void>;
  analyzingId?: string | null;
  generatingId?: string | null;
}

export default function LeadTable({
  leads,
  onAnalyze,
  onGenerateEmail,
  analyzingId,
  generatingId,
}: LeadTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useMemo<ColumnDef<Lead>[]>(
    () => [
      {
        accessorKey: 'business_name',
        header: 'Business Name',
        cell: ({ row }) => (
          <div className="font-medium text-white">{row.original.business_name}</div>
        ),
      },
      {
        accessorKey: 'phone_number',
        header: 'Phone',
        cell: ({ getValue }) => (
          <span className="text-slate-400 text-sm">{(getValue() as string) || '—'}</span>
        ),
      },
      {
        accessorKey: 'website',
        header: 'Website',
        cell: ({ row }) =>
          row.original.website ? (
            <a
              href={row.original.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm max-w-[150px] truncate transition-colors"
            >
              <ExternalLink className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{row.original.website.replace(/^https?:\/\//, '')}</span>
            </a>
          ) : (
            <span className="text-slate-500 text-sm">No website</span>
          ),
      },
      {
        accessorKey: 'address',
        header: 'Address',
        cell: ({ getValue }) => (
          <span className="text-slate-400 text-sm max-w-[180px] truncate block">{(getValue() as string) || '—'}</span>
        ),
      },
      {
        accessorKey: 'maps_url',
        header: 'Maps',
        cell: ({ getValue }) => {
          const url = getValue() as string;
          return url ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-400 transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
              View
            </a>
          ) : (
            <span className="text-slate-600">—</span>
          );
        },
      },
      {
        accessorKey: 'website_status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue() as string;
          return status === 'Has Website' ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
              <Globe className="h-3 w-3" />
              Has Website
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-400">
              <GlobeOff className="h-3 w-3" />
              No Website
            </span>
          );
        },
      },
      {
        accessorKey: 'opportunity_score',
        header: 'Score',
        cell: ({ row }) => (
          <OpportunityBadge level={row.original.opportunity_level} score={row.original.opportunity_score} />
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const lead = row.original;
          return (
            <div className="flex items-center gap-2">
              <Link
                href={`/leads/${lead.id}`}
                id={`view-lead-${lead.id}`}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <Eye className="h-3.5 w-3.5" />
                Details
              </Link>
              {onAnalyze && !lead.opportunity_score && (
                <button
                  id={`analyze-lead-${lead.id}`}
                  onClick={() => onAnalyze(lead.id)}
                  disabled={analyzingId === lead.id}
                  className="inline-flex items-center gap-1 rounded-lg border border-blue-500/30 bg-blue-600/10 px-2.5 py-1.5 text-xs text-blue-400 hover:bg-blue-600/20 disabled:opacity-50 transition-all"
                >
                  {analyzingId === lead.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  Analyze
                </button>
              )}
              {onGenerateEmail && (
                <button
                  id={`email-lead-${lead.id}`}
                  onClick={() => onGenerateEmail(lead.id)}
                  disabled={generatingId === lead.id}
                  className="inline-flex items-center gap-1 rounded-lg border border-purple-500/30 bg-purple-600/10 px-2.5 py-1.5 text-xs text-purple-400 hover:bg-purple-600/20 disabled:opacity-50 transition-all"
                >
                  {generatingId === lead.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  Email
                </button>
              )}
            </div>
          );
        },
      },
    ],
    [onAnalyze, onGenerateEmail, analyzingId, generatingId]
  );

  const table = useReactTable({
    data: leads,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="rounded-2xl border border-white/5 bg-slate-900/50 overflow-hidden">
      {/* Table toolbar */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-0 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            id="leads-table-filter"
            type="text"
            placeholder="Filter leads..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-800/50 py-2 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <div className="text-sm text-slate-500">
          {table.getFilteredRowModel().rows.length} leads
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-900/80">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 whitespace-nowrap"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-1 ${
                          header.column.getCanSort() ? 'cursor-pointer select-none hover:text-slate-300 transition-colors' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <>
                            {header.column.getIsSorted() === 'asc' ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : header.column.getIsSorted() === 'desc' ? (
                              <ChevronDown className="h-3 w-3" />
                            ) : (
                              <ChevronsUpDown className="h-3 w-3 opacity-40" />
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center text-slate-500 text-sm">
                  No leads found. Search for businesses to get started.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
        <div className="text-xs text-slate-500">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </div>
        <div className="flex items-center gap-2">
          <button
            id="table-prev-page"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            id="table-next-page"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
