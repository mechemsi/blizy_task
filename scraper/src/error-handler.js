/**
 * Error Handler Module
 * Centralized error handling and logging for the scraper
 */

class ErrorHandler {
    /**
     * Log an error with context
     */
    static logError(message, error, context = {}) {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] ERROR: ${message}`);
        
        if (error) {
            console.error('Error details:', error.message);
            if (error.stack) {
                console.error('Stack trace:', error.stack);
            }
        }
        
        if (Object.keys(context).length > 0) {
            console.error('Context:', context);
        }
    }

    /**
     * Log a warning with context
     */
    static logWarning(message, context = {}) {
        const timestamp = new Date().toISOString();
        console.warn(`[${timestamp}] WARNING: ${message}`);
        
        if (Object.keys(context).length > 0) {
            console.warn('Context:', context);
        }
    }

    /**
     * Log info with context
     */
    static logInfo(message, context = {}) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] INFO: ${message}`);
        
        if (Object.keys(context).length > 0) {
            console.log('Context:', context);
        }
    }

    /**
     * Log debug information
     */
    static logDebug(message, data = null) {
        if (process.env.DEBUG) {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] DEBUG: ${message}`);
            
            if (data) {
                console.log('Debug data:', data);
            }
        }
    }

    /**
     * Handle scraping errors with retry logic
     */
    static async handleScrapingError(error, operation, retryCount = 0, maxRetries = 3) {
        const errorContext = {
            operation,
            retryCount,
            maxRetries
        };

        this.logError(`Scraping operation failed: ${operation}`, error, errorContext);

        if (retryCount < maxRetries) {
            this.logInfo(`Retrying operation: ${operation} (attempt ${retryCount + 1}/${maxRetries})`);
            return true; // Should retry
        } else {
            this.logError(`Max retries reached for operation: ${operation}`, null, errorContext);
            return false; // Should not retry
        }
    }

    /**
     * Create a standardized error object
     */
    static createError(message, type = 'ScrapingError', details = {}) {
        const error = new Error(message);
        error.name = type;
        error.details = details;
        error.timestamp = new Date().toISOString();
        
        return error;
    }

    /**
     * Handle browser-related errors
     */
    static handleBrowserError(error, operation) {
        const browserErrorTypes = {
            'TimeoutError': 'Browser operation timed out',
            'Navigation': 'Page navigation failed',
            'ElementNotFound': 'Required element not found',
            'NetworkError': 'Network request failed'
        };

        const errorType = this.detectErrorType(error);
        const message = browserErrorTypes[errorType] || 'Unknown browser error';

        this.logError(message, error, { operation, errorType });
        
        return {
            type: errorType,
            message,
            shouldRetry: this.shouldRetryError(errorType)
        };
    }

    /**
     * Detect error type from error message/name
     */
    static detectErrorType(error) {
        if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
            return 'TimeoutError';
        }
        if (error.message.includes('navigation') || error.message.includes('goto')) {
            return 'Navigation';
        }
        if (error.message.includes('element') || error.message.includes('selector')) {
            return 'ElementNotFound';
        }
        if (error.message.includes('network') || error.message.includes('ERR_')) {
            return 'NetworkError';
        }
        return 'Unknown';
    }

    /**
     * Determine if an error type should be retried
     */
    static shouldRetryError(errorType) {
        const retryableErrors = ['TimeoutError', 'NetworkError', 'Navigation'];
        return retryableErrors.includes(errorType);
    }

    /**
     * Format error for database logging
     */
    static formatErrorForDB(error, operation, url = null) {
        return {
            timestamp: new Date(),
            operation,
            error_type: error.name || 'Unknown',
            error_message: error.message,
            url,
            stack_trace: error.stack || null,
            details: JSON.stringify(error.details || {})
        };
    }
}

module.exports = ErrorHandler;
