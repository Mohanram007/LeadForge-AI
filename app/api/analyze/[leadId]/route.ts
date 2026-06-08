export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { WebsiteAnalyzerService } from '@/services/WebsiteAnalyzerService';
import { scoreOpportunity } from '@/services/OpportunityScoringEngine';
import { generateRecommendations } from '@/services/RecommendationEngine';
import { Lead, WebsiteStatus } from '@/types';
import { isValidUUID, errorResponse, handleOptions } from '@/lib/api-security';

const analyzerService = new WebsiteAnalyzerService();

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

    // ── Fetch the lead ────────────────────────────────────────────────────
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    }

    const typedLead = lead as Lead;
    let analysis = null;

    // ── Analyze website if available ──────────────────────────────────────
    if (typedLead.website) {
      analysis = await analyzerService.analyzeWebsite({
        lead_id: leadId,
        url: typedLead.website,
      });

      const { error: analysisError } = await supabaseAdmin
        .from('website_analysis')
        .upsert({ ...analysis, lead_id: leadId }, { onConflict: 'lead_id' });

      if (analysisError) {
        console.error('Analysis save error:', analysisError.message);
      }
    }

    // ── Score opportunity ─────────────────────────────────────────────────
    const { score, level, factors } = scoreOpportunity(
      analysis,
      typedLead.website_status as WebsiteStatus
    );

    // ── Generate recommendations ──────────────────────────────────────────
    const recommendations = generateRecommendations(
      analysis,
      typedLead.website_status as WebsiteStatus,
      score
    );

    // ── Update lead with scores ───────────────────────────────────────────
    const { data: updatedLead, error: updateError } = await supabaseAdmin
      .from('leads')
      .update({ opportunity_score: score, opportunity_level: level })
      .eq('id', leadId)
      .select()
      .single();

    if (updateError) {
      console.error('Lead update error:', updateError.message);
    }

    return NextResponse.json({
      lead: updatedLead ?? typedLead,
      analysis,
      score,
      level,
      factors,
      recommendations,
    });
  } catch (err) {
    return errorResponse('Analysis failed. Please try again.', 500, err);
  }
}
