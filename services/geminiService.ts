
import { GoogleGenAI, Type } from "@google/genai";
import { Category, PriceRange, Product, SearchResult, AiModel, GeminiSuggestion } from '../types';

// Assumes the API key is set in the environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const userReviewSchema = {
  type: Type.OBJECT,
  properties: {
    username: { type: Type.STRING, description: "Anonymized username of the reviewer (e.g., 'TechLover21', 'Verified Buyer')." },
    rating: { type: Type.NUMBER, description: "The star rating (1-5) given by the user." },
    comment: { type: Type.STRING, description: "The user's review comment, highlighting a specific pro or con." },
  },
  required: ['username', 'rating', 'comment'],
};

const retailerPriceSchema = {
  type: Type.OBJECT,
  properties: {
    retailerName: { type: Type.STRING, description: "Name of the online retailer (e.g., 'Amazon', 'Flipkart', 'Croma')." },
    price: { type: Type.STRING, description: "The current selling price on the retailer's website in INR (e.g., '₹24,999')." },
    url: { type: Type.STRING, description: "The direct URL to the product page on the retailer's website." },
  },
  required: ['retailerName', 'price', 'url'],
};

// Schema for the main product list, excluding detailed AI analysis for faster initial load.
const productSchema = {
  type: Type.OBJECT,
  properties: {
    brand: { type: Type.STRING, description: "Brand name of the product." },
    modelName: { type: Type.STRING, description: "Model name of the product." },
    launchYear: { type: Type.INTEGER, description: "The year the product model was originally launched." },
    reviewStars: { type: Type.NUMBER, description: "Average user review rating out of 5 stars (e.g., 4.5)." },
    totalReviews: { type: Type.INTEGER, description: "The approximate total number of user reviews (e.g., 15400)." },
    summary: { type: Type.STRING, description: "A short, engaging summary of the product's key selling points." },
    priceInINR: { type: Type.STRING, description: "General market price of the product in Indian Rupees (e.g., '₹24,999'). Only for currently available products." },
    expectedPriceInINR: { type: Type.STRING, description: "Expected price for upcoming products in Indian Rupees (e.g., '₹50,000 - ₹60,000')." },
    expectedLaunch: { type: Type.STRING, description: "Expected launch date or period for upcoming products (e.g., 'Q3 2024', 'August 2024')." },
    keySpecs: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of 3-5 key specifications (e.g., 'Snapdragon 8 Gen 3', '120Hz AMOLED Display', '50MP Triple Camera')."
    },
    userReviews: {
      type: Type.ARRAY,
      items: userReviewSchema,
      description: "A list of 2-3 sample user reviews for the product, ensuring variety in opinion. For upcoming phones, this can be based on expert opinions or omitted."
    },
    retailerPrices: {
      type: Type.ARRAY,
      items: retailerPriceSchema,
      description: "A list of current prices from major Indian online retailers like Amazon.in, Flipkart, and Croma. Provide at least 2-3 options if available. Omit for upcoming products."
    },
    // Gadget-specific
    antutuScore: { type: Type.INTEGER, description: "AnTuTu benchmark score, if available (for gadgets like phones)." },
    dxoMarkCamera: { type: Type.INTEGER, description: "DXOMARK camera score, if available (for gadgets like phones)." },
    performanceScore: { type: Type.INTEGER, description: "A holistic performance score from 0-100, where 100 is best-in-class, derived from specs, benchmarks, and review sentiment." },
    connectivity: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 2-4 key connectivity options (e.g., '5G', 'Wi-Fi 6', 'NFC'). For gadgets." },
    batteryLife: { type: Type.STRING, description: "Typical battery life or battery capacity (e.g., 'Up to 2 days', '5000mAh'). For gadgets." },
    // Appliance-specific
    energyRating: { type: Type.STRING, description: "Energy efficiency rating, if applicable (e.g., '5 Star', 'ISEER: 4.5'). For appliances." },
    displayRating: { type: Type.INTEGER, description: "A score out of 100 for display quality, if applicable (for TVs)." },
    capacity: { type: Type.STRING, description: "The capacity or size of the appliance (e.g., '6.5 kg', '250 L', '1.5 Ton')." },
    warranty: { type: Type.STRING, description: "Warranty information (e.g., '1 Year Comprehensive, 10 Years on Motor'). For appliances." },
    installationServices: { type: Type.STRING, description: "Brief information on installation (e.g., 'Standard installation included'). For appliances." },
  },
};

