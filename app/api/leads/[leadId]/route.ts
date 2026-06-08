export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isValidUUID, errorResponse, handleOptions } from '@/lib/api-security';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await params;

    if (!isValidUUID(leadId)) {
      return errorResponse('Invalid lead ID.', 400);
    }

    const { data, error } = await supabaseAdmin
      .from('leads')
      .select('*, website_analysis(*)')
      .eq('id', leadId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }

    return NextResponse.json({ lead: data });
  } catch (err) {
    return errorResponse('Failed to fetch lead.', 500, err);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await params;

    if (!isValidUUID(leadId)) {
      return errorResponse('Invalid lead ID.', 400);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return errorResponse('Invalid JSON body.', 400);
    }

    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return errorResponse('Request body must be a JSON object.', 400);
    }

    // Allowlist updatable fields — never allow arbitrary column writes
    const ALLOWED_PATCH_FIELDS = new Set([
      'business_name',
      'phone_number',
      'website',
      'address',
      'maps_url',
      'website_status',
      'opportunity_score',
      'opportunity_level',
      'generated_email',
    ]);

    const safeUpdate: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
      if (ALLOWED_PATCH_FIELDS.has(key)) {
        safeUpdate[key] = value;
      }
    }

    if (Object.keys(safeUpdate).length === 0) {
      return errorResponse('No valid fields to update.', 400);
    }

    const { data, error } = await supabaseAdmin
      .from('leads')
      .update(safeUpdate)
      .eq('id', leadId)
      .select()
      .single();

    if (error) {
      return errorResponse('Update failed.', 500, error);
    }

    return NextResponse.json({ lead: data });
  } catch (err) {
    return errorResponse('Update failed.', 500, err);
  }
}
