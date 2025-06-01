# OhDit Backend Rules (PHP 8.4)

## PHP Rules

1. Use PHP 8.4 features and syntax
2. Always use strict typing in PHP files with `declare(strict_types=1)`
3. Keep controllers thin with minimal business logic
4. Use constructor injection for dependencies instead of service locator
5. Implement value objects for complex values instead of arrays
6. Services should be stateless

## Architecture

1. Follow feature-based organization for all code
2. Implement CQRS pattern for separating commands and queries
3. Follow SOLID principles, especially Single Responsibility
4. Keep controllers focused on HTTP concerns only
5. Use dedicated directories for features (e.g., AuditResult/)

## Database Rules

1. Use meaningful database column names
2. Implement proper indexing for all tables
3. Use migrations for all schema changes
4. Follow database normalization principles
5. Use PostgreSQL 17.5 features appropriately

## Security Rules

1. Never commit sensitive data
2. Always validate user input
3. Implement rate limiting for APIs
4. Use prepared statements for all SQL queries
5. Set up proper CORS settings
