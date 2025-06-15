const BrowserUtils = require('./browser-utils');

class PaginationHandler {
    constructor(page) {
        this.page = page;
        this.browserUtils = new BrowserUtils(page);
    }

    async getCurrentPageNumber() {
        try {
            // Try to find current page indicator in Vuetify pagination
            const vuetifySelectors = [
                '.v-pagination__item--is-active .v-btn',
                '.v-pagination .v-btn--active',
                '.v-pagination [aria-current="page"]'
            ];
            
            for (const selector of vuetifySelectors) {
                try {
                    const element = await this.page.$(selector);
                    if (element) {
                        const text = await element.textContent();
                        const pageNum = parseInt(text.trim());
                        if (!isNaN(pageNum)) {
                            console.log(`Current page detected: ${pageNum} using selector: ${selector}`);
                            return pageNum;
                        }
                    }
                } catch (e) {
                    continue;
                }
            }
            
            // Fallback to generic pagination selectors
            const genericSelectors = [
                '.pagination .current',
                '.pagination .active',
                '[aria-current="page"]',
                '.page-current'
            ];
            
            for (const selector of genericSelectors) {
                const element = await this.page.$(selector);
                if (element) {
                    const text = await element.textContent();
                    const pageNum = parseInt(text?.trim() || '1');
                    if (!isNaN(pageNum)) {
                        return pageNum;
                    }
                }
            }
            
            // Try to extract from URL
            const url = this.page.url();
            const pageMatch = url.match(/[?&]page[=\/](\d+)/i);
            if (pageMatch) {
                const pageNum = parseInt(pageMatch[1]);
                console.log(`Current page from URL: ${pageNum}`);
                return pageNum;
            }
            
            // Default to page 1
            console.log('Could not detect current page, defaulting to 1');
            return 1;
        } catch (error) {
            console.log('Error getting current page number:', error.message);
            return 1;
        }
    }

    async logPaginationInfo() {
        try {
            console.log('=== PAGINATION DEBUG INFO ===');
            
            // Log current URL
            console.log(`Current URL: ${this.page.url()}`);
            
            // Log Vuetify pagination elements
            const vuetifyElements = await this.page.$$('.v-pagination *, [class*="v-pagination"]');
            console.log(`Found ${vuetifyElements.length} Vuetify pagination elements`);
            
            for (let i = 0; i < Math.min(vuetifyElements.length, 10); i++) {
                const element = vuetifyElements[i];
                const tagName = await element.evaluate(el => el.tagName);
                const className = await element.getAttribute('class');
                const text = await element.textContent();
                const ariaLabel = await element.getAttribute('aria-label');
                const ariaDisabled = await element.getAttribute('aria-disabled');
                const isVisible = await element.isVisible();
                
                console.log(`Element ${i}: ${tagName} class="${className}" text="${text?.trim()}" aria-label="${ariaLabel}" aria-disabled="${ariaDisabled}" visible=${isVisible}`);
            }
            
            // Log current page
            const currentPage = await this.getCurrentPageNumber();
            console.log(`Detected current page: ${currentPage}`);
            
            console.log('=== END PAGINATION DEBUG ===');
        } catch (error) {
            console.log('Error in pagination debug:', error.message);
        }
    }

