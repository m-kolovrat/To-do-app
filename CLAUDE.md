# To-Do App

A modern to-do application with weather sidebar integration built with Svelte 5.

## Tech Stack

- **Frontend**: Svelte 5 (with runes)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4.2 + CSS custom properties
- **Animations**: Motion library
- **State Management**: Svelte stores (custom patterns)
- **Storage**: localStorage

## Architecture

### File Structure
```
src/
├── lib/
│   ├── components/     # Svelte components
│   ├── stores/         # State management (appStore, weatherStore)
│   └── utils/          # Helper functions (storage, weatherService)
├── App.svelte          # Root component
├── app.css             # Global styles + CSS variables
└── main.js             # Entry point
```

### State Management Patterns

- Use **custom store factories** with methods (not plain `writable()`)
- Pattern: `{ subscribe, add, update, delete, toggle, clear }`
- Separate **persistent stores** (tasks, settings) from **UI state** (uiState)
- Auto-save to localStorage on every mutation
- Use **derived stores** for filtered/computed data

### Component Conventions

- Components in `src/lib/components/` with PascalCase names
- Keep business logic in stores, not components
- Use Svelte event forwarding (`on:eventName`) for parent communication
- Mobile breakpoint: 768px

## Design System

### Theme (Dark)
- Use CSS custom properties from `app.css` (NOT Tailwind colors)
- Primary accent: `--color-primary` (#FF6B35)
- Backgrounds: `--color-bg`, `--color-bg-secondary`, `--color-bg-tertiary`
- Text: `--color-text`, `--color-text-secondary`, `--color-text-muted`
- Typography: Inter font family

### Category Colors
- Personal: #4DB8FF (blue)
- Work: #D4E842 (lime)
- Shopping: #FF6347 (tomato)
- Health: #4CD964 (green)
- Other: #6C6C70 (gray)

## Key Features

- Task management (categories, priorities, due dates, recurring tasks)
- Weather sidebar (collapsible, left/right positioning)
- Responsive mobile/desktop layouts
- localStorage persistence
