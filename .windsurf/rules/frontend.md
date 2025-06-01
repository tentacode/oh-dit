# OhDit Frontend Rules (Node.js 24)

## JavaScript/TypeScript Rules

1. Use TypeScript with strict mode enabled
2. Keep components small and focused
3. Use React hooks for shared logic instead of class components
4. Use CSS modules for styling
5. Implement proper i18n with useTranslation

## Component Organization

1. Follow feature-based structure for all components
2. Organize pages in feature/pages/ directory
3. Keep reusable components in feature/components/ directory
4. Use DaisyUI for concise UI code
5. Follow React best practices (useMemo, useCallback)

## State Management

1. Use Zustand for state management
2. Avoid component state for shared data
3. Keep state logic separate from UI components
4. Use hooks for shared logic

## Internationalization

1. Use i18n from the start of development
2. Use meaningful translation keys
3. Support both French (primary) and English (fallback)
4. Implement pluralization and interpolation
5. Organize translations in feature-specific namespaces

## Accessibility

1. Use semantic HTML elements
2. Ensure proper color contrast
3. Support keyboard navigation
4. Follow RGAA 4.1 standards
5. Ensure screen reader compatibility

## Performance

1. Lazy load components when appropriate
2. Optimize images and assets
3. Monitor and optimize API response times
4. Implement appropriate caching strategies