// Schema specifically for fetching the detailed AI analysis on-demand.
const productAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    reviewAnalysis: { type: Type.STRING, description: "An AI-generated analysis summarizing user reviews, highlighting common pros and cons." },
    geminiSuggestion: { 
      type: Type.OBJECT,
      properties: {
        whoIsItFor: { type: Type.STRING, description: "A concise statement describing the ideal user for this product (e.g., 'Best for mobile gamers on a budget who prioritize performance.')." },
        whoShouldAvoidIt: { type: Type.STRING, description: "A concise statement on who should look for alternatives (e.g., 'Users who need a top-tier camera for photography should consider other options.')." },
        keyAlternative: { type: Type.STRING, description: "Suggest one single, specific competitor product by brand and model name (e.g., 'A key alternative is the Samsung Galaxy S23.')." },
      },
      required: ['whoIsItFor', 'whoShouldAvoidIt'],
     },
  },
  required: ['reviewAnalysis', 'geminiSuggestion'],
};

const getPrompt = (category: Category, priceRange?: PriceRange): string => {
  const applianceCategories = ['tvs', 'refrigerators', 'washing_machines', 'acs'];
  const isAppliance = applianceCategories.includes(category.key);

  let prompt = `IMPORTANT: Your response MUST strictly contain only products from the "${category.name}" category. Do NOT include products from any other category, such as mobile phones if TVs are requested.
  
Generate a list of the 6 best-selling and highest-rated ${category.name} currently available in India`;
  if (priceRange) {
    prompt += ` with a price around ${priceRange.label}`;
  }
  prompt += `. For each product, provide details as per the schema, including its launch year. Please ensure all data, especially specifications and pricing, is synthesized from multiple reliable sources for maximum accuracy. Crucially, for each product, also provide the current prices and direct purchase URLs from at least two major Indian online retailers like Amazon.in, Flipkart, and Croma. For each product, also provide a 'performanceScore' from 0 to 100, where 100 is the absolute best in its class. This score should be a holistic measure of performance based on its raw specifications, features, benchmarks (like AnTuTu for phones or energy efficiency for appliances), and overall sentiment from expert and user reviews. Ensure the user reviews are diverse and realistic. Do not generate 'reviewAnalysis' or 'geminiSuggestion' fields.`;
  
  if (category.key === 'watches') {
    prompt += ` For watches, the 'keySpecs' are crucial; please include details like 'Display Type & Size' (e.g., '1.4-inch AMOLED'), 'Battery Life' (e.g., 'Up to 14 days'), 'Key Sensors' (e.g., 'SpO2, Heart Rate Monitor'), and 'Compatibility' (e.g., 'Android & iOS'). Also ensure the top-level 'batteryLife' and 'connectivity' fields are populated. Do NOT provide 'antutuScore' or 'dxoMarkCamera' as they are irrelevant for watches.`;
  } else if (isAppliance) {
    prompt += ` For these appliances, do NOT provide gadget-specific scores like 'antutuScore', 'dxoMarkCamera', 'batteryLife', or 'connectivity'. Prioritize providing 'warranty' and 'installationServices'.`;
    if (category.key === 'tvs') {
        prompt += ` As this is for TVs, you MUST provide 'displayRating' and 'energyRating'. You MUST NOT provide a 'capacity' field.`;
    } else { // refrigerators, washing_machines, acs
        prompt += ` As this is for ${category.name}, you MUST provide 'capacity' and 'energyRating'. You MUST NOT provide a 'displayRating' field.`;
    }
  } else {
    // This now primarily covers 'mobiles'
    prompt += ` For gadgets like phones, prioritize providing 'antutuScore', 'dxoMarkCamera', 'batteryLife', and 'connectivity'. Do NOT provide appliance-specific fields like 'energyRating', 'capacity', 'warranty', or 'installationServices'.`;
  }

  return prompt;
};

