class ProductParser {
    static parseProductTitle(title) {
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
            // First try brand-specific patterns
            if (result.brand === 'Samsung') {
                const samsungMatch = title.match(/samsung\s+(galaxy\s+[\w\s]+?)(?:\s+\d+gb|\s+grade|\s+$)/i);
                if (samsungMatch) {
                    result.model = samsungMatch[1].trim();
                }
            } else if (result.brand === 'Huawei') {
                const huaweiMatch = title.match(/huawei\s+([\w\s]+?)(?:\s+\d+gb|\s+grade|\s+$)/i);
                if (huaweiMatch) {
                    result.model = huaweiMatch[1].trim();
                }
            } else if (result.brand === 'Xiaomi') {
                const xiaomiMatch = title.match(/xiaomi\s+([\w\s]+?)(?:\s+\d+gb|\s+grade|\s+$)/i);
                if (xiaomiMatch) {
                    result.model = xiaomiMatch[1].trim();
                }
            } else if (result.brand === 'Motorola') {
                const motorolaMatch = title.match(/motorola\s+([\w\s]+?)(?:\s+\d+gb|\s+grade|\s+$)/i);
                if (motorolaMatch) {
                    result.model = motorolaMatch[1].trim();
                }
            } else if (result.brand === 'Realme') {
                const realmeMatch = title.match(/realme\s+([\w\s]+?)(?:\s+\d+gb|\s+grade|\s+$)/i);
                if (realmeMatch) {
                    result.model = realmeMatch[1].trim();
                }
            } else if (result.brand === 'Poco') {
                const pocoMatch = title.match(/poco\s+([\w\s]+?)(?:\s+\d+gb|\s+grade|\s+$)/i);
                if (pocoMatch) {
                    result.model = pocoMatch[1].trim();
                }
            } else if (result.brand === 'Vivo') {
                const vivoMatch = title.match(/vivo\s+([\w\s]+?)(?:\s+\d+gb|\s+grade|\s+$)/i);
                if (vivoMatch) {
                    result.model = vivoMatch[1].trim();
                }
            } else if (result.brand === 'Oppo') {
                const oppoMatch = title.match(/oppo\s+([\w\s]+?)(?:\s+\d+gb|\s+grade|\s+$)/i);
                if (oppoMatch) {
                    result.model = oppoMatch[1].trim();
                }
            } else {
                // Fallback to generic pattern
                const modelMatch = title.match(/(?:galaxy|pixel|mi|redmi|note|pro|plus|ultra|moto|edge|g|e|one|reno|find|a|f|k|narzo|poco|y|neo|iqoo|v|s|t)\s*[\w\s]+/i);
                if (modelMatch) {
                    result.model = modelMatch[0].trim();
                }
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

    static parsePrice(priceText) {
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

    static generateProductCode(product) {
        // Try to extract product code from URL first
        const urlCode = this.extractProductCodeFromUrl(product.url);
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
            const hash = this.simpleHash(baseCode);
            return `${brand.substring(0, 3)}-${model.substring(0, 8)}-${storage}-${hash}`;
        }

        return baseCode;
    }

    static extractProductCodeFromUrl(url) {
        if (!url) return null;

        // Try to extract product ID from URL patterns
        // Example: /product/12345 or /product/abc-123 or ?id=12345
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

    static simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(36).toUpperCase().substring(0, 6);
    }
}

module.exports = ProductParser;
