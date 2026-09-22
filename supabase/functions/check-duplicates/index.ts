// Implements PRD §4.2: Live Spatial & Text Duplicate Check
// Queries nearby complaints within a 500m radius using Haversine distance and scores text similarity via local TF-IDF cosine matching.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handleCors } from "../_shared/cors.ts";

// Haversine spatial distance calculation in meters
function haversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Simple TF-IDF cosine similarity between two text strings
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function computeSimilarityScore(text1: string, text2: string): number {
  const tokens1 = tokenize(text1);
  const tokens2 = tokenize(text2);
  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  const freq1: Record<string, number> = {};
  const freq2: Record<string, number> = {};
  tokens1.forEach((t) => (freq1[t] = (freq1[t] || 0) + 1));
  tokens2.forEach((t) => (freq2[t] = (freq2[t] || 0) + 1));

  const allWords = new Set([...Object.keys(freq1), ...Object.keys(freq2)]);
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  for (const word of allWords) {
    const v1 = freq1[word] || 0;
    const v2 = freq2[word] || 0;
    dotProduct += v1 * v2;
    mag1 += v1 * v1;
    mag2 += v2 * v2;
  }

  if (mag1 === 0 || mag2 === 0) return 0;
  return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { lat, lng, description, radius_meters = 500 } = await req.json();

    if (lat === undefined || lng === undefined || !description) {
      return new Response(
        JSON.stringify({ error: "Missing lat, lng, or description in request body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Connect to Supabase DB via client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "http://127.0.0.1:54321";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "anon";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: candidates, error } = await supabase
      .from("complaints")
      .select("*");

    if (error) {
      console.error("[check-duplicates DB query error]", error);
      throw error;
    }

    const matches = (candidates || [])
      .map((c) => {
        const dist = haversineDistanceMeters(lat, lng, c.lat, c.lng);
        const sim = computeSimilarityScore(description, c.description);
        return {
          complaint: c,
          distance_meters: Math.round(dist),
          similarity_score: Math.round(sim * 100) / 100,
        };
      })
      .filter((m) => m.distance_meters <= radius_meters && m.similarity_score >= 0.25)
      .sort((a, b) => b.similarity_score - a.similarity_score);

    return new Response(
      JSON.stringify({
        matching_complaints: matches,
        total_matches: matches.length,
        radius_meters,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[check-duplicates error]", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal Server Error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
