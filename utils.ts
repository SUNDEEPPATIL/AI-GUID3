import { Product, RetailerPrice } from './types';
import { CASHKARO_USER_ID, AFFILIATE_RETAILERS } from './config';

/**
 * Parses a price string (e.g., "₹24,999" or "₹25,000 - ₹30,000") 
 * into its lowest numerical value.
 * @param price - The price string.
 * @returns The lowest price as a number, or Infinity if unparseable.
 */
const parsePrice = (price?: string): number => {
  if (!price) {
    return Infinity;
  }
  // Get the first number from the string by removing currency, commas, and splitting ranges.
  const numericString = price.replace(/[^0-9-]/g, '').split('-')[0];
  const parsedPrice = parseInt(numericString, 10);
  return isNaN(parsedPrice) ? Infinity : parsedPrice;
};

/**
 * Finds the retailer with the lowest price from a list.
 * @param prices - An array of retailer prices.
 * @returns The retailer price object with the lowest price, or null.
 */
export const findBestRetailerPrice = (prices: RetailerPrice[]): RetailerPrice | null => {
  if (!prices || prices.length === 0) {
    return null;
  }
  return [...prices].sort((a, b) => parsePrice(a.price) - parsePrice(b.price))[0];
}

/**
 * Finds the product with the best value from a list based on star rating and price.
 * @param products - An array of products.
 * @returns The product deemed best value, or null if the list is empty.
 */
export const findBestValueProduct = (products: Product[]): Product | null => {
  if (!products || products.length === 0) {
    return null;
  }

  return [...products].sort((a, b) => {
    // Primary sort: higher star rating is better, treat missing rating as 0
    const ratingA = typeof a.reviewStars === 'number' ? a.reviewStars : 0;
    const ratingB = typeof b.reviewStars === 'number' ? b.reviewStars : 0;

    if (ratingB !== ratingA) {
      return ratingB - ratingA;
    }
    
    // Secondary sort: lower price is better
    // Use the best retailer price if available, otherwise fall back to the general price.
    const bestPriceA = findBestRetailerPrice(a.retailerPrices || [])?.price;
    const bestPriceB = findBestRetailerPrice(b.retailerPrices || [])?.price;
    
    const priceA = parsePrice(bestPriceA || a.priceInINR || a.expectedPriceInINR);
    const priceB = parsePrice(bestPriceB || b.priceInINR || b.expectedPriceInINR);
    
    return priceA - priceB;
  })[0];
};

/**
 * Finds the product with the best performance score.
 * @param products - An array of products.
 * @returns The product with the highest performance score, or null.
 */
export const findBestPerformanceProduct = (products: Product[]): Product | null => {
  if (!products || products.length === 0) {
    return null;
  }

  const scoredProducts = products.filter(p => typeof p.performanceScore === 'number');
  if (scoredProducts.length === 0) {
    return null;
  }

  return scoredProducts.sort((a, b) => (b.performanceScore!) - (a.performanceScore!))[0];
};


/**
 * Creates a search link for a product on a specific retailer's website. This is used as a fallback.
 * @param retailer - The retailer price object.
 * @param product - The product object.
 * @returns A URL string that searches for the product on the retailer's site.
 */
const createRetailerSearchLink = (retailer: RetailerPrice, product: Product): string => {
  const query = encodeURIComponent(`${product.brand} ${product.modelName}`);
  const lowerCaseRetailer = retailer.retailerName.toLowerCase();

  const searchUrlTemplates: Record<string, string> = {
    'amazon': `https://www.amazon.in/s?k=${query}`,
    'flipkart': `https://www.flipkart.com/search?q=${query}`,
    'croma': `https://www.croma.com/search/?q=${query}`,
  };

  for (const key in searchUrlTemplates) {
    if (lowerCaseRetailer.includes(key)) {
      return searchUrlTemplates[key];
    }
  }

  // Fallback to the original URL if retailer is not a known partner for search links.
  return retailer.url;
};

/**
 * Creates a purchase link for a product. If the retailer is supported and an affiliate ID is configured,
 * it wraps the URL in a CashKaro affiliate link. Otherwise, it falls back to a direct URL or a search link.
 * @param retailer - The retailer price object from the API.
 * @param product - The product object.
 * @returns A final URL string for the user to click.
 */
export const createPurchaseLink = (retailer: RetailerPrice, product: Product): string => {
  const targetUrl = retailer.url;

  // 1. If no target URL from API, fallback to creating a search link
  if (!targetUrl) {
    return createRetailerSearchLink(retailer, product);
  }

  // 2. If CashKaro ID is not set, return the direct URL
  if (!CASHKARO_USER_ID || CASHKARO_USER_ID === 'YOUR_CASHKARO_ID_HERE') {
    return targetUrl;
  }
  
  try {
    const urlObject = new URL(targetUrl);
    // Hardened affiliate link wrapping: normalized hostname (lowercased, stripped leading www)
    // Only wraps URLs when hostname is an exact match or a proper subdomain of a known retailer
    const normalizedHostname = urlObject.hostname.toLowerCase().replace(/^www\./, '');
    const retailerConfig = AFFILIATE_RETAILERS.find(r => {
      const configHostname = r.hostname.toLowerCase();
      // Exact match or proper subdomain check (security rationale: prevents malicious domain spoofing)
      return normalizedHostname === configHostname || 
             (normalizedHostname.endsWith('.' + configHostname) && !normalizedHostname.includes('..'));
    });
    
    // Only wraps URLs when hostname is an exact match or proper subdomain AND isProductPage returns true
    if (retailerConfig && retailerConfig.isProductPage(urlObject)) {
      const encodedUrl = encodeURIComponent(targetUrl);
      return `https://cashkaro.com/stores/${retailerConfig.slug}?u=${CASHKARO_USER_ID}&url=${encodedUrl}`;
    }
  } catch (error) {
    console.error("Invalid URL for affiliate link generation:", targetUrl, error);
    // Fallback if URL is malformed
    return createRetailerSearchLink(retailer, product);
  }

  // 4. If not an affiliate, return the direct URL
  return targetUrl;
};