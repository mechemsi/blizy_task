/**
 * Browser Configuration Module
 * Centralized configuration for browser settings and options
 */

class BrowserConfig {
    /**
     * Get browser launch arguments
     */
    static getBrowserArgs() {
        return [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-extensions',
            '--disable-gpu',
            '--no-first-run',
            '--no-zygote',
            '--single-process'
        ];
    }

    /**
     * Get browser context options
     */
    static getContextOptions() {
        return {
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        };
    }

    /**
     * Get browser launch options
     */
    static getLaunchOptions() {
        return {
            headless: true,
            args: this.getBrowserArgs()
        };
    }

    /**
     * Get navigation options
     */
    static getNavigationOptions() {
        return {
            waitUntil: 'networkidle',
            timeout: 30000
        };
    }

    /**
     * Get default timeouts
     */
    static getTimeouts() {
        return {
            navigation: 30000,
            element: 5000,
            network: 10000,
            retry: 1000
        };
    }
}

module.exports = BrowserConfig;
