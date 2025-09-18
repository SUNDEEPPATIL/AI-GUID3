import React from 'react';

export type AiModel = 'gemini' | 'perplexity' | 'chatgpt';

export interface Category {
  key: 'mobiles' | 'watches' | 'tvs' | 'refrigerators' | 'washing_machines' | 'acs';
  name: string;
  icon: React.FC<{ className?: string }>;
  description: string;
  hasPriceRanges: boolean;
}

export interface PriceRange {
  key: string;
  label: string;
}

export interface UserReview {
  username: string;
  rating: number;
  comment: string;
}

export interface RetailerPrice {
  retailerName: string;
  price: string;
  url: string;
}

export interface GeminiSuggestion {
  whoIsItFor: string;
  whoShouldAvoidIt: string;
  keyAlternative?: string;
}

export interface Product {
  brand: string;
  modelName: string;
  launchYear?: number;
  reviewStars?: number;
  totalReviews?: number;
  summary: string;
  priceInINR?: string;
  expectedPriceInINR?: string;

  expectedLaunch?: string;
  keySpecs?: string[];
  reviewAnalysis?: string;
  geminiSuggestion?: GeminiSuggestion;
  userReviews?: UserReview[]; // Optional as not all products may have user reviews from API
  retailerPrices?: RetailerPrice[];
  // Gadget-specific fields
  antutuScore?: number;
  dxoMarkCamera?: number;
  performanceScore?: number;
  connectivity?: string[]; // e.g., ["5G", "Wi-Fi 6", "NFC"]
  batteryLife?: string; // e.g., "Up to 2 days", "5000mAh"
  // Appliance-specific fields
  energyRating?: string; // e.g., "5 Star", "ISEER: 4.5"
  displayRating?: number; // For TVs
  capacity?: string; // e.g., "6.5 kg", "250 L", "1.5 Ton"
  warranty?: string; // e.g., "1 Year Manufacturer Warranty"
  installationServices?: string; // e.g., "Free installation available"
}

export interface GroundingChunk {
  // FIX: Made web property optional to match the type from the @google/genai SDK.
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface SearchResult {
  summary: string;
  sources: GroundingChunk[];
  sourceAi: AiModel;
}