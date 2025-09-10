
import { GoogleGenAI } from "@google/genai";
import type { Product, Sale } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might have a more sophisticated error handling or fallback.
  // For this project, we'll proceed but expect API calls to fail if the key isn't set.
  console.warn("API_KEY environment variable not set for Gemini API.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const getAiInsights = async (query: string, products: Product[], sales: Sale[]): Promise<string> => {
    if (!API_KEY) {
      return Promise.resolve("AI functionality is disabled because the API key is not configured.");
    }

    const model = 'gemini-2.5-flash';

    const systemInstruction = `You are a helpful business analyst for a cafe. 
    Analyze the provided JSON data to answer the user's question.
    Provide a concise, helpful, and friendly answer. 
    Do not output JSON unless specifically asked.
    Today's date is ${new Date().toLocaleDateString()}.`;

    const prompt = `
      User Question: "${query}"

      Here is the available data:

      Products List (inventory):
      ${JSON.stringify(products, null, 2)}

      Sales History:
      ${JSON.stringify(sales, null, 2)}

      Please answer the user's question based on this data.
    `;

    try {
        const response = await ai.models.generateContent({
          model: model,
          contents: prompt,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.5,
          }
        });
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Sorry, I encountered an error while analyzing the data. Please check the configuration and try again.";
    }
};
