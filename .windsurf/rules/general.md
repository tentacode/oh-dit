---
trigger: manual
---

# OhDit General Coding Rules

# IMPORTANT

- Always tell me when a rule has been used, or if a rule has not been used

## General Guidelines

1. Treat interactions as professional collaboration, not casual conversation
2. Provide concise answers; elaborate only when requested
3. Prefer small, incremental changes over large refactors
4. Assume senior-level expertise in both parties
5. Use clear, direct language; formatted responses for complex explanations

## Code Style

1. Line length should not exceed 100 characters
2. Use 2 spaces for JS/TS indentation
3. Use 4 spaces for PHP indentation
4. Avoid magic numbers, use constants instead
5. Use early returns for cleaner control flow
6. Use meaningful names for variables, functions, and classes
7. Avoid abbreviations unless widely known

## Testing Rules

1. Follow AAA pattern in tests (Arrange, Act, Assert)
2. Test both happy paths and edge cases
3. Write meaningful test names
4. Cover business logic with unit tests
5. Test API endpoints with functional tests

## Security

1. Never commit sensitive data
2. Always validate user input
3. Implement proper CORS settings
4. Use prepared statements for SQL
5. Implement rate limiting where needed
