const BreezySmartphoneScraper = require('./scraper');

class ScheduledScraper {
    constructor() {
        this.interval = process.env.SCRAPER_INTERVAL || 3600000; // 1 hour default
        this.isRunning = false;
    }

    async start() {
        console.log(`Starting scheduled scraper with interval: ${this.interval}ms`);
        
        // Run immediately on start
        await this.runScraper();
        
        // Schedule recurring runs
        setInterval(async () => {
            if (!this.isRunning) {
                await this.runScraper();
            }
        }, this.interval);
    }

    async runScraper() {
        if (this.isRunning) {
            console.log('Scraper already running, skipping...');
            return;
        }

        this.isRunning = true;
        console.log(`Starting scraper run at ${new Date().toISOString()}`);

        try {
            const scraper = new BreezySmartphoneScraper();
            await scraper.run();
            console.log(`Scraper completed successfully at ${new Date().toISOString()}`);
        } catch (error) {
            console.error(`Scraper failed at ${new Date().toISOString()}:`, error);
        } finally {
            this.isRunning = false;
        }
    }
}

// Run the scheduled scraper
const scheduledScraper = new ScheduledScraper();
scheduledScraper.start();

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down gracefully...');
    process.exit(0);
});
