/**
 * Performance Monitor Module
 * Tracks and logs performance metrics for the scraper
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            startTime: null,
            endTime: null,
            pagesProcessed: 0,
            productsScraped: 0,
            errors: 0,
            retries: 0,
            averagePageTime: 0,
            totalPageTime: 0
        };
        
        this.pageTimers = new Map();
        this.operationTimers = new Map();
    }

    /**
     * Start monitoring a scraping session
     */
    startSession() {
        this.metrics.startTime = Date.now();
        console.log(`[PERF] Scraping session started at ${new Date().toISOString()}`);
    }

    /**
     * End monitoring session and log summary
     */
    endSession() {
        this.metrics.endTime = Date.now();
        const duration = this.metrics.endTime - this.metrics.startTime;
        
        this.logSessionSummary(duration);
        return this.getSessionMetrics();
    }

    /**
     * Start timing a page processing
     */
    startPageTimer(pageNumber) {
        const timer = {
            pageNumber,
            startTime: Date.now(),
            productsFound: 0
        };
        
        this.pageTimers.set(pageNumber, timer);
        console.log(`[PERF] Started processing page ${pageNumber}`);
    }

    /**
     * End timing a page processing
     */
    endPageTimer(pageNumber, productsFound = 0) {
        const timer = this.pageTimers.get(pageNumber);
        if (!timer) {
            console.warn(`[PERF] No timer found for page ${pageNumber}`);
            return;
        }

        const endTime = Date.now();
        const duration = endTime - timer.startTime;
        
        timer.endTime = endTime;
        timer.duration = duration;
        timer.productsFound = productsFound;

        // Update metrics
        this.metrics.pagesProcessed++;
        this.metrics.productsScraped += productsFound;
        this.metrics.totalPageTime += duration;
        this.metrics.averagePageTime = this.metrics.totalPageTime / this.metrics.pagesProcessed;

        console.log(`[PERF] Page ${pageNumber} completed in ${this.formatDuration(duration)} - Found ${productsFound} products`);
        
        this.pageTimers.delete(pageNumber);
        return { pageNumber, duration, productsFound };
    }

    /**
     * Start timing an operation
     */
    startOperation(operationName) {
        this.operationTimers.set(operationName, Date.now());
    }

    /**
     * End timing an operation
     */
    endOperation(operationName) {
        const startTime = this.operationTimers.get(operationName);
        if (!startTime) {
            console.warn(`[PERF] No timer found for operation: ${operationName}`);
            return;
        }

        const duration = Date.now() - startTime;
        console.log(`[PERF] Operation '${operationName}' completed in ${this.formatDuration(duration)}`);
        
        this.operationTimers.delete(operationName);
        return duration;
    }

    /**
     * Record an error
     */
    recordError() {
        this.metrics.errors++;
    }

    /**
     * Record a retry
     */
    recordRetry() {
        this.metrics.retries++;
    }

    /**
     * Get current metrics
     */
    getCurrentMetrics() {
        const currentTime = Date.now();
        const elapsedTime = this.metrics.startTime ? currentTime - this.metrics.startTime : 0;
        
        return {
            ...this.metrics,
            elapsedTime,
            pagesPerMinute: this.metrics.pagesProcessed > 0 ? 
                (this.metrics.pagesProcessed / (elapsedTime / 60000)) : 0,
            productsPerMinute: this.metrics.productsScraped > 0 ? 
                (this.metrics.productsScraped / (elapsedTime / 60000)) : 0
        };
    }

    /**
     * Get session metrics summary
     */
    getSessionMetrics() {
        const totalDuration = this.metrics.endTime - this.metrics.startTime;
        
        return {
            totalDuration,
            totalDurationFormatted: this.formatDuration(totalDuration),
            pagesProcessed: this.metrics.pagesProcessed,
            productsScraped: this.metrics.productsScraped,
            errors: this.metrics.errors,
            retries: this.metrics.retries,
            averagePageTime: this.metrics.averagePageTime,
            averagePageTimeFormatted: this.formatDuration(this.metrics.averagePageTime),
            pagesPerMinute: totalDuration > 0 ? (this.metrics.pagesProcessed / (totalDuration / 60000)) : 0,
            productsPerMinute: totalDuration > 0 ? (this.metrics.productsScraped / (totalDuration / 60000)) : 0,
            successRate: this.metrics.pagesProcessed > 0 ? 
                ((this.metrics.pagesProcessed - this.metrics.errors) / this.metrics.pagesProcessed * 100) : 0
        };
    }

    /**
     * Log session summary
     */
    logSessionSummary(duration) {
        const metrics = this.getSessionMetrics();
        
        console.log('\n=== SCRAPING SESSION SUMMARY ===');
        console.log(`Total Duration: ${metrics.totalDurationFormatted}`);
        console.log(`Pages Processed: ${metrics.pagesProcessed}`);
        console.log(`Products Scraped: ${metrics.productsScraped}`);
        console.log(`Average Page Time: ${metrics.averagePageTimeFormatted}`);
        console.log(`Pages per Minute: ${metrics.pagesPerMinute.toFixed(2)}`);
        console.log(`Products per Minute: ${metrics.productsPerMinute.toFixed(2)}`);
        console.log(`Success Rate: ${metrics.successRate.toFixed(1)}%`);
        console.log(`Errors: ${metrics.errors}`);
        console.log(`Retries: ${metrics.retries}`);
        console.log('================================\n');
    }

    /**
     * Format duration in milliseconds to human readable format
     */
    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);

        if (hours > 0) {
            return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        } else if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        } else if (seconds > 0) {
            return `${seconds}s`;
        } else {
            return `${ms}ms`;
        }
    }

    /**
     * Log current status
     */
    logCurrentStatus() {
        const metrics = this.getCurrentMetrics();
        console.log(`[PERF] Status: ${metrics.pagesProcessed} pages, ${metrics.productsScraped} products, ` +
                   `${metrics.errors} errors, ${this.formatDuration(metrics.elapsedTime)} elapsed`);
    }

    /**
     * Reset all metrics
     */
    reset() {
        this.metrics = {
            startTime: null,
            endTime: null,
            pagesProcessed: 0,
            productsScraped: 0,
            errors: 0,
            retries: 0,
            averagePageTime: 0,
            totalPageTime: 0
        };
        
        this.pageTimers.clear();
        this.operationTimers.clear();
    }
}

module.exports = PerformanceMonitor;
