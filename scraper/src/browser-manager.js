const CookieHandler = require('./cookie-handler');
const PaginationHandler = require('./pagination-handler');
const BrowserInitializer = require('./browser-initializer');
const NavigationHandler = require('./navigation-handler');
const ErrorHandler = require('./error-handler');

class BrowserManager {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
        this.cookieHandler = null;
        this.paginationHandler = null;
        this.navigationHandler = null;
        this.browserInitializer = new BrowserInitializer();
    }

    async init() {
        ErrorHandler.logInfo('Initializing browser...');
        
        try {
            // Initialize browser, context, and page using the initializer
            const { browser, context, page } = await this.browserInitializer.initializeBrowser();
            
            this.browser = browser;
            this.context = context;
            this.page = page;
            
            // Initialize handlers
            this.cookieHandler = new CookieHandler(this.page);
            this.paginationHandler = new PaginationHandler(this.page);
            this.navigationHandler = new NavigationHandler(this.page);
            
            ErrorHandler.logInfo('Browser initialized successfully');
        } catch (error) {
            ErrorHandler.logError('Failed to initialize browser', error);
            throw error;
        }
    }

    async navigateToPage(url, options = {}) {
        if (!this.page) {
            throw new Error('Browser not initialized. Call init() first.');
        }
        
        return await this.navigationHandler.navigateToUrl(url, options);
    }

    // Navigation-related methods
    async waitForPageReady(timeout) {
        return await this.navigationHandler.waitForPageReady(timeout);
    }

    async refreshPage() {
        return await this.navigationHandler.refreshPage();
    }

    getCurrentUrl() {
        return this.navigationHandler.getCurrentUrl();
    }

    async isPageLoaded() {
        return await this.navigationHandler.isPageLoaded();
    }

    // Delegate cookie-related methods to CookieHandler
    async acceptCookies() {
        return await this.cookieHandler.acceptCookies();
    }

    async dismissOverlays() {
        return await this.cookieHandler.dismissOverlays();
    }

    async handleCookiesAndOverlays() {
        return await this.cookieHandler.handleCookiesAndOverlays();
    }

    // Delegate pagination-related methods to PaginationHandler
    async goToNextPage() {
        // First dismiss any overlays that might interfere
        await this.cookieHandler.dismissOverlays();
        return await this.paginationHandler.goToNextPage();
    }

    async getCurrentPageNumber() {
        return await this.paginationHandler.getCurrentPageNumber();
    }

    async logPaginationInfo() {
        return await this.paginationHandler.logPaginationInfo();
    }

    getPage() {
        return this.page;
    }

    async close() {
        try {
            if (this.context) {
                await this.context.close();
                ErrorHandler.logInfo('Browser context closed');
            }
            if (this.browser) {
                await this.browser.close();
                ErrorHandler.logInfo('Browser closed');
            }
        } catch (error) {
            ErrorHandler.logError('Error closing browser', error);
        }
    }
}

module.exports = BrowserManager;
