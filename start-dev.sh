#!/bin/bash

# Development start script for Blizy platform
set -e

echo "🚀 Starting Blizy Platform in Development Mode..."

# Start core services (database, API)
echo "🗄️ Starting database and API services..."
docker-compose up -d mysql symfony nginx

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if we need to run migrations
echo "🔄 Checking database migrations..."
docker-compose exec symfony php bin/console doctrine:migrations:migrate --no-interaction --dry-run --quiet || {
    echo "📋 Running database migrations..."
    docker-compose exec symfony php bin/console doctrine:migrations:migrate --no-interaction
}

# Start scraper in background
echo "🕷️ Starting scraper..."
docker-compose up -d scraper

# Start web frontend
echo "🌐 Starting web frontend..."
docker-compose up -d web

echo "✅ Platform started successfully!"
echo ""
echo "Services running:"
echo "  🌐 Web Frontend: http://localhost:3000"
echo "  📚 API Documentation: http://localhost/api/doc"
echo "  🕷️ Scraper: Running in background"
echo "  🗄️ Database: localhost:33061"
echo ""
echo "To view logs:"
echo "  docker-compose logs -f [service-name]"
echo ""
echo "To stop all services:"
echo "  docker-compose down"
