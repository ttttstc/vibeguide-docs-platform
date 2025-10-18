# Frontend Guideline Document

This document outlines the frontend architecture, design principles, and technologies used in the VibeGuide AI Documentation Platform. It’s written in everyday language so that anyone—even without a deep technical background—can understand how the frontend is structured and maintained.

---

## 1. Frontend Architecture

### Technology Stack
- **Framework**: React (with TypeScript) evolving into Next.js for server-side rendering (SSR) and static site generation (SSG).
- **UI Library**: shadcn/ui (a collection of pre-built, accessible React components).
- **Styling**: Tailwind CSS for utility-first styling.
- **Animations**: Framer Motion for smooth transitions and micro-interactions.
- **Data Fetching & State**: TanStack Query (formerly React Query) for server-state, React Context or custom hooks (e.g., `useAuth`) for client-state, and React Hook Form with Zod for form state/validation.
- **Build & Tooling**: Next.js build system (replacing Vite), TypeScript for type safety, ESLint + Prettier for code quality.
- **Project Layout**: Monorepo-ready, with `apps/frontend` for the Next.js app, `apps/backend` for Node.js/Express, and `packages/shared-types` for shared TypeScript definitions.

### How It Supports Scalability, Maintainability, and Performance
- **Component-Based**: Breaking UI into small, reusable pieces makes it easy to add or change features without rewriting large chunks of code.
- **Type Safety**: TypeScript and shared Zod schemas ensure errors are caught early, reducing bugs and speeding up development.
- **Server-State Management**: TanStack Query handles caching, background refetching, and loading/error states so developers can write less boilerplate and focus on UI logic.
- **Monorepo Approach**: Shared packages and consistent configs (ESLint, TypeScript paths) keep multiple parts of the project in sync and avoid duplication.
- **Next.js Optimizations**: Built-in code splitting, SSR/SSG, and image optimization deliver fast load times and good SEO.

---

## 2. Design Principles

### Usability
- **Clear Patterns**: Forms, buttons, dialogs, and cards follow consistent layouts and behaviors so users learn the interface quickly.
- **Feedback**: Instant visual cues (toasts, spinners, progress bars) inform users when actions succeed, fail, or are in progress.

### Accessibility (A11y)
- **Keyboard Support**: All interactive elements (buttons, dialogs, menus) are navigable via keyboard.
- **Screen Reader Labels**: Components include `aria-` attributes and semantic HTML to describe their purpose.
- **Color Contrast**: Our palette meets WCAG AA standards to ensure text is readable.
- **Regular Audits**: Use tools like Lighthouse or axe-core to catch regressions.

### Responsiveness
- **Mobile-First**: Layouts and components adapt seamlessly from small to large screens using Tailwind’s breakpoint utilities.
- **Fluid Grids & Flex**: We leverage CSS Grid and Flexbox to adjust the UI dynamically.

### Consistency & Brand Alignment
- **Component Library**: shadcn/ui ensures every button, input, card, and dialog has uniform styling.
- **Design Tokens**: Colors, spacings, and font sizes are defined in Tailwind config, preventing ad-hoc deviations.

---

## 3. Styling and Theming

### Styling Approach
- **Utility-First**: Tailwind CSS lets us write styles directly in the markup for quick iterations.
- **Conditional Styles**: The `cn` utility function helps compose Tailwind classes based on component props.
- **No BEM**: We rely on Tailwind’s atomic classes instead of naming conventions like BEM.

### Theming
- **Single Theme**: A modern, flat design with subtle depth effects—consistent across the app.
- **Dark Mode (Optional)**: Implemented by toggling a `dark` class on the `<html>` element and defining dark-mode variants in `tailwind.config.js`.

### Visual Style
- **Look & Feel**: Flat and modern, with clean lines, white space, and gentle animations courtesy of Framer Motion.

### Color Palette
- **Primary**: #4F46E5 (indigo)
- **Secondary**: #22D3EE (cyan)
- **Accent**: #FBBF24 (amber)
- **Success**: #10B981 (emerald)
- **Warning**: #F59E0B (amber-600)
- **Error**: #EF4444 (red-500)
- **Neutral**: #F3F4F6 (gray-100) and #374151 (gray-700)

