# OhDit - Web Accessibility Audit Tool

OhDit is a web-based accessibility audit tool designed to help professionals conduct and manage accessibility audits according to RGAA 4.1 standards.

## Project Structure

- `backend/`: Symfony backend with GraphQL API (using API Platform)
- `frontend/`: Next.js frontend with TypeScript and Zustand
- `infrastructure/`: Infrastructure configuration and deployment scripts

## Requirements

- PHP 8.4+
- Node.js 24+
- PostgreSQL 17+
- Docker

## Development Setup

1. Clone the repository
2. Run `make install` to install all dependencies
3. Run `make dev` to start the development environment

## Features (MVP)

- RGAA 4.1 criteria management
- Audit creation and management
- Markdown comments support
- Excel export in RGAA format
- French language support (i18n ready)

## License

[License details to be added] 