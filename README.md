# Blizy Smartphone Data Platform

A comprehensive platform for scraping, storing, and visualizing smartphone data from Breezy.pl. The platform consists of a Symfony API backend, a Node.js scraper, and a Nuxt.js frontend.

## Setup

### Prerequisites
- Docker & Docker Compose
- Make

### Installation

1. Clone the repository and navigate to the project directory:
```bash
git clone <repository>
cd blizy
```

2. Install and set up the project:
```bash
make install
```

This command will:
- Set up the environment
- Build Docker containers
- Initialize the database
- Install all dependencies

## Usage

### Starting the Project

1. Start all services (API, Web, Database, and Scraper):
```bash
make start
```

This will start:
- API at http://localhost
- Web interface at http://localhost:3000
- Database
- Scraper (automatically starts scheduled scraping)

### Accessing Services

- **Web Frontend**: http://localhost:3000
- **API**: http://localhost
- **API Documentation**: http://localhost/api/doc

### Manual Scraper Control

To trigger the scraper manually:

```bash
make scraper
```

Note: When starting the project with `make start`, the scraper automatically begins its scheduled scraping process. Manual triggering is only needed for development or testing purposes.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Nuxt.js Web   │────│   Symfony API   │────│   MariaDB DB    │
│   Frontend      │    │   (REST API)    │    │   (Storage)     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                │
                       ┌─────────────────┐
                       │                 │
                       │   Node.js       │
                       │   Scraper       │
                       │   (Playwright)  │
                       │                 │
                       └─────────────────┘
```

## Components

### 🌐 Web Frontend (`/web`)
- **Technology**: Nuxt.js 3 with TypeScript
- **Features**: Responsive UI, advanced filtering, pagination, real-time data
- **Port**: 3000
- **API Integration**: Connects to Symfony REST API

### 🚀 API Backend (`/api`)
- **Technology**: Symfony 7 with API Platform
- **Features**: REST API, filtering, pagination, CORS support
- **Port**: 80 (via Nginx)
- **Database**: MariaDB with Doctrine ORM

### 🕷️ Data Scraper (`/scraper`)
- **Technology**: Node.js with Playwright
- **Features**: Automated scraping, error handling, scheduling
- **Target**: Breezy.pl smartphone listings
- **Database**: Direct MariaDB connection

### 🗄️ Database
- **Technology**: MariaDB 11.5
- **Port**: 33061
- **Features**: Optimized for smartphone data, indexes, duplicate handling

## Available Make Commands

### Main Commands
- `make install` - Initial setup and installation
- `make start` - Start all services
- `make stop` - Stop all services
- `make restart` - Restart all services
- `make scraper` - Manually trigger scraping

## Environment Variables

Key environment variables (see `.env` file):

```bash
# Ports
WEB_PORT_HTTP=80
WEB_PORT_SSL=443
WEB_FRONTEND_PORT=3000
MYSQL_PORT=33061

# Database
MYSQL_ROOT_PASSWORD=secret

# Scraper
SCRAPER_INTERVAL=3600000  # 1 hour
SCRAPER_MAX_PAGES=5
SCRAPER_DELAY=2000

# CORS
CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'
```

## API Endpoints

The Symfony API provides the following endpoints:

- `GET /api/smartphones` - List smartphones with filtering and pagination
- `GET /api/smartphones/{id}` - Get specific smartphone
- `GET /api/smartphones/filter-metadata` - Get filter options
- `GET /api/smartphones/stats` - Get statistics
- `GET /api/smartphones/brands` - Get available brands

### Example API Usage

```bash
# Get smartphones with filters
curl "http://localhost/api/smartphones?brand=Apple&limit=10&offset=0"

# Get filter metadata
curl "http://localhost/api/smartphones/filter-metadata"

# Get statistics
curl "http://localhost/api/smartphones/stats"
```

## Database Schema

The main table `breezy_smartphones` stores:
- Product information (brand, model, storage, etc.)
- Pricing and availability
- URLs and images
- Scraping metadata
- Timestamps

## Features

### Web Frontend
- 📱 Responsive design (mobile, tablet, desktop)
- 🔍 Advanced search and filtering
- 📊 Statistics dashboard
- 📄 Pagination with page jumping
- 🎨 Clean, modern UI with Tailwind CSS
- ⚡ Real-time data updates

### API
- 🚀 High-performance REST API
- 🔐 CORS-enabled for cross-origin requests
- 📖 Auto-generated API documentation
- 🔍 Advanced filtering and searching
- 📄 Pagination support
- 📊 Statistics endpoints

### Scraper
- 🤖 Automated scheduled scraping
- 🔄 Error handling and retries
- 📈 Performance monitoring
- 🛡️ Anti-detection measures
- 📊 Detailed logging

## Contributing

1. Follow the established coding standards
2. Write tests for new features
3. Update documentation as needed
4. Use meaningful commit messages

## License

This project is licensed under the MIT License.
