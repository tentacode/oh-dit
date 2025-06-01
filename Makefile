.PHONY: help install up down restart ps shell-frontend db-shell logs clean

# Colors
CYAN = \033[0;36m
GREEN = \033[0;32m
YELLOW = \033[0;33m
NC = \033[0m # No Color

help:
	@echo "$(CYAN)OhDit Development Commands:$(NC)"
	@echo "$(GREEN)make install$(NC)      - First time setup (copy env and build containers)"
	@echo "$(GREEN)make up$(NC)           - Start all containers"
	@echo "$(GREEN)make down$(NC)         - Stop all containers"
	@echo "$(GREEN)make restart$(NC)      - Restart all containers"
	@echo "$(GREEN)make ps$(NC)           - Show container status"
	@echo "$(GREEN)make shell-frontend$(NC) - Open frontend container shell"
	@echo "$(GREEN)make db-shell$(NC)     - Open PostgreSQL shell"
	@echo "$(GREEN)make logs$(NC)         - View container logs"
	@echo "$(GREEN)make clean$(NC)        - Remove all containers and volumes"

install:
	@echo "$(YELLOW)Setting up environment...$(NC)"
	cp .env.dist .env
	@echo "$(YELLOW)Building containers...$(NC)"
	docker compose build
	@echo "$(GREEN)Installation complete!$(NC)"

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

ps:
	docker compose ps

shell-frontend:
	docker compose exec frontend sh

shell-backend:
	docker compose exec backend sh

shell-db:
	docker compose exec database psql -U ohdit ohdit_dev

logs:
	docker compose logs -f

clean:
	@echo "$(YELLOW)Removing all containers and volumes...$(NC)"
	docker compose down -v --remove-orphans
	@echo "$(GREEN)Cleanup complete!$(NC)" 