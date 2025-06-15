# Development stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies including @nuxt/ui and @nuxtjs/color-mode
COPY package*.json ./
RUN npm install && npm cache clean --force

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Set environment to development
ENV NODE_ENV=development
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

# Create entrypoint script to fix permissions and start the app
RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'chown -R node:node /app' >> /entrypoint.sh && \
    echo 'su-exec node npm run dev -- --host 0.0.0.0' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

# Install su-exec for user switching
RUN apk add --no-cache su-exec

# Start the application
CMD ["/entrypoint.sh"]
