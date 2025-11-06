.PHONY: help

# Colors
CYAN = \033[0;36m
GREEN = \033[0;32m
YELLOW = \033[0;33m
NC = \033[0m # No Color

help: ## Display this help message
	@grep -E '^[a-zA-Z_-\.]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

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

www.connect: ## Open www container shell
	docker compose exec www zsh

app.connect: ## Open app container shell
	docker compose exec app sh

app.lint: ## Run ESLint in app container
	docker compose exec app npm run lint

app.typescript: ## Run Typescript checks in app container
	docker compose exec app npm run typescript

api.connect: ## Open api container shell
	docker compose exec api zsh

api.phpstan: ## Run PHPStan in api container
	docker compose exec api bin/phpstan --memory-limit=1G
	docker compose exec api zsh

api.phpunit: ## Run phpuni in api container
	docker compose exec api bin/phpunit --testdox --fail-on-warning --fail-on-risky --fail-on-incomplete --fail-on-skipped

database.connect: ## Open PostgreSQL shell
	docker compose exec database psql -U ohdit ohdit_dev

reset: env='dev'
reset: ## Reset database (env=dev|test)
	docker compose exec api bin/console postgres:close-connections --env=$(env)
	docker compose exec api bin/console doctrine:database:drop --force --if-exists --env=$(env)
	docker compose exec api bin/console doctrine:database:create --env=$(env)
	docker compose exec api bin/console doctrine:migrations:migrate --no-interaction --env=$(env)
	docker compose exec api bin/console foundry:load-fixtures all -n --env=$(env)
	docker compose exec api bin/console rgaa:import --env=$(env)
	docker compose exec api bin/console cache:pool:clear --all --env=$(env)

tests: ## Run all tests
	docker compose exec www eslint . --fix && \
	echo "$(GREEN)www eslint passed!$(NC)" && \
	docker compose exec www npx prettier --write src && \
	echo "$(GREEN)www prettier passed!$(NC)" && \
	docker compose exec app npm run lint && \
	echo "$(GREEN)app eslint passed!$(NC)" && \
	docker compose exec app npm run typescript && \
	echo "$(GREEN)app typescript passed!$(NC)" && \
	docker compose exec api bin/phpstan --memory-limit=1G && \
	echo "$(GREEN)phpstan passed!$(NC)" && \
	docker compose exec api bin/ecs --fix && \
	echo "$(GREEN)ecs passed!$(NC)" && \
	docker compose exec api bin/rector process src && \
	echo "$(GREEN)rector passed!$(NC)" && \
	docker compose exec api bin/phpunit --testdox --fail-on-warning --fail-on-risky --fail-on-incomplete --fail-on-skipped && \
	echo "$(GREEN)phpunit passed!$(NC)"

destroy-docker: ## Remove all containers and volumes
	@echo "$(YELLOW)Removing all containers and volumes...$(NC)"
	docker compose down -v --remove-orphans
	@echo "$(GREEN)Cleanup complete!$(NC)" 

provision-server: ## Provision server
	ansible-playbook -i infrastructure/ansible/hosts infrastructure/ansible/provision-server.yml --extra-vars="@infrastructure/ansible/ohdit-vars.yml"

deploy: ## Deploy main to server
	ansible-playbook -i infrastructure/ansible/hosts infrastructure/ansible/deploy.yml --extra-vars="@infrastructure/ansible/ohdit-vars.yml"

update-rgaa: ## Update RGAA from git repository
	ansible-playbook infrastructure/ansible/update-rgaa.yml