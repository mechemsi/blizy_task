/**
 * Scraper Constants
 * Centralized constants for the web scraper
 */

module.exports = {
    // URLs
    URLS: {
        BASE_URL: 'https://breezy.pl',
        SMARTPHONES_URL: 'https://breezy.pl/telefony-gsm/'
    },

    // Selectors
    SELECTORS: {
        // Product selectors
        PRODUCT_CARDS: 'div[data-testid="product-card"]',
        PRODUCT_TITLE: '[data-testid="product-title"]',
        PRODUCT_PRICE: '[data-testid="product-price"]',
        PRODUCT_LINK: 'a[href*="/p/"]',
        PRODUCT_COLOR: '[data-testid="color-variant"], .color-variant, .product-color',
        
        // Pagination selectors
        PAGINATION_NEXT: [
            'button[aria-label*="next" i]',
            'button[title*="next" i]',
            'button:has(.v-icon.mdi-chevron-right)',
            '.v-pagination__next:not(.v-pagination__next--disabled)',
            '[data-testid="pagination-next"]'
        ],
        PAGINATION_CURRENT: '.v-pagination__current, .v-pagination .v-btn--active',
        PAGINATION_CONTAINER: '.v-pagination, .pagination',
        
        // Cookie and overlay selectors
        COOKIE_BANNER: [
            '#cookie-banner',
            '.cookie-consent',
            '[data-testid="cookie-banner"]',
            '.gdpr-banner'
        ],
        COOKIE_ACCEPT: [
            'button:has-text("Accept")',
            'button:has-text("Akceptuj")',
            'button[data-testid="accept-cookies"]',
            '.cookie-accept'
        ],
        OVERLAY_CLOSE: [
            'button[aria-label*="close" i]',
            'button[title*="close" i]',
            '.v-dialog__close',
            '.modal-close'
        ]
    },

    // Timeouts (in milliseconds)
    TIMEOUTS: {
        NAVIGATION: 30000,
        ELEMENT_WAIT: 5000,
        NETWORK_IDLE: 10000,
        RETRY_DELAY: 2000,
        CLICK_DELAY: 500,
        PAGINATION_WAIT: 3000
    },

    // Retry settings
    RETRY: {
        MAX_RETRIES: 3,
        NAVIGATION_RETRIES: 3,
        CLICK_RETRIES: 3,
        ELEMENT_RETRIES: 2
    },

    // Database settings
    DATABASE: {
        BATCH_SIZE: 50,
        MAX_CONNECTIONS: 10,
        CONNECTION_TIMEOUT: 60000
    },

    // Scraping settings
    SCRAPING: {
        MAX_PAGES: 100,
        CONCURRENT_PRODUCTS: 5,
        MIN_PRODUCTS_PER_PAGE: 1,
        MAX_EMPTY_PAGES: 3
    },

    // Product validation
    VALIDATION: {
        MIN_TITLE_LENGTH: 5,
        MAX_TITLE_LENGTH: 200,
        MIN_PRICE: 0.01,
        MAX_PRICE: 50000,
        REQUIRED_FIELDS: ['title', 'price', 'product_code']
    },

    // Error types
    ERROR_TYPES: {
        NAVIGATION: 'NavigationError',
        ELEMENT_NOT_FOUND: 'ElementNotFoundError',
        TIMEOUT: 'TimeoutError',
        NETWORK: 'NetworkError',
        PARSING: 'ParsingError',
        DATABASE: 'DatabaseError',
        VALIDATION: 'ValidationError'
    },

    // Log levels
    LOG_LEVELS: {
        ERROR: 'ERROR',
        WARN: 'WARN',
        INFO: 'INFO',
        DEBUG: 'DEBUG'
    },

    // Performance thresholds
    PERFORMANCE: {
        MAX_PAGE_TIME: 60000, // 1 minute
        WARNING_PAGE_TIME: 30000, // 30 seconds
        MIN_SUCCESS_RATE: 90, // 90%
        STATUS_LOG_INTERVAL: 10 // Every 10 pages
    }
};
