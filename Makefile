.PHONY: help install up down restart ps shell-frontend shell-backend shell-db logs clean test

# Colors
CYAN = \033[0;36m
GREEN = \033[0;32m
YELLOW = \033[0;33m
NC = \033[0m # No Color

help: ## Display this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

install: ## First time setup (copy env and build containers)
	@echo "$(YELLOW)Setting up environment...$(NC)"
	cp .env.dist .env
	@echo "$(YELLOW)Building containers...$(NC)"
	docker compose build
	@echo "$(GREEN)Installation complete!$(NC)"

up: ## Start all containers
	docker compose up -d

down: ## Stop all containers
	docker compose down

frontend.connect: ## Open frontend container shell
	docker compose exec frontend zsh

backend.connect: ## Open backend container shell
	docker compose exec backend zsh

database.connect: ## Open PostgreSQL shell
	docker compose exec database psql -U ohdit ohdit_dev

reset: env='dev'
reset: ## Reset database (env=dev|test)
	docker compose exec backend bin/console postgres:close-connections --env=$(env)
	docker compose exec backend bin/console doctrine:database:drop --force --if-exists --env=$(env)
	docker compose exec backend bin/console doctrine:database:create --env=$(env)
	docker compose exec backend bin/console doctrine:migrations:migrate --no-interaction --env=$(env)
	docker compose exec backend bin/console doctrine:fixtures:load --no-interaction --env=$(env)

destroy-docker: ## Remove all containers and volumes
	@echo "$(YELLOW)Removing all containers and volumes...$(NC)"
	docker compose down -v --remove-orphans
	@echo "$(GREEN)Cleanup complete!$(NC)" 