const getApiErrorMessage = (error: any): string => {
  console.error("Gemini API Error:", error);

  const errorMessage = (error?.message || '').toLowerCase();

  if (errorMessage.includes('api key not valid')) {
    return "The application's API key is configured incorrectly. Please contact the administrator.";
  }
  if (errorMessage.includes('resource has been exhausted') || errorMessage.includes('rate limit')) {
    return "The service is currently experiencing high traffic. Please try again in a few moments.";
  }
  if (errorMessage.includes('network error') || errorMessage.includes('failed to fetch')) {
    return "A network error occurred. Please check your internet connection and try again.";
  }
  if (error.toString().includes('json')) {
    return "The AI model returned an unexpected format. This can happen occasionally. Please try your request again.";
  }
  if (errorMessage.includes('safety') || errorMessage.includes('blocked')) {
    return "The request was blocked for safety reasons. Please try rephrasing your search or request.";
  }

  // Generic fallback for other server-side or unexpected errors.
  return "An unexpected error occurred while communicating with the AI model. Please try again later.";
};

export const fetchProducts = async (category: Category, priceRange?: PriceRange): Promise<Product[]> => {
  try {
    const prompt = getPrompt(category, priceRange);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: productSchema,
        },
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("The AI model returned an empty response. Please try a different category or price range.");
    }
    
    const products = JSON.parse(jsonText);
    return products as Product[];
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

export const fetchProductAnalysis = async (product: Product): Promise<{ reviewAnalysis: string; geminiSuggestion: GeminiSuggestion; }> => {
  const prompt = `Based on public knowledge and user reviews, generate an "AI Review Analysis" and a structured "AI Suggestion" for the following product:\n\nBrand: ${product.brand}\nModel: ${product.modelName}\nSummary: ${product.summary}\n\nProvide the response in the specified JSON schema, ensuring the suggestion clearly identifies the ideal user, users who should avoid it, and a specific competitor.`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: productAnalysisSchema,
      },
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};


export const compareProducts = async (products: Product[]): Promise<string> => {
  const productDetails = products.map(p => `${p.brand} ${p.modelName}: ${p.summary}`).join('\n');
  const prompt = `Based on the following products:\n${productDetails}\n\nProvide a detailed comparison and a final recommendation for a user who wants the best overall value. Highlight the key strengths and weaknesses of each. Format the response in clear, concise paragraphs.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};

export const search = async (query: string, model: AiModel): Promise<SearchResult> => {
  if (!query) {
    return { summary: '', sources: [], sourceAi: model };
  }

  let prompt = '';
  let config: any = {};

  switch (model) {
    case 'perplexity':
      prompt = `You are a highly intelligent tech analyst AI. Your task is to provide a comprehensive, factual, and synthesized answer to the user's question based *only* on the provided Google Search results. Be direct and objective. The user's question is: "${query}"`;
      config = { tools: [{ googleSearch: {} }] };
      break;
    
    case 'chatgpt':
      prompt = `You are a helpful and conversational AI assistant with a personality similar to ChatGPT. Answer the user's question about mobile phones or smartwatches in India based on your general knowledge up to your last training data. Do not use external search. The question is: "${query}"`;
      config = {}; // No tools, no search
      break;

    case 'gemini':
    default:
      prompt = `Your role is a helpful AI gadget expert. Answer the user's question about mobile phones or smartwatches in India. The question is: "${query}". Provide a concise and helpful summary based on the latest information from Google Search. Do not mention that you are using search.`;
      config = { tools: [{ googleSearch: {} }] };
      break;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: config,
    });
    
    const summary = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return { summary, sources, sourceAi: model };

  } catch (error) {
    throw new Error(getApiErrorMessage(error));
  }
};
