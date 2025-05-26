# OhDit - Web Accessibility Audit Tool

OhDit is a comprehensive web-based accessibility audit tool designed to help professionals conduct, manage, and export accessibility audits according to RGAA 4.1 (Référentiel Général d'Amélioration de l'Accessibilité) standards. The application provides a clean, user-friendly interface for performing detailed accessibility assessments with support for rich documentation and standardized reporting.

## Project Overview

### Purpose
OhDit addresses the need for a modern, efficient tool to conduct accessibility audits in compliance with French RGAA regulations. It streamlines the audit process by providing structured criteria management, detailed documentation capabilities, and standardized export formats.

### Key Features
- **RGAA 4.1 Compliance**: Full implementation of RGAA 4.1 criteria and guidelines
- **Audit Management**: Create, manage, and track accessibility audits
- **Rich Documentation**: Markdown support for detailed comments and observations
- **Standardized Export**: Export audit results in official RGAA Excel format
- **Internationalization**: Initially French, with i18n architecture for future languages
- **Clean Architecture**: Following SOLID principles with feature-based organization

### MVP Scope
The initial version focuses on core audit functionality without user authentication or multi-user support:
- Single-user audit creation and management
- Complete RGAA 4.1 criteria implementation
- Markdown-based commenting system
- Excel export functionality
- Responsive, accessible interface

### Future Roadmap
- User authentication and multi-user support
- Automated accessibility checks integration
- WCAG 2.1/2.2 standards support
- Advanced reporting and analytics
- Team collaboration features

## Technical Stack

### Backend
- **PHP 8.4**: Latest PHP version with modern features
- **Symfony**: Robust framework for API development
- **API Platform**: GraphQL API with automatic documentation
- **PostgreSQL 17**: Advanced relational database
- **Docker**: Containerized development and deployment

### Frontend
- **Next.js**: React framework with App Router
- **TypeScript**: Strict typing for better code quality
- **Zustand**: Lightweight state management
- **Tailwind CSS**: Utility-first CSS framework
- **react-i18next**: Internationalization support

### Architecture Principles
- **Feature-based organization**: Self-contained feature modules
- **SOLID principles**: Clean, maintainable code structure
- **CQS pattern**: Command Query Separation for clear data flow
- **Accessibility-first**: RGAA 4.1 compliance in our own interface
- **Monorepo structure**: Unified development experience

## Project Structure

```
oh-dit-cursor/
├── backend/                 # Symfony backend
│   ├── src/
│   │   └── [Feature]/      # Feature-based organization
│   │       ├── Controller/
│   │       ├── Entity/
│   │       ├── Repository/
│   │       └── Service/
│   └── ...
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── features/      # Feature-specific code
│   │   │   └── [feature]/
│   │   │       ├── components/
│   │   │       ├── hooks/
│   │   │       ├── types/
│   │   │       └── utils/
│   │   ├── components/    # Shared components
│   │   ├── hooks/         # Shared hooks
│   │   ├── lib/          # Utilities and config
│   │   └── types/        # Shared types
└── infrastructure/        # Docker and deployment
```

## Development Requirements

- **PHP 8.4+**: Latest PHP with modern syntax support
- **Node.js 24+**: Latest LTS with enhanced performance
- **PostgreSQL 17+**: Advanced database features
- **Docker**: For consistent development environment

## Getting Started

### Installation
```bash
# Clone the repository
git clone [repository-url]
cd oh-dit-cursor

# Install all dependencies
make install

# Start development environment
make dev
```

### Development Commands
```bash
make install    # Install backend and frontend dependencies
make dev        # Start development servers
make test       # Run all tests
make lint       # Run linters
make build      # Build for production
make clean      # Clean build artifacts
```

## Development Guidelines

### Code Quality
- Follow SOLID principles and clean architecture
- Use meaningful names and keep functions focused
- Write comprehensive tests for business logic
- Maintain strict TypeScript configuration
- Follow accessibility best practices (RGAA 4.1)

### Git Workflow
- Use gitmoji for commit messages
- Feature-based branching strategy
- Atomic commits with single responsibility
- No direct commits to main branch

### Accessibility Focus
As an accessibility audit tool, OhDit itself must exemplify excellent accessibility:
- Semantic HTML structure
- Proper ARIA attributes
- Keyboard navigation support
- Screen reader compatibility
- High contrast and readable typography

## Contributing

This project follows strict coding standards and accessibility guidelines. Please ensure all contributions:
- Pass all tests and linting checks
- Follow the established architecture patterns
- Maintain accessibility compliance
- Include appropriate documentation

## License

[License details to be added] 