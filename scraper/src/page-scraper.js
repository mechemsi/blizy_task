const ProductParser = require('./product-parser');

class PageScraper {
    constructor(page) {
        this.page = page;
    }

    async extractProductsFromPage() {
        return await this.page.evaluate(() => {
            // Helper function to parse product title (duplicated in browser context)
            function parseProductTitle(title) {
                const result = {
                    brand: 'Unknown',
                    model: 'Unknown',
                    grade: 'Unknown',
                    storage: 'Unknown',
                    condition: 'Unknown',
                    color: 'Unknown'
                };

                if (!title) return result;

                const titleLower = title.toLowerCase();

                // Extract brand
                const brands = ['iphone', 'samsung', 'huawei', 'xiaomi', 'oppo', 'oneplus', 'google', 'sony', 'lg', 'nokia', 'apple', 'motorola', 'realme', 'poco', 'vivo'];
                for (const brand of brands) {
                    if (titleLower.includes(brand)) {
                        result.brand = brand.charAt(0).toUpperCase() + brand.slice(1);
                        if (brand === 'iphone') result.brand = 'Apple';
                        break;
                    }
                }

                // Extract iPhone model
                if (result.brand.toLowerCase() === 'apple' || titleLower.includes('iphone')) {
                    result.brand = 'Apple';
                    // Updated regex to support XS, SE, X, XR models as well as numbered models
                    const iPhoneMatch = title.match(/iphone\s*(?:(\d+)\s*(?:pro|plus|mini|max)?|(xs|se|xr|x))/i);
                    if (iPhoneMatch) {
                        if (iPhoneMatch[1]) {
                            // Numbered models like iPhone 13, iPhone 13 Pro
                            result.model = `iPhone ${iPhoneMatch[1]}`;
                        } else if (iPhoneMatch[2]) {
                            // Letter models like iPhone XS, SE, X, XR
                            result.model = `iPhone ${iPhoneMatch[2].toUpperCase()}`;
                        }
                    }
                } else {
                    // For other brands, try to extract model
                    const modelMatch = title.match(/(?:galaxy|pixel|mi|redmi|note|pro|plus|ultra|moto|edge|g|e|one|reno|find|a|f|k|narzo|poco|y|neo|iqoo|v|s|t)\s*[\w\s]+/i);
                    if (modelMatch) {
                        result.model = modelMatch[0].trim();
                    }
                }

                // Extract storage
                const storageMatch = title.match(/(\d+)\s*(gb|tb)/i);
                if (storageMatch) {
                    result.storage = `${storageMatch[1]}${storageMatch[2].toUpperCase()}`;
                }

                // Extract color
                const colors = [
                    'black', 'white', 'red', 'blue', 'green', 'yellow', 'pink', 'purple', 'gold', 'silver',
                    'rose gold', 'space gray', 'midnight', 'starlight', 'sierra blue', 'alpine green',
                    'graphite', 'pacific blue', 'coral', 'lavender', 'mint', 'phantom black', 'phantom silver',
                    'phantom white', 'phantom violet', 'mystic black', 'mystic white', 'mystic bronze'
                ];
                
                for (const color of colors) {
                    if (titleLower.includes(color)) {
                        result.color = color.split(' ').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ');
                        break;
                    }
                }

                // Extract grade/condition
                const gradeMatch = title.match(/(grade\s*[a-d]|excellent|good|fair|refurbished|new|used)/i);
                if (gradeMatch) {
                    result.grade = gradeMatch[1];
                }

                return result;
            }

            // Helper function to parse price (duplicated in browser context)
            function parsePrice(priceText) {
                const result = {
                    amount: null,
                    currency: 'PLN'
                };

                if (!priceText) return result;

                // Remove non-numeric characters except decimal points and commas
                const cleanPrice = priceText.replace(/[^\d.,]/g, '');
                
                // Convert to number
                let amount = parseFloat(cleanPrice.replace(',', '.'));
                
                if (!isNaN(amount)) {
                    result.amount = amount;
                }

                // Extract currency
                if (priceText.includes('€') || priceText.toLowerCase().includes('eur')) {
                    result.currency = 'EUR';
                } else if (priceText.includes('$') || priceText.toLowerCase().includes('usd')) {
                    result.currency = 'USD';
                } else if (priceText.includes('zł') || priceText.toLowerCase().includes('pln')) {
                    result.currency = 'PLN';
                }

                return result;
            }

            // Helper function to extract product code from URL
            function extractProductCodeFromUrl(url) {
                if (!url) return null;

                // Try to extract product ID from URL patterns
                const patterns = [
                    /\/product\/([a-zA-Z0-9\-_]+)/,
                    /\/p\/([a-zA-Z0-9\-_]+)/,
                    /[?&]id=([a-zA-Z0-9\-_]+)/,
                    /[?&]product_id=([a-zA-Z0-9\-_]+)/,
                    /\/([a-zA-Z0-9\-_]+)\.html?$/
                ];

                for (const pattern of patterns) {
                    const match = url.match(pattern);
                    if (match && match[1]) {
                        return match[1].toUpperCase();
                    }
                }

                return null;
            }

            // Helper function to generate product code
            function generateProductCode(product) {
                // Try to extract product code from URL first
                const urlCode = extractProductCodeFromUrl(product.url);
                if (urlCode) {
                    return urlCode;
                }

                // Generate a product code based on product attributes
                const brand = product.brand?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'UNK';
                const model = product.model?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'UNK';
                const storage = product.storage?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'UNK';
                const color = product.color?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'UNK';
                const grade = product.grade?.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() || 'UNK';

                // Create a hash-like code
                const baseCode = `${brand}-${model}-${storage}-${color}-${grade}`;
                
                // If the base code is too long, truncate and add a simple hash
                if (baseCode.length > 50) {
                    let hash = 0;
                    for (let i = 0; i < baseCode.length; i++) {
                        const char = baseCode.charCodeAt(i);
                        hash = ((hash << 5) - hash) + char;
                        hash = hash & hash; // Convert to 32-bit integer
                    }
                    const hashStr = Math.abs(hash).toString(36).toUpperCase().substring(0, 6);
                    return `${brand.substring(0, 3)}-${model.substring(0, 8)}-${storage}-${hashStr}`;
                }

                return baseCode;
            }

            const products = [];
            
            // Find all visible product links (not hidden ones)
            let productLinks = Array.from(document.querySelectorAll('a[href*="/product/"]:not(.d-none)'));
            
            console.log(`Found ${productLinks.length} visible product links`);

            // If no visible links found, try all links and filter manually
            if (productLinks.length === 0) {
                const allLinks = Array.from(document.querySelectorAll('a[href*="/product/"]'));
                console.log(`Found ${allLinks.length} total product links, filtering visible ones...`);
                
                productLinks = allLinks.filter(link => {
                    // Check if element is visible
                    const style = window.getComputedStyle(link);
                    return style.display !== 'none' && style.visibility !== 'hidden' && link.offsetParent !== null;
                });
                
                console.log(`After filtering: ${productLinks.length} visible product links`);
            }

            productLinks.forEach((link, index) => {
                try {
                    const product = {};
                    
                    // Get the product URL
                    product.url = link.href;
                    
                    // Extract product title from the link text
                    const linkText = link.textContent?.trim() || '';
                    
                    // Find the closest container that has price and other info
                    let container = link;
                    for (let i = 0; i < 5; i++) {
                        container = container.parentElement;
                        if (!container) break;
                        
                        // Look for price in this container
                        const priceEl = container.querySelector('[data-price], .price') || 
                                      Array.from(container.querySelectorAll('*')).find(el => 
                                          el.textContent && /\d+[\s,.]?\d*\s*(PLN|zł|€|\$)/.test(el.textContent)
                                      );
                        
                        if (priceEl) {
                            product.raw_price = priceEl.textContent?.trim();
                            break;
                        }
                    }
                    
                    // If no price found in container, look for siblings
                    if (!product.raw_price) {
                        const parent = link.parentElement;
                        if (parent) {
                            const siblings = Array.from(parent.children);
                            for (const sibling of siblings) {
                                if (sibling !== link && /\d+[\s,.]?\d*\s*(PLN|zł|€|\$)/.test(sibling.textContent)) {
                                    product.raw_price = sibling.textContent?.trim();
                                    break;
                                }
                            }
                        }
                    }
                    
                    // Extract image
                    const imgEl = link.querySelector('img') || 
                                 link.parentElement?.querySelector('img') ||
                                 link.parentElement?.parentElement?.querySelector('img');
                    product.image_url = imgEl ? (imgEl.src || imgEl.getAttribute('data-src') || '') : '';
                    
                    // Parse title to extract brand, model, etc.
                    const parsed = parseProductTitle(linkText);
                    
                    // Parse price if found
                    const priceInfo = product.raw_price ? parsePrice(product.raw_price) : { amount: null, currency: 'PLN' };
                    
                    product.category = 'Smartphones';
                    product.brand = parsed.brand;
                    product.model = parsed.model;
                    product.grade = parsed.grade;
                    product.storage = parsed.storage;
                    product.color = parsed.color;
                    product.condition_description = parsed.condition;
                    product.price = priceInfo.amount;
                    product.currency = priceInfo.currency;
                    product.availability = 'Available'; // Default
                    product.raw_title = linkText;
                    
                    // Generate product code
                    product.product_code = generateProductCode(product);
                    
                    // Generate product code
                    product.code = generateProductCode(product);
                    
                    if (linkText && product.url) {
                        products.push(product);
                    }
                    
                } catch (error) {
                    console.error(`Error extracting product ${index}:`, error);
                }
            });
            
            return products;
        });
    }
}

module.exports = PageScraper;
