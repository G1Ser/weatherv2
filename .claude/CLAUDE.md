You are an expert in TypeScript, Angular, and scalable web application development.

## TypeScript

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid `any`; use `unknown` when type is uncertain

## Angular

- Use standalone components (default in v20+, do NOT set `standalone: true`)
- Implement lazy loading for feature routes
- Use `inject()` function instead of constructor injection
- Use signals for state management; do NOT use `mutate`, use `update` or `set`
- Do not assume globals like `new Date()` are available in templates

## Services

- Single responsibility per service
- Use `providedIn: 'root'` for singleton services
