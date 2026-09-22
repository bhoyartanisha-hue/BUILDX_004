// Implements PRD §4.13: Contractor Work Verification & Timeline Update
// Endpoint used by contractors/officials to advance a complaint from Pending Verification -> Verified, appending verification evidence & timestamps to the timeline.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, handleCors } from "../_shared/cors.ts";

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const {
      complaint_id,
      role = "contractor",
      status = "verified",
      note = "Work inspection completed & verified on-site.",
      evidence_url,
    } = await req.json();

    if (!complaint_id) {
      return new Response(
        JSON.stringify({ error: "Missing 'complaint_id' parameter." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Role-gating check: only contractor or official allowed
    if (role !== "contractor" && role !== "official") {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Only contractor or official roles can perform verification." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "http://127.0.0.1:54321";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "anon";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch existing complaint
    const { data: complaint, error: fetchErr } = await supabase
      .from("complaints")
      .select("*")
      .eq("id", complaint_id)
      .single();

    if (fetchErr || !complaint) {
      return new Response(
        JSON.stringify({ error: `Complaint '${complaint_id}' not found.` }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const currentTimeline: Array<Record<string, unknown>> = Array.isArray(complaint.timeline)
      ? complaint.timeline
      : [];

    const newTimelineEntry = {
      step: `Work Verification (${role.toUpperCase()})`,
      timestamp: new Date().toISOString(),
      note,
      evidence_url: evidence_url || null,
    };

    const updatedTimeline = [...currentTimeline, newTimelineEntry];

    // Update status and timeline array
    const { data: updatedComplaint, error: updateErr } = await supabase
      .from("complaints")
      .update({
        status,
        timeline: updatedTimeline,
      })
      .eq("id", complaint_id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    return new Response(
      JSON.stringify({
        message: "Verification successful.",
        complaint: updatedComplaint,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[update-verification error]", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal Server Error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
