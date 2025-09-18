import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

/**
 * Vercel serverless function that proxies requests to Gemini API.
 * This is an additive feature for future migration if desired.
 * Currently, the frontend still makes direct calls to Gemini.
 * 
 * Usage: POST /api/gemini with body containing prompt and config
 * Response: { text: string, candidates?: any[] }
 */

// Support GEMINI_API_KEY (preferred) falling back to API_KEY
const getApiKey = (): string => {
  const geminiKey = process.env.GEMINI_API_KEY;
  const fallbackKey = process.env.API_KEY;
  
  if (geminiKey) {
    return geminiKey;
  }
  
  if (fallbackKey) {
    console.warn('Using deprecated API_KEY environment variable. Please use GEMINI_API_KEY instead.');
    return fallbackKey;
  }
  
  throw new Error('No GEMINI_API_KEY or API_KEY environment variable found');
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, config = {} } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: config,
    });
    
    return res.status(200).json({
      text: response.text,
      candidates: response.candidates
    });
    
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    
    const errorMessage = (error?.message || '').toLowerCase();
    
    if (errorMessage.includes('api key not valid')) {
      return res.status(401).json({ error: 'Invalid API key configuration' });
    }
    
    if (errorMessage.includes('resource has been exhausted') || errorMessage.includes('rate limit')) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }
    
    return res.status(500).json({ 
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}