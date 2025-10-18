# Project Requirements Document: VibeGuide AI Documentation Platform

## 1. Project Overview

VibeGuide is a modern, AI-powered documentation platform that helps users quickly generate, organize, and maintain technical or product documentation. It combines a polished, component-driven Next.js frontend with a custom Node.js/Express backend and MongoDB data store. At its heart, VibeGuide integrates with OpenAI’s GPT-4 model to turn user-defined specifications into structured, well-formatted documents in seconds.

The primary goal is to eliminate the manual overhead of writing and updating documentation. Users can log in, create or select a project, define the scope and style of their docs through an intuitive form, and let the AI handle the rest. Success will be measured by user adoption, average time saved per document, system reliability (uptime ≥ 99.5%), and end-to-end type safety (fewer than five type errors per build).

## 2. In-Scope vs. Out-of-Scope

### In-Scope (First Version)
- **Next.js Frontend**
  - Email/password authentication pages (signup, login, forgot password)
  - Dashboard listing user projects
  - Project creation/edit dialog
  - Document editor screen with AI input form and generated output viewer
  - Integration of `shadcn/ui` components, Tailwind CSS, Framer Motion animations
- **Node.js/Express Backend**
  - JWT-based auth routes (`/api/auth/signup`, `/api/auth/login`)
  - Project CRUD API (`/api/projects`)
  - AI generation endpoint (`/api/generate-doc`) calling OpenAI GPT-4 and persisting results in MongoDB
  - Basic error handling and JSON response conventions
- **Monorepo Setup**
  - Turborepo or Nx with `apps/frontend`, `apps/backend`, and `packages/shared-types`
  - Shared TypeScript interfaces for `Project` and `Document`
- **State & Data Management**
  - TanStack Query for data fetching and caching
  - React Hook Form & Zod for form handling and validation

### Out-of-Scope (Phase 2+)
- Payment or subscription billing flows
- Multi-tenant or organization-level role management beyond basic user/admin
- Localization/multi-language support
- Mobile-native apps (iOS/Android)
- Advanced analytics dashboard or reporting
- Single sign-on (SSO) with third-party identity providers

## 3. User Flow

A new user arrives at the landing page and clicks “Sign Up.” They fill in their name, email, and password. After email confirmation, they are redirected to the main dashboard, which shows a list of their existing documentation projects (initially empty). A prominent “Create Project” button opens a modal where they enter a project name, description, and select a public/private toggle.

Once the project is created, the user clicks it to open the Document Editor screen. They see a form with fields for document title, audience level, tone, and a free-form “specifications” textarea. Upon submitting, the UI shows a loading spinner. The backend calls OpenAI GPT-4 with the specs, saves the returned markdown to MongoDB, and returns it. The editor view then displays the generated document, and the user can edit, save, download as PDF, or start a new generation.

## 4. Core Features

- **Authentication**: Sign up, log in, password reset, JWT issued in HTTP-only cookies
- **Project Management**: Create, read, update, delete projects via REST endpoints
- **DocEditor UI**: Input form (React Hook Form + Zod), live preview of AI output
- **AI Generation API**: `/api/generate-doc` integrates with OpenAI GPT-4, streams or returns full response
- **Data Fetching & Caching**: TanStack Query hooks for projects and documents
- **UI Component Library**: `shadcn/ui`—buttons, cards, dialogs, tables, toasts
- **Styling & Animations**: Tailwind CSS for utility-first styling; Framer Motion for transitions
- **Shared Types**: Monorepo package with TypeScript interfaces for end-to-end type safety

## 5. Tech Stack & Tools

- **Frontend**: Next.js (React + TypeScript), Vercel for hosting
- **Backend**: Node.js, Express, MongoDB (Mongoose), TypeScript
- **AI**: OpenAI GPT-4 accessed via the official OpenAI Node.js SDK
- **State & Data**: TanStack Query, React Hook Form, Zod
- **Styling & UI**: shadcn/ui component library, Tailwind CSS, Framer Motion
- **Monorepo Management**: Turborepo or Nx, pnpm workspaces
- **Shared Config**: Custom ESLint and Prettier configs, shared tsconfig
- **IDE & Developer Tools**: VS Code, recommended plugins (ESLint, Prettier, Cursor AI)
- **CI/CD**: GitHub Actions for linting, builds, and test suites (Jest)

## 6. Non-Functional Requirements

- **Performance**: Page load time under 200 ms (cached), API responses under 300 ms (except AI calls). AI generation under 5 s.
- **Security**: HTTPS everywhere, JWT in HTTP-only, Secure cookies, input validation, sanitize outputs, OWASP Top 10 defenses
- **Scalability**: Stateless backend instances behind a load balancer, MongoDB Atlas for horizontal scaling
- **Availability**: 99.5% uptime; health checks and retry logic on AI calls
- **Usability**: WCAG 2.1 AA accessibility compliance, mobile-responsive layouts
- **Maintainability**: 80% test coverage, end-to-end type safety, clear folder structure

## 7. Constraints & Assumptions

- **API Keys**: Availability of OpenAI GPT-4 API with sufficient quota
- **Environment**: Node.js 18+, MongoDB Atlas provisioned, Vercel or equivalent for frontend
- **Monorepo Tooling**: Turborepo/Nx must be set up before dev starts
- **Shared Types**: Both apps will import from `packages/shared-types` for type consistency
- **Network**: Low latency between backend and OpenAI, MongoDB

## 8. Known Issues & Potential Pitfalls

- **Rate Limits**: OpenAI API rate limits could throttle generation—implement exponential backoff and user-friendly error messages
- **API Latency**: AI calls may take several seconds—show progress feedback and consider streaming
- **CORS & Proxy**: Next.js frontend and Express backend run on different ports—configure a reverse proxy or Next.js rewrites
- **Type Drift**: Shared-types updates must be synchronized—lock versions in package.json
- **Error Handling**: Ensure consistent JSON error schema (`{ error: string }`) and surface errors in toasts
- **Monorepo Complexity**: Initial setup can be tricky—provide clear README and boilerplate scripts for common tasks

---
This document provides a complete, unambiguous reference for building VibeGuide’s first release. Subsequent architecture, frontend guideline, and backend structure documents will derive directly from these requirements without additional clarification needed.