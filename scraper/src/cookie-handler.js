class CookieHandler {
    constructor(page) {
        this.page = page;
    }

    async acceptCookies() {
        try {
            console.log('Checking for cookie banners...');
            
            const cookieSelectors = [
                // Vuetify specific cookie buttons
                '.v-btn:has-text("Accept")',
                '.v-btn:has-text("Akceptuj")',
                '.v-btn[aria-label*="accept" i]',
                '.v-btn[data-test*="cookie" i]',
                
                // Generic cookie selectors
                'button:has-text("Accept all")',
                'button:has-text("Accept")',
                'button:has-text("Akceptuj")',
                'button:has-text("Zgadzam się")',
                'button:has-text("OK")',
                '.cookie-accept',
                '.cookies-accept',
                '.accept-cookies',
                'button[class*="accept"]',
                '.btn-accept',
                '#cookieAccept',
                '.cookie-consent-accept',
                '[aria-label*="accept"]',
                '[aria-label*="cookie"]'
            ];
            
            for (const selector of cookieSelectors) {
                try {
                    const button = await this.page.$(selector);
                    if (button) {
                        const isVisible = await button.isVisible();
                        if (isVisible) {
                            await button.click();
                            await this.page.waitForTimeout(1000);
                            console.log(`Cookies accepted using selector: ${selector}`);
                            return;
                        }
                    }
                } catch (e) {
                    // Continue to next selector
                }
            }
            
            // Try to dismiss any overlay by clicking outside or pressing Escape
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(500);
            
            console.log('No cookie banner found or already accepted');
        } catch (e) {
            console.log('Error handling cookies:', e.message);
        }
    }

    async dismissOverlays() {
        try {
            // Remove cookie overlays and modals
            const overlaySelectors = [
                '.cookies-overlay',
                '.cookie-overlay',
                '.modal-backdrop',
                '.overlay',
                '.v-overlay',
                '.v-dialog__container',
                '[data-v-d80384bb=""].cookies-overlay',
                '.cookies-container'
            ];
            
            for (const selector of overlaySelectors) {
                try {
                    await this.page.evaluate((sel) => {
                        const elements = document.querySelectorAll(sel);
                        elements.forEach(el => el.remove());
                    }, selector);
                } catch (e) {
                    // Continue
                }
            }
            
            // Press Escape to close any modals
            await this.page.keyboard.press('Escape');
            await this.page.waitForTimeout(300);
            
        } catch (error) {
            console.log('Error dismissing overlays:', error.message);
        }
    }

    async handleCookiesAndOverlays() {
        await this.dismissOverlays();
        await this.acceptCookies();
    }
}

module.exports = CookieHandler;
