// IMPORTANT: To enable affiliate links, replace 'YOUR_CASHKARO_ID_HERE' with your actual CashKaro user ID.
// You can find your ID by logging into CashKaro and looking at your custom referral link.
// It will look something like: https://cashkaro.com/r=123456 - in this case, your ID is '123456'.
// If you leave the default value, links will go directly to the retailer without affiliation.
export const CASHKARO_USER_ID = 'YOUR_CASHKARO_ID_HERE';
/**
 * Configuration for supported affiliate retailers.
 * To add a new retailer, add a new entry to this array.
 */
export const AFFILIATE_RETAILERS = [
    {
        hostname: 'amazon.in',
        slug: 'amazon',
        isProductPage: (url) => {
            const pathname = url.pathname.toLowerCase();
            // Amazon product pages typically contain '/dp/' or '/gp/product/'.
            // Excludes common search/category paths like '/s/'.
            return (pathname.includes('/dp/') || pathname.includes('/gp/product/')) && !pathname.startsWith('/s/');
        }
    },
    {
        hostname: 'flipkart.com',
        slug: 'flipkart',
        isProductPage: (url) => {
            const pathname = url.pathname.toLowerCase();
            // Flipkart product pages usually contain '/p/' and a 'pid' (product ID) search parameter.
            // Excludes search results which use a 'q' (query) parameter.
            return pathname.includes('/p/') && url.searchParams.has('pid') && !url.searchParams.has('q');
        }
    },
    {
        hostname: 'croma.com',
        slug: 'croma',
        isProductPage: (url) => {
            const pathname = url.pathname.toLowerCase();
            // Croma product pages follow a '/p/{product-id}' pattern and do not contain '/search'.
            return pathname.startsWith('/p/') && !pathname.includes('/search');
        }
    },
];
