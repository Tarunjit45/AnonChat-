import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY; // Environment variable injection

// Initialize Gemini
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

/**
 * Checks text for toxicity using Gemini 2.5 Flash.
 * Returns { flagged: boolean, reason?: string }
 */
export const moderateContent = async (text: string): Promise<{ flagged: boolean; reason?: string }> => {
  if (!ai) {
    console.warn("Gemini API Key not found. Skipping moderation (simulated safe).");
    return { flagged: false };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze the following user chat message for severe toxicity, hate speech, explicit violence, or illegal content.
      
      Message: "${text}"
      
      Return JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            flagged: { type: Type.BOOLEAN, description: "Whether the content should be blocked" },
            reason: { type: Type.STRING, description: "Short reason if flagged (e.g., 'Hate Speech')" }
          },
          required: ["flagged"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      flagged: result.flagged || false,
      reason: result.reason
    };

  } catch (error) {
    console.error("Moderation failed:", error);
    // Fail safe (or closed) depending on policy. Here we fail open to not block chat on error.
    return { flagged: false };
  }
};