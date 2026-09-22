// Implements PRD §4.1 & §5: Automatic AI Complaint Classification
// Accepts citizen complaint text and language, invokes Groq LLM to return structured classification.

import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { callGroqLLM } from "../_shared/groq.ts";

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { text, language = "en" } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(
        JSON.stringify({ error: "Missing or invalid 'text' field in request body." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = `You are the Nagpur Municipal Corporation civic complaint classifier AI.
Analyze the citizen's complaint text and determine:
1. category: string (one of: "sewer", "water", "electricity", "gas", "chamber", "road")
2. department: string (one of: "Water & Sanitation", "Water Supply", "Electrical Services", "Emergency Utilities", "Public Works Department")
3. urgency: string (one of: "low", "medium", "high", "critical")
4. severity: integer between 1 and 5 (1 = trivial, 5 = severe emergency/hazard)

Respond strictly in JSON format matching this schema:
{
  "category": "sewer",
  "department": "Water & Sanitation",
  "urgency": "high",
  "severity": 4
}`;

    const userPrompt = `Complaint Language: ${language}\nComplaint Text: "${text}"`;

    let classificationResult;
    try {
      const llmOutput = await callGroqLLM(
        [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        true
      );
      classificationResult = JSON.parse(llmOutput);
    } catch (_err) {
      // Fallback rule-based classifier if LLM call fails or key is unconfigured
      const lower = text.toLowerCase();
      if (/sewer|sewage|drain|overflow|गटर/.test(lower)) {
        classificationResult = { category: "sewer", department: "Water & Sanitation", urgency: "high", severity: 4 };
      } else if (/water|leak|pipe|पानी/.test(lower)) {
        classificationResult = { category: "water", department: "Water Supply", urgency: "high", severity: 4 };
      } else if (/electric|wire|light|cable|बिजली/.test(lower)) {
        classificationResult = { category: "electricity", department: "Electrical Services", urgency: "high", severity: 3 };
      } else if (/gas|smell|गैस/.test(lower)) {
        classificationResult = { category: "gas", department: "Emergency Utilities", urgency: "critical", severity: 5 };
      } else {
        classificationResult = { category: "chamber", department: "Public Works Department", urgency: "medium", severity: 2 };
      }
    }

    return new Response(JSON.stringify(classificationResult), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[classify-complaint error]", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal Server Error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
