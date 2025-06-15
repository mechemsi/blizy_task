# Build stage - install dependencies
FROM node:18-slim 

# Set environment variables
ENV NODE_ENV=development
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=false
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Install necessary packages for Playwright
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libxss1 \
    libgconf-2-4 \
    libxkbcommon0 \
    libxrandr2 \
    libasound2 \
    libpangocairo-1.0-0 \
    libatk1.0-0 \
    libcairo-gobject2 \
    libgtk-3-0 \
    libgdk-pixbuf2.0-0 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrender1 \
    libxtst6 \
    libcups2 \
    libdrm2 \
    libxss1 \
    libgbm1 \
    libnss3 \
    libnspr4 \
    libatk-bridge2.0-0 \
    libexpat1 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory and change ownership
WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package.json package-lock.json ./

# Install dependencies with clean npm cache
RUN npm install

# Install system dependencies for Playwright (needs root)
RUN npx playwright install-deps

# Install Playwright browsers with dependencies
RUN npx playwright install --with-deps

# Copy source code

# Change ownership to node user
RUN chown -R node:node /app

# Switch to node user for security  

COPY . .

# Make entrypoint script executable
RUN chmod +x entrypoint.sh

# Default command with 10-second delay
CMD ["sh", "-c", "echo 'Waiting 10 seconds for database to be ready...' && sleep 10 && node src/scraper.js"]
