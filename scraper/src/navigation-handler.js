/**
 * Navigation Handler Module
 * Handles page navigation and related operations
 */

const BrowserConfig = require('./browser-config');

class NavigationHandler {
    constructor(page) {
        this.page = page;
    }

    /**
     * Navigate to a URL with error handling and retry logic
     */
    async navigateToUrl(url, options = {}) {
        const {
            retries = 3,
            retryDelay = 2000,
            ...navigationOptions
        } = options;

        const finalOptions = {
            ...BrowserConfig.getNavigationOptions(),
            ...navigationOptions
        };

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                console.log(`[Attempt ${attempt}] Navigating to: ${url}`);
                
                await this.page.goto(url, finalOptions);
                
                console.log('Page loaded successfully');
                return true;
            } catch (error) {
                console.error(`Navigation attempt ${attempt} failed:`, error.message);
                
                if (attempt === retries) {
                    console.error('All navigation attempts failed');
                    throw error;
                }
                
                console.log(`Retrying in ${retryDelay}ms...`);
                await this.page.waitForTimeout(retryDelay);
            }
        }
        
        return false;
    }

    /**
     * Wait for page to be ready
     */
    async waitForPageReady(timeout = 10000) {
        try {
            await this.page.waitForLoadState('domcontentloaded', { timeout });
            await this.page.waitForLoadState('networkidle', { timeout: timeout / 2 });
            console.log('Page is ready');
            return true;
        } catch (error) {
            console.log('Page ready timeout:', error.message);
            return false;
        }
    }

    /**
     * Refresh the current page
     */
    async refreshPage() {
        try {
            console.log('Refreshing page...');
            await this.page.reload(BrowserConfig.getNavigationOptions());
            console.log('Page refreshed successfully');
            return true;
        } catch (error) {
            console.error('Page refresh failed:', error);
            return false;
        }
    }

    /**
     * Get current URL
     */
    getCurrentUrl() {
        return this.page.url();
    }

    /**
     * Check if page is loaded
     */
    async isPageLoaded() {
        try {
            const readyState = await this.page.evaluate(() => document.readyState);
            return readyState === 'complete';
        } catch (error) {
            console.log('Failed to check page load state:', error.message);
            return false;
        }
    }

    /**
     * Navigate back in browser history
     */
    async goBack() {
        try {
            console.log('Navigating back...');
            await this.page.goBack(BrowserConfig.getNavigationOptions());
            console.log('Navigated back successfully');
            return true;
        } catch (error) {
            console.error('Navigation back failed:', error);
            return false;
        }
    }

    /**
     * Navigate forward in browser history
     */
    async goForward() {
        try {
            console.log('Navigating forward...');
            await this.page.goForward(BrowserConfig.getNavigationOptions());
            console.log('Navigated forward successfully');
            return true;
        } catch (error) {
            console.error('Navigation forward failed:', error);
            return false;
        }
    }
}

module.exports = NavigationHandler;
