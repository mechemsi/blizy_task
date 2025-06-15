#!/bin/bash

# Startup script for the scraper container

echo "Starting Breezy Smartphone Scraper..."

# Wait a bit for the database to be ready
sleep 10

echo "Starting scraper application..."
exec "$@"
