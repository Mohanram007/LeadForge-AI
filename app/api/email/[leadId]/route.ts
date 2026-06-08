export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { EmailGeneratorService } from '@/services/EmailGeneratorService';
import { generateRecommendations } from '@/services/RecommendationEngine';
import { Lead, WebsiteAnalysis, WebsiteStatus } from '@/types';
import { isValidUUID, errorResponse, handleOptions } from '@/lib/api-security';

const emailService = new EmailGeneratorService();

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const { leadId } = await params;

    // ── Validate UUID before any DB query ──────────────────────────────────
    if (!isValidUUID(leadId)) {
      return errorResponse('Invalid lead ID.', 400);
    }

    // ── Fetch lead with analysis ──────────────────────────────────────────
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .select('*, website_analysis(*)')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }

    const typedLead = lead as Lead & { website_analysis: WebsiteAnalysis[] };
    const analysis = typedLead.website_analysis?.[0] ?? null;

    const recommendations = generateRecommendations(
      analysis,
      typedLead.website_status as WebsiteStatus,
      typedLead.opportunity_score ?? 0
    );

    const { subject, body } = await emailService.generateEmail(
      typedLead,
      analysis,
      recommendations
    );

    const fullEmail = `Subject: ${subject}\n\n${body}`;

    // ── Persist generated email ───────────────────────────────────────────
    await supabaseAdmin
      .from('leads')
      .update({ generated_email: fullEmail })
      .eq('id', leadId);

    return NextResponse.json({ subject, body, fullEmail });
  } catch (err) {
    return errorResponse('Email generation failed. Please try again.', 500, err);
  }
}
