// Backward compatibility - use the refactored modular version
const BreezySmartphoneScraper = require('./scraper-refactored');

// Re-export the class for backward compatibility
module.exports = BreezySmartphoneScraper;

// If this file is run directly, execute the main function
if (require.main === module) {
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
    
    main();
}