### Typography
- **Font Family**: Inter, a modern sans-serif with great readability.
- **Font Sizes**: Set in Tailwind config (base 16px, scale up in multiples of 1.25).

---

## 4. Component Structure

### Organization
- **src/components/ui/**: All generic, reusable UI elements (Button, Input, Card, Dialog, Toast, Table, etc.).
- **src/components/**: Feature-specific wrappers or compositions (e.g., `ProjectCard.tsx`, `AuthForm.tsx`, `DocEditor.tsx`).
- **src/hooks/**: Custom hooks like `useAuth`, `useProjects`, and wrappers around TanStack Query.
- **src/lib/**: Utilities (`cn` function, API helpers).

### Reuse & Maintainability
- **Isolated Testing**: Each UI component can be tested alone (unit tests) before being composed.
- **Single Responsibility**: Components do one thing well (e.g., a Button only handles styling and click events).
- **Clear Props**: Strong TypeScript interfaces define what data each component needs.

---

## 5. State Management

### Server State (Data from API)
- **TanStack Query**:
  - Fetch lists (e.g., projects) with `useQuery`.
  - Perform actions (e.g., generate docs) with `useMutation`.
  - Automatic caching, retries, and background updates.

### Client State
- **React Context or Custom Hooks** for global data like user authentication.
- **React Hook Form** for form state, with Zod schemas for validation.
- **Local UI State** (e.g., open/closed state of a modal) via `useState`.

This mix ensures data is fresh, forms are validated, and UI state is easy to reason about.

---

## 6. Routing and Navigation

### Next.js File-Based Routing
- **Pages Directory**: Each file under `pages/` (or `app/` in newer Next.js versions) becomes a route—e.g., `/login`, `/dashboard`.
- **Dynamic Routes**: Square brackets for parameters (`pages/projects/[id].tsx`).

### Navigation Components
- **Next/Link**: Wrap buttons or links to enable client-side transitions.
- **Layout Components**: Shared header or sidebar in `components/Layout.tsx` so the navigation UI is consistent across pages.

---

## 7. Performance Optimization

- **Code Splitting**: Next.js automatically splits code by page; use `next/dynamic` for on-demand component loading.
- **Lazy Loading**: Images via `next/image` and components via dynamic imports.
- **Tree Shaking**: Tailwind CSS with PurgeCSS removes unused classes in production builds.
- **Memoization**: `React.memo`, `useMemo`, and `useCallback` for expensive computations or prop functions.
- **Caching**: TanStack Query’s built-in cache reduces unnecessary network requests.

These techniques combine to deliver fast initial loads and snappy interactions.

---

## 8. Testing and Quality Assurance

### Unit & Integration Tests
- **Jest** with **React Testing Library** for components and hooks.
- **Mock Service Worker (MSW)** to simulate API responses for integration tests.

### End-to-End (E2E) Tests
- **Cypress** or **Playwright** for full flows (e.g., sign up → create project → generate docs).

### Linting & Formatting
- **ESLint** with custom config in `eslint-config-custom` package.
- **Prettier** for consistent code style.
- **Pre-commit Hooks** via Husky to run linting and tests before each commit.

### Continuous Integration
- **GitHub Actions** workflow that:
  1. Checks out code
  2. Installs dependencies (pnpm, npm, or yarn)
  3. Runs ESLint and Prettier checks
  4. Executes Jest tests (frontend & backend)
  5. Builds the Next.js app

This ensures code quality on every pull request.

---

## 9. Conclusion and Overall Frontend Summary

We’ve built the VibeGuide frontend on a solid, opinionated foundation: React + TypeScript evolving into Next.js, shadcn/ui + Tailwind CSS for UI, TanStack Query for data, and React Hook Form + Zod for forms. This stack, combined with a component-driven approach, monorepo readiness, and robust testing, gives us:

- **Scalability**: Easily add new features or pages.
- **Maintainability**: Clear folder structure, strong types, shared configs.
- **Performance**: SSR, code splitting, caching, and optimizations out of the box.
- **User-Centric Design**: Accessibility, responsiveness, and consistent styling.

By following these guidelines, any developer—regardless of background—can pick up the codebase, understand how pieces fit together, and confidently build or extend the VibeGuide AI Documentation Platform.