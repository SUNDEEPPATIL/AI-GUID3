import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Optional serverless endpoint for Gemini API (frontend not yet migrated to use this)
// Provides a backend alternative to direct frontend API calls for enhanced security
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, model = 'gemini-2.5-flash' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Use GEMINI_API_KEY from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY environment variable is not set');
      return res.status(500).json({ error: 'API key not configured' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const output = response.text;

    return res.status(200).json({ output, model });

  } catch (error) {
    // Log error for debugging but don't expose details to client
    console.error('Gemini API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}