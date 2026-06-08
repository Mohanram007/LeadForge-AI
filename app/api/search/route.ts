export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { BusinessDiscoveryService } from '@/services/BusinessDiscoveryService';
import { supabaseAdmin } from '@/lib/supabase';
import { BusinessResult, Lead, WebsiteStatus } from '@/types';
import {
  sanitizeString,
  isValidSearchInput,
  safeParseInt,
  errorResponse,
  handleOptions,
} from '@/lib/api-security';

const discoveryService = new BusinessDiscoveryService();

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request: NextRequest) {
  try {
    // ── Parse body safely ──────────────────────────────────────────────────
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse('Invalid JSON body.', 400);
    }

    if (typeof body !== 'object' || body === null) {
      return errorResponse('Request body must be a JSON object.', 400);
    }

    const rawBody = body as Record<string, unknown>;

    const keyword = sanitizeString(rawBody.keyword, 200);
    const location = sanitizeString(rawBody.location, 200);
    const page = safeParseInt(rawBody.page, 1, 1, 100);

    // ── Validate inputs ────────────────────────────────────────────────────
    if (!keyword) {
      return errorResponse('keyword is required.', 400);
    }
    if (!location) {
      return errorResponse('location is required.', 400);
    }
    if (!isValidSearchInput(keyword)) {
      return errorResponse('keyword contains invalid characters.', 400);
    }
    if (!isValidSearchInput(location)) {
      return errorResponse('location contains invalid characters.', 400);
    }

    // ── Search ────────────────────────────────────────────────────────────
    const businesses = await discoveryService.searchBusinesses({ keyword, location, page });

    // ── Persist to Supabase ───────────────────────────────────────────────
    const savedLeads: Lead[] = [];
    for (const biz of businesses) {
      const websiteStatus: WebsiteStatus = biz.website ? 'Has Website' : 'No Website';

      const { data, error } = await supabaseAdmin
        .from('leads')
        .insert({
          business_name: sanitizeString(biz.name, 300),
          phone_number: biz.phone ? sanitizeString(biz.phone, 50) : null,
          website: biz.website ?? null,
          address: biz.address ? sanitizeString(biz.address, 500) : null,
          maps_url: biz.mapsUrl ?? null,
          website_status: websiteStatus,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving lead:', error.message);
        continue;
      }

      savedLeads.push(data as Lead);
    }

    return NextResponse.json({
      leads: savedLeads,
      total: savedLeads.length,
      page,
    });
  } catch (err) {
    return errorResponse('Search failed. Please try again.', 500, err);
  }
}
