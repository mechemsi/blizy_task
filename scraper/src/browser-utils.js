class BrowserUtils {
    constructor(page) {
        this.page = page;
    }

    /**
     * Wait for an element to be visible and stable
     */
    async waitForElement(selector, timeout = 5000) {
        try {
            await this.page.waitForSelector(selector, { 
                state: 'visible', 
                timeout 
            });
            return await this.page.$(selector);
        } catch (error) {
            console.log(`Element not found: ${selector}`);
            return null;
        }
    }

    /**
     * Wait for multiple elements and return the first one found
     */
    async waitForAnyElement(selectors, timeout = 5000) {
        const promises = selectors.map(selector => 
            this.waitForElement(selector, timeout)
        );
        
        try {
            const results = await Promise.allSettled(promises);
            for (const result of results) {
                if (result.status === 'fulfilled' && result.value) {
                    return result.value;
                }
            }
            return null;
        } catch (error) {
            console.log('No elements found from selectors:', selectors);
            return null;
        }
    }

    /**
     * Safely click an element with retry logic
     */
    async safeClick(element, options = {}) {
        const { 
            timeout = 5000, 
            retries = 3, 
            waitAfterClick = 500 
        } = options;

        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                // Ensure element is visible and in viewport
                await element.scrollIntoViewIfNeeded();
                await this.page.waitForTimeout(200);

                // Try to click
                await element.click({ timeout });
                await this.page.waitForTimeout(waitAfterClick);
                
                console.log(`Successfully clicked element on attempt ${attempt}`);
                return true;
            } catch (error) {
                console.log(`Click attempt ${attempt} failed: ${error.message}`);
                
                if (attempt === retries) {
                    console.log('All click attempts failed');
                    return false;
                }
                
                // Wait before retry
                await this.page.waitForTimeout(1000);
            }
        }
        return false;
    }

    /**
     * Check if element is actually clickable
     */
    async isElementClickable(element) {
        try {
            const isVisible = await element.isVisible();
            const isEnabled = await element.isEnabled();
            const ariaDisabled = await element.getAttribute('aria-disabled');
            const isDisabled = await element.evaluate(el => 
                el.disabled || 
                el.classList.contains('disabled') ||
                el.getAttribute('aria-disabled') === 'true'
            );

            return isVisible && isEnabled && ariaDisabled !== 'true' && !isDisabled;
        } catch (error) {
            return false;
        }
    }

    /**
     * Wait for network to be idle
     */
    async waitForNetworkIdle(timeout = 10000) {
        try {
            await this.page.waitForLoadState('networkidle', { timeout });
            return true;
        } catch (error) {
            console.log('Network idle timeout');
            return false;
        }
    }

    /**
     * Take a screenshot for debugging
     */
    async takeDebugScreenshot(name = 'debug') {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `${name}-${timestamp}.png`;
            await this.page.screenshot({ 
                path: `/tmp/${filename}`,
                fullPage: true 
            });
            console.log(`Debug screenshot saved: ${filename}`);
            return filename;
        } catch (error) {
            console.log('Failed to take screenshot:', error.message);
            return null;
        }
    }

    /**
     * Extract text content from multiple elements
     */
    async extractTextFromElements(selector) {
        try {
            return await this.page.$$eval(selector, elements => 
                elements.map(el => el.textContent?.trim()).filter(text => text)
            );
        } catch (error) {
            console.log(`Failed to extract text from ${selector}:`, error.message);
            return [];
        }
    }

    /**
     * Monitor network requests matching a pattern
     */
    async monitorNetworkRequests(urlPattern, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                this.page.off('response', responseHandler);
                reject(new Error('Network monitoring timeout'));
            }, timeout);

            const responseHandler = (response) => {
                if (response.url().includes(urlPattern)) {
                    clearTimeout(timer);
                    this.page.off('response', responseHandler);
                    resolve(response);
                }
            };

            this.page.on('response', responseHandler);
        });
    }
}

module.exports = BrowserUtils;
