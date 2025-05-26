.PHONY: help install up down restart ps shell-php shell-node db-shell logs clean

# Colors
CYAN = \033[0;36m
GREEN = \033[0;32m
YELLOW = \033[0;33m
NC = \033[0m # No Color

help:
	@echo "$(CYAN)OhDit Development Commands:$(NC)"
	@echo "$(GREEN)make install$(NC)      - First time setup (build containers and install dependencies)"
	@echo "$(GREEN)make up$(NC)           - Start all containers"
	@echo "$(GREEN)make down$(NC)         - Stop all containers"
	@echo "$(GREEN)make restart$(NC)      - Restart all containers"
	@echo "$(GREEN)make ps$(NC)           - Show container status"
	@echo "$(GREEN)make shell-php$(NC)    - Open PHP container shell"
	@echo "$(GREEN)make shell-node$(NC)   - Open Node.js container shell"
	@echo "$(GREEN)make db-shell$(NC)     - Open PostgreSQL shell"
	@echo "$(GREEN)make logs$(NC)         - View container logs"
	@echo "$(GREEN)make clean$(NC)        - Remove all containers and volumes"

install:
	@echo "$(YELLOW)Building containers...$(NC)"
	docker compose build
	@echo "$(YELLOW)Installing backend dependencies...$(NC)"
	docker compose run --rm php composer install
	@echo "$(YELLOW)Installing frontend dependencies...$(NC)"
	docker compose run --rm node npm install
	@echo "$(YELLOW)Setting up database...$(NC)"
	docker compose run --rm php bin/console doctrine:migrations:migrate --no-interaction
	@echo "$(GREEN)Installation complete!$(NC)"

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

ps:
	docker compose ps

shell-php:
	docker compose exec php bash

shell-node:
	docker compose exec node bash

shell-postgres:
	docker compose exec postgres psql -U postgres ohdit

logs:
	docker compose logs -f

clean:
	@echo "$(YELLOW)Removing all containers and volumes...$(NC)"
	docker compose down -v --remove-orphans
	@echo "$(GREEN)Cleanup complete!$(NC)" 