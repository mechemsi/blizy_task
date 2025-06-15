require('dotenv').config();

const BrowserManager = require('./browser-manager');
const DatabaseManager = require('./database');
const PageScraper = require('./page-scraper');
const ProductParser = require('./product-parser');

class BreezySmartphoneScraper {
    constructor() {
        this.baseUrl = 'https://breezy.pl/en/category/2nd-life-smartphones';
        this.browserManager = new BrowserManager();
        this.databaseManager = new DatabaseManager();
        this.pageScraper = null;
    }

    async init() {
        console.log('Initializing Breezy Smartphone Scraper...');
        
        // Initialize browser
        await this.browserManager.init();
        
        // Initialize database connection
        await this.databaseManager.connect();
        
        // Create page scraper with the browser page
        this.pageScraper = new PageScraper(this.browserManager.getPage());
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async scrapeProducts() {
        console.log('Starting product scraping...');
        
        try {
            await this.browserManager.navigateToPage(this.baseUrl);

            // Wait for the page to fully load and products to be visible
            console.log('Page loaded, looking for products...');

            // Accept cookies if present
            await this.browserManager.acceptCookies();

            let allProducts = [];
            let currentPage = 1;
            let hasNextPage = true;

            while (hasNextPage) {
                console.log(`Scraping page ${currentPage}...`);
                
                // Add pause every 10 pages
                if (currentPage % 10 === 0) {
                    console.log('Reached 10 pages milestone. Pausing for 10 seconds...');
                    await this.delay(10000);
                }
                
                // Log pagination info for debugging on first page
                if (currentPage === 1) {
                    await this.browserManager.logPaginationInfo();
                }
                
                const products = await this.pageScraper.extractProductsFromPage();
                allProducts.push(...products);
                
                console.log(`Found ${products.length} products on page ${currentPage}`);
                
                // Check if there's a next page
                hasNextPage = await this.browserManager.goToNextPage();
                
                if (hasNextPage) {
                    currentPage++;
                    // Give more time for page load and overlay dismissal
                    await this.browserManager.getPage().waitForTimeout(3000);
                    
                    // Accept cookies again if they reappear
                    await this.browserManager.acceptCookies();
                } else {
                    console.log(`No more pages available after page ${currentPage}`);
                }
            }

            // Post-process products to ensure product codes are generated
            const processedProducts = allProducts.map(product => {
                if (!product.product_code) {
                    product.product_code = ProductParser.generateProductCode(product);
                }
                return product;
            });

            console.log(`Total products scraped: ${processedProducts.length}`);
            
            // Save to database
            await this.databaseManager.saveProducts(processedProducts);
            
            return processedProducts;

        } catch (error) {
            console.error('Error during scraping:', error);
            throw error;
        }
    }

    // Legacy methods for backward compatibility
    parseProductTitle(title) {
        return ProductParser.parseProductTitle(title);
    }

    parsePrice(priceText) {
        return ProductParser.parsePrice(priceText);
    }

    async close() {
        await this.browserManager.close();
        await this.databaseManager.close();
    }

    async run() {
        try {
            await this.init();
            const products = await this.scrapeProducts();
            console.log('Scraping completed successfully');
            return products;
        } catch (error) {
            console.error('Scraping failed:', error);
            throw error;
        } finally {
            await this.close();
        }
    }
}

// Run the scraper
async function main() {
    const scraper = new BreezySmartphoneScraper();
    
    try {
        await scraper.run();
        console.log('Scraper finished successfully');
        process.exit(0);
    } catch (error) {
        console.error('Scraper failed:', error);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = BreezySmartphoneScraper;
