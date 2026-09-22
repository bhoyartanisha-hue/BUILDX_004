// Implements PRD §4.4: Complaint Clustering & Hotspot Threshold Flagging
// Groups incoming complaints into spatial/category clusters. Recalculates centroids and flags recurring hotspots when occurrence threshold N >= 3 is reached.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handleCors } from "../_shared/cors.ts";

function haversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
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

const HOTSPOT_THRESHOLD = 3; // N >= 3 complaints in proximity triggers recurring hotspot status

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { complaint_id, category, lat, lng } = await req.json();

    if (!complaint_id || !category || lat === undefined || lng === undefined) {
      return new Response(
        JSON.stringify({ error: "Missing complaint_id, category, lat, or lng." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "http://127.0.0.1:54321";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "anon";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch existing clusters in the same category
    const { data: existingClusters, error: fetchErr } = await supabase
      .from("clusters")
      .select("*")
      .eq("category", category);

    if (fetchErr) throw fetchErr;

    let targetCluster = (existingClusters || []).find(
      (c) => haversineDistanceMeters(lat, lng, c.centroid_lat, c.centroid_lng) <= 300
    );

    let clusterId = "";
    let occurrenceCount = 1;
    let isHotspot = false;
    let action = "created";

    if (targetCluster) {
      // Group into existing cluster
      action = "grouped";
      clusterId = targetCluster.id;
      const complaintIds: string[] = Array.isArray(targetCluster.complaint_ids)
        ? targetCluster.complaint_ids
        : [];

      if (!complaintIds.includes(complaint_id)) {
        complaintIds.push(complaint_id);
      }

      occurrenceCount = complaintIds.length;
      // Explainable hotspot rule: occurrence_count >= HOTSPOT_THRESHOLD (3)
      isHotspot = occurrenceCount >= HOTSPOT_THRESHOLD;

      // Recalculate centroid average
      const newLat = (targetCluster.centroid_lat * (occurrenceCount - 1) + lat) / occurrenceCount;
      const newLng = (targetCluster.centroid_lng * (occurrenceCount - 1) + lng) / occurrenceCount;

      const { error: updateClusterErr } = await supabase
        .from("clusters")
        .update({
          complaint_ids: complaintIds,
          centroid_lat: newLat,
          centroid_lng: newLng,
          occurrence_count: occurrenceCount,
          is_hotspot: isHotspot,
        })
        .eq("id", clusterId);

      if (updateClusterErr) throw updateClusterErr;
    } else {
      // Create new cluster
      const { data: newCluster, error: createErr } = await supabase
        .from("clusters")
        .insert({
          complaint_ids: [complaint_id],
          centroid_lat: lat,
          centroid_lng: lng,
          category,
          occurrence_count: 1,
          is_hotspot: false,
        })
        .select()
        .single();

      if (createErr) throw createErr;
      clusterId = newCluster.id;
    }

    // Attach cluster_id to the complaint
    await supabase
      .from("complaints")
      .update({ cluster_id: clusterId })
      .eq("id", complaint_id);

    return new Response(
      JSON.stringify({
        cluster_id: clusterId,
        occurrence_count: occurrenceCount,
        is_hotspot: isHotspot,
        action,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[cluster-complaint error]", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal Server Error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
