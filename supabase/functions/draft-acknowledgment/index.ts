// Implements PRD §4.3: Multilingual Citizen Acknowledgment Draft
// Reuses the shared Groq client module to generate an empathetic acknowledgment message in the citizen's target language.

import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { callGroqLLM } from "../_shared/groq.ts";

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { classification, language = "en", text = "" } = await req.json();

    const langName = language === "hi" ? "Hindi" : language === "mr" ? "Marathi" : "English";

    const systemPrompt = `You are a polite, empathetic civic helpline official for Nagpur Municipal Corporation.
Generate a concise (1-2 sentence) official acknowledgment message in ${langName}.
Confirm that the citizen's issue has been logged, assigned to the relevant department, and field engineers are alerted.
Do NOT use markdown, bullet points, or placeholders. Return plain text only.`;

    const userPrompt = `Language: ${langName} (${language})\nDepartment: ${classification?.department ?? "Civic Services"}\nCategory: ${classification?.category ?? "General"}\nIssue: "${text}"`;

    let ackText = "";
    try {
      ackText = await callGroqLLM([
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ]);
    } catch (_err) {
      // Deterministic fallback templates if Groq call fails or key is missing
      if (language === "hi") {
        ackText = `आपकी शिकायत ${classification?.department ?? "नागपुर नगर निगम"} को सौंप दी गई है। हमारी तकनीकी टीम जल्द कार्रवाई करेगी।`;
      } else if (language === "mr") {
        ackText = `आपली तक्रार ${classification?.department ?? "नागपूर महानगरपालिका"} कडे वर्ग करण्यात आली आहे. आमचे पथक लवकरच पाहणी करेल.`;
      } else {
        ackText = `Thank you for filing this report. Your complaint has been assigned to ${classification?.department ?? "Municipal Services"} for immediate action.`;
      }
    }

    return new Response(
      JSON.stringify({ acknowledgment: ackText.trim() }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[draft-acknowledgment error]", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal Server Error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
