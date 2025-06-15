/**
 * Browser Initialization Module
 * Handles browser and context setup
 */

const BrowserConfig = require('./browser-config');

class BrowserInitializer {
    constructor() {
        this.chromium = null;
    }

    /**
     * Initialize Playwright chromium
     */
    async loadPlaywright() {
        if (!this.chromium) {
            console.log('Loading Playwright...');
            this.chromium = require('playwright').chromium;
        }
        return this.chromium;
    }

    /**
     * Launch browser with configured options
     */
    async launchBrowser() {
        const chromium = await this.loadPlaywright();
        
        console.log('Launching browser...');
        const browser = await chromium.launch(BrowserConfig.getLaunchOptions());
        console.log('Browser launched successfully');
        
        return browser;
    }

    /**
     * Create browser context with configured options
     */
    async createContext(browser) {
        console.log('Creating browser context...');
        const context = await browser.newContext(BrowserConfig.getContextOptions());
        console.log('Browser context created');
        
        return context;
    }

    /**
     * Create a new page
     */
    async createPage(context) {
        console.log('Creating new page...');
        const page = await context.newPage();
        console.log('Page created successfully');
        
        return page;
    }

    /**
     * Initialize complete browser setup
     */
    async initializeBrowser() {
        try {
            const browser = await this.launchBrowser();
            const context = await this.createContext(browser);
            const page = await this.createPage(context);

            return { browser, context, page };
        } catch (error) {
            console.error('Browser initialization failed:', error);
            throw error;
        }
    }
}

module.exports = BrowserInitializer;
