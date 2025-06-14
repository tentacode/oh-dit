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

restart: ## Restart all containers
	docker compose restart

ps: ## Show container status
	docker compose ps

shell-frontend: ## Open frontend container shell
	docker compose exec frontend zsh

shell-backend: ## Open backend container shell
	docker compose exec backend zsh

shell-db: ## Open PostgreSQL shell
	docker compose exec database psql -U ohdit ohdit_dev

logs: ## View container logs
	docker compose logs -f

cc: ## Clear cache
	docker compose exec backend bin/console cache:clear
	docker compose exec backend bin/console cache:clear --env=test

test: ## Run PHPUnit tests
	docker compose exec backend bin/phpunit

clean: ## Remove all containers and volumes
	@echo "$(YELLOW)Removing all containers and volumes...$(NC)"
	docker compose down -v --remove-orphans
	@echo "$(GREEN)Cleanup complete!$(NC)" 