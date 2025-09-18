import { GoogleGenAI } from "@google/genai";

// Serverless function for Gemini API calls
// POST { prompt, model? } → { output, model }
// Uses GEMINI_API_KEY, 405 for non-POST, 400 if prompt missing, 500 on internal error
// Comment notes frontend not yet migrated to use it

export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, model = 'gemini-2.5-flash' } = req.body;

  // Validate prompt is provided
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Use GEMINI_API_KEY environment variable
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const output = response.text;

    return res.status(200).json({ output, model });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}