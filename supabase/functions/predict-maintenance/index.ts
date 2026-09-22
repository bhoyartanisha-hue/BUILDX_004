// Implements PRD §4.12: Predictive Infrastructure Maintenance
// Analyzes road segment repair history and current health score using Groq LLM to generate plain-language maintenance recommendations. Updates road_segments.last_prediction.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { callGroqLLM } from "../_shared/groq.ts";

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { road_segment_id } = await req.json();

    if (!road_segment_id) {
      return new Response(
        JSON.stringify({ error: "Missing 'road_segment_id' in request body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "http://127.0.0.1:54321";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "anon";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: segment, error: fetchErr } = await supabase
      .from("road_segments")
      .select("*")
      .eq("id", road_segment_id)
      .single();

    if (fetchErr || !segment) {
      return new Response(
        JSON.stringify({ error: `Road segment '${road_segment_id}' not found.` }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are a municipal civil engineer analyzing road infrastructure data for Nagpur Municipal Corporation.
Given a road segment's name, repair history, and health score (0-100), generate a 1-2 sentence concise predictive maintenance recommendation.
Highlight structural risks (e.g. sub-surface water leakage, asphalt degradation) and specify recommended action timeframe. Return plain text only.`;

    const userPrompt = `Road Segment: ${segment.name}
Health Score: ${segment.health_score} / 100
Repair History: ${JSON.stringify(segment.repair_history ?? [])}`;

    let predictionText = "";
    try {
      predictionText = await callGroqLLM([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);
    } catch (_err) {
      // Fallback recommendation if LLM is unavailable
      predictionText = segment.health_score < 70
        ? `High risk of asphalt degradation on ${segment.name}. Recommended resurfacing within 30 days.`
        : `Structural condition stable on ${segment.name}. Routine preventive inspection scheduled for Q4.`;
    }

    predictionText = predictionText.trim();

    // Persist prediction result to database
    await supabase
      .from("road_segments")
      .update({ last_prediction: predictionText })
      .eq("id", road_segment_id);

    return new Response(
      JSON.stringify({
        road_segment_id,
        health_score: segment.health_score,
        prediction: predictionText,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[predict-maintenance error]", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal Server Error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
