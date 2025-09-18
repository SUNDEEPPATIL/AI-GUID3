// Vercel serverless function for Gemini API proxy
// Note: Using any types for Vercel request/response due to importmap-based dependencies
/**
 * Vercel serverless function for Gemini API proxy
 * Accepts POST requests with { prompt, model? } and returns { output, model }
 */
export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, model = 'gemini-2.5-flash' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Get API key with preference for GEMINI_API_KEY
    const apiKey = (process as any).env.GEMINI_API_KEY || (process as any).env.API_KEY;
    
    if (!apiKey) {
      console.error('Missing GEMINI_API_KEY or API_KEY environment variable');
      return res.status(500).json({ error: 'API configuration error' });
    }

    // Initialize Gemini client (imported via dynamic import for runtime compatibility)
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });

    // Generate content using Gemini
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const output = response.text;

    return res.status(200).json({ output, model });

  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate content',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}