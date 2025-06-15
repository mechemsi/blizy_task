include api/.env
include .env

ifndef INSIDE_DOCKER_CONTAINER
	INSIDE_DOCKER_CONTAINER = 0
endif

HOST_UID := $(shell id -u)
HOST_GID := $(shell id -g)
PHP_USER := -u www-data
PROJECT_NAME := -p ${COMPOSE_PROJECT_NAME}
OPENSSL_BIN := $(shell which openssl)
INTERACTIVE := $(shell [ -t 0 ] && echo 1)
ERROR_ONLY_FOR_HOST = @printf "\033[33mThis command for host machine\033[39m\n"
.DEFAULT_GOAL := help

install:
	@make build
	docker-compose up -d nginx mysql symfony
	@make composer-install
	@make exec-bash cmd="php bin/console doctrine:database:create --if-not-exists"
	@make exec-bash cmd="php bin/console doctrine:schema:update --force"
	@make start

build: ## Build dev environment
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) WEB_PORT_HTTP=$(WEB_PORT_HTTP) WEB_PORT_SSL=$(WEB_PORT_SSL) XDEBUG_CONFIG=$(XDEBUG_CONFIG) XDEBUG_VERSION=$(XDEBUG_VERSION) MYSQL_VERSION=$(MYSQL_VERSION) MYSQL_ROOT_PASSWORD=$(MYSQL_ROOT_PASSWORD) MYSQL_PORT=$(MYSQL_PORT) docker compose -f docker-compose.yaml build

start: ## Start dev environment
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) WEB_PORT_HTTP=$(WEB_PORT_HTTP) WEB_PORT_SSL=$(WEB_PORT_SSL) XDEBUG_CONFIG=$(XDEBUG_CONFIG) XDEBUG_VERSION=$(XDEBUG_VERSION) MYSQL_VERSION=$(MYSQL_VERSION) MYSQL_ROOT_PASSWORD=$(MYSQL_ROOT_PASSWORD) MYSQL_PORT=$(MYSQL_PORT) docker compose -f docker-compose.yaml $(PROJECT_NAME) up -d

stop: ## Stop dev environment containers
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) WEB_PORT_HTTP=$(WEB_PORT_HTTP) WEB_PORT_SSL=$(WEB_PORT_SSL) XDEBUG_CONFIG=$(XDEBUG_CONFIG) XDEBUG_VERSION=$(XDEBUG_VERSION) MYSQL_VERSION=$(MYSQL_VERSION) MYSQL_ROOT_PASSWORD=$(MYSQL_ROOT_PASSWORD) MYSQL_PORT=$(MYSQL_PORT)  docker compose -f compose.yaml $(PROJECT_NAME) stop

down: ## Stop and remove dev environment containers, networks
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) WEB_PORT_HTTP=$(WEB_PORT_HTTP) WEB_PORT_SSL=$(WEB_PORT_SSL) XDEBUG_CONFIG=$(XDEBUG_CONFIG) XDEBUG_VERSION=$(XDEBUG_VERSION) MYSQL_VERSION=$(MYSQL_VERSION) MYSQL_ROOT_PASSWORD=$(MYSQL_ROOT_PASSWORD) MYSQL_PORT=$(MYSQL_PORT)  docker compose -f docker-compose.yaml $(PROJECT_NAME) down

restart: stop start ## Stop and start dev environment

ssh: ## Get bash inside symfony docker container
	@HOST_UID=$(HOST_UID) HOST_GID=$(HOST_GID) WEB_PORT_HTTP=$(WEB_PORT_HTTP) WEB_PORT_SSL=$(WEB_PORT_SSL) XDEBUG_CONFIG=$(XDEBUG_CONFIG) XDEBUG_VERSION=$(XDEBUG_VERSION) MYSQL_VERSION=$(MYSQL_VERSION) MYSQL_ROOT_PASSWORD=$(MYSQL_ROOT_PASSWORD) MYSQL_PORT=$(MYSQL_PORT)  docker compose $(PROJECT_NAME) exec $(OPTION_T) $(PHP_USER) symfony bash

composer-install: ## Installs composer dependencies
	@make exec-bash cmd="COMPOSER_MEMORY_LIMIT=-1 composer install --optimize-autoloader"

exec-bash:
	docker compose $(PROJECT_NAME) exec $(OPTION_T) $(PHP_USER) symfony bash -c "$(cmd)"

## Run scraper one time
scraper:
	docker-compose run --rm scraper npm start