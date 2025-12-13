import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateIcebreaker = async (roomTitle: string, currentTopic: string): Promise<string> => {
  const ai = getClient();
  if (!ai) return "Let's talk about our favorite hobbies!";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a helpful co-host in a voice chat room. 
      The room title is "${roomTitle}" and the current topic is "${currentTopic}".
      Generate a single, engaging, short question or discussion prompt to enliven the conversation.
      Keep it under 20 words. Do not use quotes.`,
    });
    
    return response.text || "Who has a story to share about this?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "What is everyone's opinion on the latest news?";
  }
};