    async goToNextPage() {
        try {
            console.log('Looking for next page button...');
            
            // Wait for page to be ready
            await this.page.waitForTimeout(1000);
            
            // Store current state for comparison
            const currentUrl = this.page.url();
            const currentProductCount = await this.page.$$eval('[href*="/product/"], a[href*="/p/"]', elements => elements.length).catch(() => 0);
            console.log(`Current state - URL: ${currentUrl}, Products: ${currentProductCount}`);
            
            // Vuetify-specific pagination selectors (most specific first)
            const vuetifySelectors = [
                '.v-pagination__next button:not([aria-disabled="true"])',
                '.v-pagination__next .v-btn:not([aria-disabled="true"])',
                '.v-pagination .v-pagination__next button',
                'li.v-pagination__next button:not([disabled])',
                '[data-test="v-pagination-next"] button:not([aria-disabled="true"])'
            ];
            
            // Generic pagination selectors as fallback
            const genericSelectors = [
                '.pagination .page-item:not(.disabled) .page-link[aria-label*="Next" i]',
                '.pagination .page-item:not(.disabled) .page-link[aria-label*="next" i]',
                '.pagination a[aria-label*="Next" i]:not(.disabled)',
                '.pagination button[aria-label*="Next" i]:not(.disabled)',
                '.pagination .next:not(.disabled)',
                '.pagination a[rel="next"]:not(.disabled)',
                'a:has-text("Next"):not(.disabled)',
                'button:has-text("Next"):not(.disabled)',
                'a:has-text(">"):not(.disabled)',
                'button:has-text(">"):not(.disabled)',
                '.page-next:not(.disabled)',
                '.next-page:not(.disabled)',
                'a.next:not(.disabled)',
                'button.next:not(.disabled)',
                '[data-testid*="next"]:not(.disabled)',
                '[data-cy*="next"]:not(.disabled)'
            ];
            
            const allSelectors = [...vuetifySelectors, ...genericSelectors];
            let nextButton = null;
            let foundSelector = null;
            
            for (const selector of allSelectors) {
                try {
                    const elements = await this.page.$$(selector);
                    
                    for (const element of elements) {
                        const isClickable = await this.browserUtils.isElementClickable(element);
                        const text = await element.textContent();
                        const className = await element.getAttribute('class');
                        
                        console.log(`Checking element with selector "${selector}": clickable=${isClickable}, text="${text?.trim()}", class="${className}"`);
                        
                        if (isClickable) {
                            console.log(`Found valid next page button: "${text}" with selector: ${selector}`);
                            nextButton = element;
                            foundSelector = selector;
                            break;
                        }
                    }
                    if (nextButton) break;
                } catch (selectorError) {
                    console.log(`Selector "${selector}" failed:`, selectorError.message);
                    continue;
                }
            }
            
            // If no standard pagination found, try numeric pagination
            if (!nextButton) {
                console.log('No "Next" button found, looking for numeric pagination...');
                const currentPageNum = await this.getCurrentPageNumber();
                const nextPageNum = currentPageNum + 1;
                console.log(`Looking for page ${nextPageNum} (current: ${currentPageNum})`);
                
                const numericSelectors = [
                    `.v-pagination .v-btn:has-text("${nextPageNum}"):not([aria-disabled="true"])`,
                    `a[href*="page=${nextPageNum}"]:not(.disabled)`,
                    `button[data-page="${nextPageNum}"]:not(.disabled)`,
                    `a:has-text("${nextPageNum}"):not(.disabled)`,
                    `.pagination a:has-text("${nextPageNum}"):not(.disabled)`,
                    `.pagination button:has-text("${nextPageNum}"):not(.disabled)`,
                    `[data-page="${nextPageNum}"]:not(.disabled)`
                ];
                
                for (const selector of numericSelectors) {
                    try {
                        const element = await this.page.$(selector);
                        if (element) {
                            const isVisible = await element.isVisible();
                            const isEnabled = await element.evaluate(el => !el.disabled);
                            if (isVisible && isEnabled) {
                                console.log(`Found numeric page link: ${nextPageNum} with selector: ${selector}`);
                                nextButton = element;
                                foundSelector = selector;
                                break;
                            }
                        }
                    } catch (e) {
                        continue;
                    }
                }
            }
            
            if (!nextButton) {
                console.log('No next page button found');
                return false;
            }

            console.log(`Using next button with selector: ${foundSelector}`);
            
            // Scroll the button into view and click safely
            await nextButton.scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(500);

            // Set up network monitoring for AJAX requests
            let ajaxResponseReceived = false;
            const networkListener = (response) => {
                const url = response.url();
                if (url.includes('api') || url.includes('ajax') || url.includes('json') || 
                    response.request().method() === 'POST' || response.request().method() === 'PUT') {
                    console.log(`AJAX response detected: ${url}`);
                    ajaxResponseReceived = true;
                }
            };
            
            this.page.on('response', networkListener);

            try {
                console.log('Clicking next page button...');
                
                // Use safe click from browser utils
                const clickSuccess = await this.browserUtils.safeClick(nextButton, {
                    timeout: 5000,
                    retries: 2,
                    waitAfterClick: 1000
                });

                if (!clickSuccess) {
                    console.log('Failed to click next page button');
                    return false;
                }
                
                // Wait for either AJAX response or content change
                console.log('Waiting for content to update...');
                
                let contentChanged = false;
                for (let i = 0; i < 15; i++) { // Wait up to 15 seconds
                    await this.page.waitForTimeout(1000);
                    
                    const newUrl = this.page.url();
                    const newProductCount = await this.page.$$eval('[href*="/product/"], a[href*="/p/"]', elements => elements.length).catch(() => 0);
                    
                    if (newUrl !== currentUrl || newProductCount !== currentProductCount || ajaxResponseReceived) {
                        contentChanged = true;
                        console.log(`Content changed - URL: ${newUrl}, Products: ${newProductCount}, AJAX: ${ajaxResponseReceived}`);
                        break;
                    }
                    
                    if (i % 3 === 0) {
                        console.log(`Waiting for content change... attempt ${i + 1}/15`);
                    }
                }
                
                // Additional wait for content to fully load
                if (contentChanged) {
                    await this.page.waitForTimeout(3000);
                    console.log('Successfully navigated to next page');
                    return true;
                } else {
                    console.log('No content change detected after clicking next page');
                    return false;
                }
                
            } finally {
                this.page.off('response', networkListener);
            }
            
        } catch (error) {
            console.log('Error in pagination:', error.message);
            return false;
        }
    }
}

module.exports = PaginationHandler;
