
/* Lightweight Gemini service wrapper with defensive checks */
import type { Product, GeminiSuggestion, Category, PriceRange, SearchResult, AiModel } from '../types';

type ProductAnalysis = {
  reviewAnalysis: string;
  geminiSuggestion: GeminiSuggestion;
};

const GEMINI_API_URL = (import.meta.env as any).VITE_GEMINI_API_URL ?? '';
const GEMINI_API_KEY = (import.meta.env as any).VITE_GEMINI_API_KEY ?? '';

export async function fetchProductAnalysis(product?: Product | null): Promise<ProductAnalysis> {
  if (!product) {
    throw new Error('No product provided for analysis');
  }
  if (!GEMINI_API_URL || !GEMINI_API_KEY) {
    throw new Error('Missing Gemini API configuration (VITE_GEMINI_API_URL or VITE_GEMINI_API_KEY)');
  }

  const payload = {
    product,
  };

  const res = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GEMINI_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Gemini API error: ${res.status} ${res.statusText} ${text}`);
  }

  const data = await res.json().catch(() => null);
  if (!data) throw new Error('Invalid response from Gemini API');

  // Basic shape validation & safe defaults
  return {
    reviewAnalysis: data.reviewAnalysis ?? '',
    geminiSuggestion: data.geminiSuggestion ?? ({} as GeminiSuggestion),
  };
}

// Stub implementations for compatibility with existing code
export async function fetchProducts(category: Category, priceRange?: PriceRange): Promise<Product[]> {
  throw new Error('fetchProducts not implemented in lightweight service - configure VITE_GEMINI_API_URL and VITE_GEMINI_API_KEY');
}

export async function compareProducts(products: Product[]): Promise<string> {
  throw new Error('compareProducts not implemented in lightweight service - configure VITE_GEMINI_API_URL and VITE_GEMINI_API_KEY');
}

export async function search(query: string, model: AiModel): Promise<SearchResult> {
  throw new Error('search not implemented in lightweight service - configure VITE_GEMINI_API_URL and VITE_GEMINI_API_KEY');
}
