# Backend Structure Document

This document outlines the backend architecture, database, APIs, hosting, infrastructure, security, and maintenance plans for the VibeGuide AI Documentation Platform. It’s written in everyday language so anyone can understand the setup.

## 1. Backend Architecture

### Overall Design
- We use **Node.js** with the **Express** framework to handle HTTP requests. Express is lightweight, easy to learn, and widely supported.
- The code follows the **Model–View–Controller (MVC)** pattern:
  - Models handle data and database interactions.
  - Controllers process incoming requests, apply business logic, and call models.
  - Routes map URLs to controller methods.
- For OpenAI calls (document generation), we have a dedicated service layer that isolates AI logic from the rest of the backend.

### Scalability, Maintainability & Performance
- **Modular structure**: We organize code into folders (routes, controllers, models, services, middleware) so teams can work independently without conflicts.
- **Stateless servers**: Each API instance doesn’t store user data locally. If traffic spikes, we can add more instances behind a load balancer.
- **Connection pooling**: The MongoDB driver pools connections, speeding up queries and saving resources.
- **Caching**: Frequently requested data (like user profiles) can be cached in Redis to reduce database load and improve response times.

## 2. Database Management

### Technology
- We use **MongoDB**, a NoSQL document database, hosted on **MongoDB Atlas** for reliability and automated backups.
- **Mongoose** is our Object Data Modeling (ODM) library. It provides schemas, validations, and a clean interface to MongoDB.

### Data Structure & Access
- Data is stored in collections of JSON-like documents. Collections include:
  - `users` (authentication and profile data)
  - `projects` (project metadata and settings)
  - `documents` (AI-generated content tied to a project)
- We define Mongoose schemas that enforce field types, required properties, and default values.
- Queries use Mongoose’s built-in methods (`find`, `findById`, `create`, `updateOne`, etc.).
- For list endpoints, we apply pagination (limit & skip) and index fields like `userId` to speed up lookups.

## 3. Database Schema

Below is a human-readable overview of each collection and its key fields. We enforce these shapes through Mongoose schemas.

### 1. users Collection
- _id: unique user identifier (ObjectId)
- email: string, unique, required
- passwordHash: string, required
- name: string, optional
- createdAt: date, default to now
- updatedAt: date, automatically set on change

### 2. projects Collection
- _id: unique project identifier (ObjectId)
- userId: ObjectId, references a user, required
- title: string, required
- description: string, optional
- status: string (e.g., "draft", "published"), default "draft"
- createdAt: date, default to now
- updatedAt: date, automatically set on change

### 3. documents Collection
- _id: unique document identifier (ObjectId)
- projectId: ObjectId, references a project, required
- content: string, the generated documentation
- inputSpecs: object, stores the user’s original form inputs
- status: string (e.g., "pending", "complete"), default "pending"
- createdAt: date, default to now
- updatedAt: date, automatically set on change

## 4. API Design and Endpoints

We expose a set of RESTful endpoints under `/api`. All data is sent and received in JSON.

### Authentication
- POST `/api/auth/signup`
  - Purpose: Create a new user account.
  - Body: `{ email, password, name }`
  - Response: `{ userId, email, name, token }`

- POST `/api/auth/login`
  - Purpose: Authenticate an existing user.
  - Body: `{ email, password }`
  - Response: `{ userId, email, name, token }`

### Projects
- GET `/api/projects`
  - Purpose: List user projects.
  - Query: `?limit=&skip=` for pagination.
  - Headers: `Authorization: Bearer <token>`
  - Response: `[{ _id, title, description, status, createdAt }]`

- POST `/api/projects`
  - Purpose: Create a new project.
  - Body: `{ title, description }`
  - Response: `{ _id, title, description, status, createdAt }`

- PUT `/api/projects/:id`
  - Purpose: Update project metadata.
  - Body: `{ title?, description?, status? }`
  - Response: Updated project object.

- DELETE `/api/projects/:id`
  - Purpose: Remove a project and its documents.
  - Response: `{ success: true }`

### Document Generation
- POST `/api/generate-doc`
  - Purpose: Generate AI documentation for a project.
  - Body: `{ projectId, inputSpecs }`
  - Flow:
    1. Validate JWT and input.
    2. Mark a new document in MongoDB with status `pending`.
    3. Call OpenAI API with `inputSpecs`.
    4. Save the returned `content` in the document, set status `complete`.
  - Response: `{ documentId, status, content }`

## 5. Hosting Solutions

### Backend Server
- **Platform**: AWS Elastic Beanstalk (Dockerized Node.js app)
- **Benefits**:
  - Autoscaling: Automatically adjusts capacity based on load.
  - Managed updates: Easy deployment of new versions via CLI or CI pipeline.
  - Built-in load balancing and health checks.

### Database
- **MongoDB Atlas**:
  - Global distribution for low-latency reads.
  - Automatic backups and point-in-time restores.
  - Role-based access control and IP whitelisting.

## 6. Infrastructure Components

- **Load Balancer (AWS ALB)**: Distributes incoming traffic across multiple backend instances for reliability.
- **Redis Cache (AWS ElastiCache)**: Caches frequent reads like user sessions or project lists to reduce database load.
- **CDN (Cloudflare)**: Serves static assets (images, CSS) with global edge caching for faster page loads.
- **Docker**: Containerizes the backend for consistent environments across development, staging, and production.
- **CI/CD (GitHub Actions)**: Runs tests, builds Docker images, and deploys to Elastic Beanstalk on push to `main`.

## 7. Security Measures

- **HTTPS Enforcement**: All traffic to API is over TLS.
- **JWT Authentication**: Tokens are signed with a strong secret. Tokens expire after a set time (e.g., 1 hour).
- **Password Hashing**: We use bcrypt to hash passwords before storing.
- **CORS**: Restricts API access to approved frontend domains.
- **Helmet Middleware**: Sets secure HTTP headers (HSTS, XSS protection, etc.).
- **Environment Variables**: Secrets (DB URI, JWT secret, OpenAI key) are never committed to code. They live in secure stores (AWS Parameter Store or Vault).
- **Input Validation**: All incoming data is validated against Zod schemas to prevent injection attacks and bad data.
- **Role-Based Access**: Users can only access resources they own. Route middleware checks `userId` on every read/write.

## 8. Monitoring and Maintenance

### Monitoring Tools
- **CloudWatch**: Tracks server metrics (CPU, memory, disk) and logs.
- **Datadog**: Aggregates application metrics (response times, error rates) and custom traces.
- **Sentry**: Captures runtime errors and uncaught exceptions in production.

### Maintenance Strategy
- **Automated Backups**: MongoDB Atlas backups run daily with on-demand snapshots before upgrades.
- **Dependency Updates**: Dependabot opens pull requests for npm package updates.
- **Health Checks**: Elastic Beanstalk periodically pings `/health` endpoint; unhealthy instances are replaced.
- **On-call Rotation**: Team members share responsibility for fast response to alerts.

## 9. Conclusion and Overall Backend Summary

The VibeGuide backend is built on a modern, scalable Node.js/Express stack with MongoDB Atlas. Its modular MVC architecture and AWS-based hosting ensure reliability, performance, and easy growth. We use JWT for secure authentication, Redis for caching, and a powerful CI/CD pipeline for smooth deliveries. Comprehensive monitoring and robust maintenance practices protect uptime and user data. Overall, this setup aligns with VibeGuide’s goals: fast AI document generation, a responsive user experience, and a platform that can evolve as user needs grow.