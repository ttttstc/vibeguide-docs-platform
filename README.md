# VibeGuide AI Documentation Platform

An AI-powered documentation generation platform that helps you create comprehensive technical documentation using OpenAI GPT-4.

## Features

- 🤖 **AI-Powered Documentation**: Generate comprehensive docs using GPT-4
- 👥 **User Authentication**: Secure JWT-based authentication
- 📁 **Project Management**: Organize documentation by projects
- 📝 **Rich Editor**: Markdown-based document editing
- 🔒 **Secure**: Protected routes and user data isolation
- 📱 **Responsive**: Mobile-friendly interface

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- OpenAI API
- Joi Validation

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Hook Form
- TanStack Query

## Project Structure

```
vibeguide-docs-platform/
├── apps/
│   ├── backend/          # Express API server
│   └── frontend/         # Next.js frontend
├── packages/
│   └── shared-types/     # Shared TypeScript types
├── documentation/        # Project documentation
└── .github/workflows/    # CI/CD pipelines
```

## Prerequisites

- Node.js 18+
- pnpm 8+
- MongoDB 6+
- OpenAI API key

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd vibeguide-docs-platform
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:

**Backend** (`apps/backend/.env`):
```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/vibeguide-docs
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key
FRONTEND_URL=http://localhost:3000
```

**Frontend** (`apps/frontend/.env`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Start the development servers:

```bash
# Start all services in parallel
pnpm dev

# Or start individually:
pnpm --filter @vibeguide/backend dev  # Backend on :3001
pnpm --filter @vibeguide/frontend dev  # Frontend on :3000
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Document Generation
- `POST /api/generate-doc` - Generate AI documentation
- `GET /api/generate-doc/:id` - Get generated document
- `DELETE /api/generate-doc/:id` - Delete document

## Testing

```bash
# Run all tests
pnpm test

# Run backend tests
pnpm --filter @vibeguide/backend test

# Run with coverage
pnpm --filter @vibeguide/backend test --coverage
```

## Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter @vibeguide/frontend build
pnpm --filter @vibeguide/backend build
```

## Available Scripts

- `pnpm dev` - Start all development servers
- `pnpm build` - Build all packages
- `pnpm lint` - Run linting across all packages
- `pnpm test` - Run tests across all packages
- `pnpm clean` - Clean build artifacts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
