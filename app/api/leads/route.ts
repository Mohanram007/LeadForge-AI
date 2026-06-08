export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import {
  safeParseInt,
  isAllowedFilter,
  errorResponse,
  handleOptions,
} from '@/lib/api-security';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page   = safeParseInt(searchParams.get('page'), 1, 1, 1000);
    const limit  = safeParseInt(searchParams.get('limit'), 20, 1, 200);
    const filter = searchParams.get('filter') ?? '';

    // Allowlist the filter value to prevent injection
    if (!isAllowedFilter(filter)) {
      return errorResponse('Invalid filter value.', 400);
    }

    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('leads')
      .select('*, website_analysis(*)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filter === 'has_website') {
      query = query.eq('website_status', 'Has Website');
    } else if (filter === 'no_website') {
      query = query.eq('website_status', 'No Website');
    } else if (filter === 'high') {
      query = query.eq('opportunity_level', 'High');
    } else if (filter === 'medium') {
      query = query.eq('opportunity_level', 'Medium');
    } else if (filter === 'low') {
      query = query.eq('opportunity_level', 'Low');
    }

    const { data, error, count } = await query;

    if (error) {
      return errorResponse('Failed to fetch leads.', 500, error);
    }

    return NextResponse.json({ leads: data, total: count, page, limit });
  } catch (err) {
    return errorResponse('Failed to fetch leads.', 500, err);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse('Invalid JSON body.', 400);
    }

    if (typeof body !== 'object' || body === null) {
      return errorResponse('Request body must be a JSON object.', 400);
    }

    const { ids } = body as Record<string, unknown>;

    if (!Array.isArray(ids) || ids.length === 0) {
      return errorResponse('ids must be a non-empty array.', 400);
    }

    // Validate every ID is a proper UUID — reject the batch if any are invalid
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const invalidIds = ids.filter((id) => typeof id !== 'string' || !UUID_REGEX.test(id));
    if (invalidIds.length > 0) {
      return errorResponse('One or more IDs are invalid.', 400);
    }

    // Enforce a max batch delete size
    if (ids.length > 100) {
      return errorResponse('Cannot delete more than 100 leads at once.', 400);
    }

    const { error } = await supabaseAdmin.from('leads').delete().in('id', ids);

    if (error) {
      return errorResponse('Delete failed.', 500, error);
    }

    return NextResponse.json({ success: true, deleted: ids.length });
  } catch (err) {
    return errorResponse('Delete failed.', 500, err);
  }
}
