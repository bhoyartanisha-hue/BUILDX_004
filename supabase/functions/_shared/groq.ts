// Implements PRD §5: Unified Groq API Integration Module
// Shared LLM inference helper reused across classify-complaint, draft-acknowledgment, and predict-maintenance.

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callGroqLLM(
  messages: GroqMessage[],
  jsonMode: boolean = false,
  model: string = "llama-3.3-70b-versatile"
): Promise<string> {
  const apiKey = Deno.env.get("GROQ_API_KEY");

  if (!apiKey) {
    console.warn("[Groq Client] GROQ_API_KEY is not set. Returning mock fallback response for offline local mode.");
    return jsonMode ? JSON.stringify({ fallback: true }) : "Fallback response: API Key missing.";
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.2,
        max_tokens: 1024,
        response_format: jsonMode ? { type: "json_object" } : undefined,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Groq Client Error] HTTP ${response.status}: ${errorText}`);
      throw new Error(`Groq API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content ?? "";
  } catch (error) {
    console.error("[Groq Client Exception]", error);
    throw error;
  }
}
