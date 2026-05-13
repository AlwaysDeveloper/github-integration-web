# GitHub Web Integration - Project Architecture & Documentation

**Date:** May 2026  
**Framework:** Nx Monorepo with NestJS & Next.js  
**Status:** Production-ready

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [System Flows](#system-flows)
4. [Technology Stack](#technology-stack)
5. [Approach & Methodology](#approach--methodology)
6. [Configuration](#configuration)
7. [Deployment Guide](#deployment-guide)

---

## Project Overview

**GitHub Web Integration** is a full-stack web application that enables users to:

- Authenticate via **GitHub OAuth 2.0**
- View and manage their **GitHub repositories**
- Monitor **pull requests** across repositories
- Receive **email notifications** for important events
- Subscribe to **GitHub webhooks** for real-time updates
- Track repository activities and maintain centralized dashboard

### Core Value Proposition

This project acts as a **GitHub API aggregator and notification hub**, providing users with:
- A unified interface to manage GitHub activity
- Automatic notifications without cluttering GitHub
- Centralized pull request tracking
- Historical activity logs via MySQL database

---

## Architecture

### 1. High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        GitHub Web Integration                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────────────┐                  ┌──────────────────────┐  │
│  │  Frontend Layer     │                  │   Backend Layer      │  │
│  │  (Next.js 16 + React)                 │  (NestJS 11)        │  │
│  │                    │                  │                     │  │
│  │  ┌──────────────┐  │  HTTP/REST       │  ┌────────────────┐ │  │
│  │  │  Login Page  │─┼─────────────────>├─┤  Auth Module   │ │  │
│  │  │              │  │                  │  │  - OAuth Flow  │ │  │
│  │  │              │  │                  │  │  - JWT Gen     │ │  │
│  │  ├──────────────┤  │  Cookies (JWT)   │  └────────────────┘ │  │
│  │  │ Dashboard    │<─┼──────────────────┤                      │  │
│  │  │ - Repos      │  │                  │  ┌────────────────┐ │  │
│  │  │ - PRs        │──┼─────────────────>├─┤ GitHub Module  │ │  │
│  │  │ - Profile    │  │                  │  │ - User Info    │ │  │
│  │  └──────────────┘  │  REST API Calls  │  │ - Repos Mgmt   │ │  │
│  │                    │  (JWT Header)    │  └────────────────┘ │  │
│  │  ┌──────────────┐  │                  │                      │  │
│  │  │ API Routes   │  │                  │  ┌────────────────┐ │  │
│  │  │ - /auth      │  │                  │  │ Webhook Module │ │  │
│  │  │ - /repos     │  │                  │  │ - Listen       │ │  │
│  │  │ - /profile   │  │                  │  │ - Verify sig   │ │  │
│  │  └──────────────┘  │                  │  │ - Queue events │ │  │
│  └─────────────────────┘                  │  └────────────────┘ │  │
│                                            │                      │  │
│  ┌─────────────────────────────────────┐  │  ┌────────────────┐ │  │
│  │      GitHub OAuth Service           │  │  │Notification   │ │  │
│  │                                     │  │  │Module         │ │  │
│  │  1. User clicks "Login with GitHub" │  │  │- Email Send   │ │  │
│  │  2. Redirects to GitHub Auth URL    │  │  │- Consume msgs │ │  │
│  │  3. User grants permissions         │  │  └────────────────┘ │  │
│  │  4. GitHub redirects with code      │  │                      │  │
│  │  5. Backend exchanges code for token│  │  ┌────────────────┐ │  │
│  └─────────────────────────────────────┘  │  │ User Module    │ │  │
│                                            │  │ - Persistence │ │  │
│  ┌─────────────────────────────────────┐  │  │ - Relations    │ │  │
│  │      GitHub API Service             │  │  └────────────────┘ │  │
│  │  - Fetch repos, PRs, user data      │  │                      │  │
│  │  - Register webhooks                │  │                      │  │
│  │  - Process events                   │  │                      │  │
│  └─────────────────────────────────────┘  │                      │  │
│                                            │  ┌────────────────┐ │  │
│                                            │  │PR Module       │ │  │
│                                            │  │ - Track PRs    │ │  │
│                                            │  │ - Status mgmt  │ │  │
│                                            │  └────────────────┘ │  │
│                                            │                      │  │
│                                            │  ┌────────────────┐ │  │
│                                            │  │ Database Mod   │ │  │
│                                            │  │ - TypeORM cfg  │ │  │
│                                            │  └────────────────┘ │  │
│                                            └──────────────────────┘  │
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                    Shared Libraries Layer                            │
│                                                                       │
│  ┌──────────────────┐  ┌─────────────────┐  ┌──────────────────┐   │
│  │  Common Library  │  │  HTTP Client    │  │  RabbitMQ Lib    │   │
│  │  - Exceptions    │  │  (Axios wrapper)│  │  - Message queue │   │
│  │  - Filters       │  │  - Retry logic  │  │  - Consumers     │   │
│  └──────────────────┘  └─────────────────┘  └──────────────────┘   │
│                                                                       │
├─────────────────────────────────────────────────────────────────────┤
│                    Infrastructure Layer                              │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │   MySQL 8    │  │   RabbitMQ   │  │   GitHub     │              │
│  │  Database    │  │  Message     │  │   API        │              │
│  │  TypeORM ORM │  │  Queue       │  │              │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### 2. Module Structure

#### Backend Modules (`apps/backend/src/app`)

```
backend/
├── app.module.ts              # Root application module
├── app.controller.ts          # Health checks, main routes
├── app.service.ts             # Core services
│
├── auth/                       # Authentication Module
│   ├── auth.controller.ts     # OAuth callback, login endpoints
│   ├── auth.service.ts        # Token generation, user creation
│   ├── auth.guard.ts          # JWT validation guard
│   ├── auth.module.ts         # Module definition
│   └── user.decorator.ts      # @User() decorator for extracting user
│
├── github/                     # GitHub Integration Module
│   ├── github.controller.ts   # GitHub-related endpoints
│   ├── github.service.ts      # GitHub API calls
│   ├── github.module.ts       # Module configuration
│   └── github.service.spec.ts # Unit tests
│
├── repositories/              # Repository Management Module
│   ├── repositories.controller.ts
│   ├── repositories.service.ts
│   └── repositories.module.ts
│
├── pull-requests/             # Pull Request Module
│   ├── pull-requests.controller.ts
│   ├── pull-requests.service.ts
│   └── pull-requests.module.ts
│
├── webhooks/                  # GitHub Webhooks Module
│   ├── webhooks.controller.ts # Webhook endpoints
│   ├── webhooks.service.ts    # Event processing
│   └── webhooks.module.ts
│
├── notification/              # Notification Module
│   ├── notification.service.ts    # Email sending logic
│   ├── notification.consumer.ts   # RabbitMQ consumer
│   ├── notification.controller.ts # Config endpoints
│   ├── email.transport.ts         # Nodemailer setup
│   └── notification.module.ts
│
├── user/                      # User Module
│   ├── user.entity.ts         # User database entity
│   ├── user.service.ts        # User operations
│   └── user.module.ts
│
├── database/                  # Database Configuration
│   ├── database.module.ts     # TypeORM setup
│   ├── database.config.ts     # DB connection config
│   ├── typeorm.config.ts      # TypeORM CLI config
│   ├── entities/              # All database entities
│   └── migrations/            # Database migration files
│
└── config/                    # Configuration Module
    ├── github.config.ts       # GitHub OAuth config
    ├── auth.config.ts         # Auth settings
    └── config.config.ts       # System settings (RabbitMQ URI, etc.)
```

---

## System Flows

### Flow 1: User Authentication & Login

```
┌──────────────┐
│   Frontend   │
└──────────────┘
       │
       │ 1. User clicks "Login with GitHub"
       │
       ▼
┌──────────────────────────────────────┐
│   Backend: auth/                     │
│   GET /auth                          │
│   Returns GitHub Login URL           │
└──────────────────────────────────────┘
       │
       │ 2. Redirect to GitHub Auth
       │
       ▼
┌──────────────────────────────────────┐
│   GitHub OAuth Provider              │
│   https://github.com/login/oauth/    │
│   - User grants permissions          │
│   - GitHub sends authorization code  │
└──────────────────────────────────────┘
       │
       │ 3. GitHub redirects to callback
       │    GET /auth/github/callback?code=xxx
       │
       ▼
┌──────────────────────────────────────┐
│   Backend: auth.controller           │
│   - Exchange code for access token   │
│   - Call GitHub API: /user           │
│   - Check if user exists in DB       │
│   - Create user if new               │
│   - Generate JWT token               │
│   - Set HTTP cookie with JWT         │
└──────────────────────────────────────┘
       │
       │ 4. Redirect to frontend
       │    with JWT in cookie
       │
       ▼
┌──────────────┐
│   Frontend   │
│   Dashboard  │
│   (Logged in)│
└──────────────┘
```

**Key Code References:**
- [apps/backend/src/app/auth/auth.controller.ts](apps/backend/src/app/auth/auth.controller.ts) - OAuth callback handler
- [apps/backend/src/app/auth/auth.service.ts](apps/backend/src/app/auth/auth.service.ts) - Token generation logic

---

### Flow 2: Fetch User Repositories

```
┌──────────────────────┐
│ Frontend Dashboard   │
│ Click "My Repos"     │
└──────────────────────┘
         │
         │ GET /repos
         │ (JWT in header/cookie)
         │
         ▼
┌──────────────────────────────────────┐
│ Backend: repositories.controller     │
│ 1. Verify JWT (auth.guard)           │
│ 2. Extract user from token           │
│ 3. Call repositories.service         │
└──────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│ Backend: repositories.service        │
│ 1. Fetch GitHub access token from DB │
│ 2. Call GitHub API: /user/repos      │
│ 3. Transform API response            │
│ 4. Cache/store if needed             │
└──────────────────────────────────────┘
         │
         │ (axios with retry logic)
         │
         ▼
┌──────────────────────┐
│ GitHub REST API      │
│ GET /user/repos      │
└──────────────────────┘
         │
         │ Return repos JSON
         │
         ▼
┌──────────────────────┐
│ Frontend: Display    │
│ Repository list      │
└──────────────────────┘
```

---

### Flow 3: GitHub Webhook Events & Notifications

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Repository Events                      │
│              (Push, PR created, PR merged, Issues, etc.)         │
└─────────────────────────────────────────────────────────────────┘
         │
         │ POST webhook payload
         │ (to ngrok URL or production domain)
         │
         ▼
┌──────────────────────────────────────┐
│ Backend: webhooks.controller         │
│ POST /webhooks/github                │
│                                      │
│ 1. Verify GitHub signature           │
│    (HMAC-SHA256 validation)          │
│ 2. Parse event type                  │
│ 3. Send to RabbitMQ queue            │
│    Topic: github.events              │
└──────────────────────────────────────┘
         │
         │ Publish to RabbitMQ
         │
         ▼
┌──────────────────────────────────────┐
│        RabbitMQ Message Queue         │
│      Exchange: github.events          │
│      Type: topic                      │
└──────────────────────────────────────┘
         │
    ┌────┴────────────────────────────┐
    │                                 │
    │ Multiple Consumers Listen       │
    │                                 │
    ▼                                 ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│ Notification Consumer    │  │ Other Consumers          │
│ notification.consumer.ts │  │ (Future analytics, etc.) │
│                          │  │                          │
│ 1. Receive event         │  │                          │
│ 2. Format email body     │  │                          │
│ 3. Queue email send      │  │                          │
│    via Nodemailer        │  │                          │
└──────────────────────────┘  └──────────────────────────┘
    │
    │
    ▼
┌──────────────────────────┐
│  Nodemailer/SMTP Server  │
│  (Email Transport)       │
│                          │
│ Send email to user       │
└──────────────────────────┘
    │
    ▼
┌──────────────────────────┐
│  User's Email Inbox      │
│  Notification received   │
└──────────────────────────┘
```

**Key Code References:**
- [apps/backend/src/app/webhooks/webhooks.controller.ts](apps/backend/src/app/webhooks/webhooks.controller.ts) - Webhook receiver
- [apps/backend/src/app/notification/notification.consumer.ts](apps/backend/src/app/notification/notification.consumer.ts) - RabbitMQ consumer

---

### Flow 4: Database Persistence

```
All modules that need persistent storage use TypeORM:

┌─────────────────────┐
│ NestJS Service      │
│ (e.g., user.service)│
└─────────────────────┘
         │
         │ Inject TypeOrmModule
         │ repository
         │
         ▼
┌─────────────────────┐
│ TypeORM Repository  │
│ (e.g., User entity) │
│                     │
│ - find()            │
│ - save()            │
│ - delete()          │
└─────────────────────┘
         │
         │ SQL Query
         │
         ▼
┌─────────────────────┐
│  MySQL Database     │
│  (MySQL 8)          │
│                     │
│  Tables:            │
│  - users            │
│  - repositories     │
│  - pull_requests    │
│  - notifications    │
└─────────────────────┘
```

---

## Technology Stack

### Backend

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | NestJS | 11.0.0 | Backend framework with dependency injection |
| Runtime | Node.js | Latest LTS | JavaScript runtime |
| Language | TypeScript | Latest | Type-safe JavaScript |
| HTTP Client | Axios | 1.16.0 | REST API calls to GitHub |
| Retry Logic | axios-retry | 4.5.0 | Automatic retry for failed requests |
| Database | MySQL | 8.0+ | Persistent data storage |
| ORM | TypeORM | 0.3.29 | Database abstraction layer |
| Authentication | JWT | passport-jwt 4.0.1 | Stateless authentication |
| Config Management | @nestjs/config | 4.0.4 | Environment-based configuration |
| Message Queue | RabbitMQ | Latest | Async event processing |
| Email | Nodemailer | 8.0.7 | SMTP email sending |
| Build Tool | Webpack | Latest | Module bundling |
| Testing | Jest | Latest | Unit testing framework |

### Frontend

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | Next.js | 16.1.6 | React meta-framework with SSR |
| UI Library | React | 19.0.0 | Component-based UI |
| Styling | Tailwind CSS | Latest | Utility-first CSS framework |
| PostCSS | PostCSS | Latest | CSS transformations |
| State Mgmt | js-cookie | 3.0.5 | Client-side cookie management |

### Monorepo & Build

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Monorepo | Nx | 22.7.1 | Monorepo orchestration & caching |
| Linting | ESLint | 9.8.0 | Code quality checks |
| Compiler | SWC | 1.15.5 | Fast TypeScript compiler |
| Testing | Playwright | 1.36.0 | E2E testing |

---

## Approach & Methodology

### 1. Monorepo Strategy (Nx)

**Why Nx?**
- Single source of truth for dependencies
- Efficient build caching across projects
- Shared library management
- Integrated task orchestration

**Structure:**
```
apps/           # Standalone applications
├── backend/    # NestJS API
└── frontend/   # Next.js web app

shared/         # Reusable libraries
├── common/     # Exception handling, filters
├── http-client/# Axios wrapper with retry
└── rabbitmq/   # Message queue client
```

**Benefits:**
- Code reuse across frontend/backend
- Consistent HTTP client implementation
- Shared exception handling
- Single dependency management

---

### 2. Authentication Strategy

**OAuth 2.0 Flow with JWT:**

1. **Step 1: OAuth Authorization**
   - User initiates GitHub login
   - App redirects to GitHub authorization endpoint
   - User grants permissions (repos, webhooks, user info)

2. **Step 2: Token Exchange**
   - Backend receives authorization code
   - Backend exchanges code for GitHub access token
   - GitHub access token stored in database (encrypted recommended)

3. **Step 3: JWT Generation**
   - Backend generates JWT token containing user info
   - JWT signed with `JWT_SECRET` environment variable
   - Sent to frontend via HttpOnly cookie

4. **Step 4: Protected Routes**
   - Frontend sends JWT in every request header
   - Backend verifies JWT signature using `auth.guard.ts`
   - User context extracted and available to services

**Security Considerations:**
- JWT tokens have expiration (7 days)
- HttpOnly cookies prevent XSS attacks
- GitHub access tokens stored securely in database
- CORS configured for frontend domain

---

### 3. API Design Pattern

**RESTful Architecture:**

```
GET    /auth              # Get GitHub login URL
GET    /auth/github/callback  # OAuth callback

GET    /repos             # List user repositories
GET    /repos/:id         # Get repo details
POST   /repos/:id/sync    # Sync repo data

GET    /profile           # User profile data
PUT    /profile           # Update profile

GET    /pull-requests     # List PRs across repos
GET    /pull-requests/:id # PR details

POST   /webhooks/github   # Receive GitHub webhooks

POST   /notifications/subscribe    # Subscribe to notifications
GET    /notifications/preferences  # User preferences
```

**Request/Response Pattern:**
- All requests include JWT in `Authorization` header or cookies
- All responses return consistent JSON structure
- Error responses include error codes and messages
- Pagination supported for list endpoints (future)

---

### 4. Asynchronous Processing with RabbitMQ

**Why RabbitMQ?**
- Decouples webhook processing from HTTP response
- Enables multiple consumers for same events
- Provides reliability and message persistence
- Scales horizontally

**Event Flow:**
1. GitHub webhook received by `webhooks.controller`
2. Event published to RabbitMQ exchange `github.events`
3. Multiple consumers can subscribe:
   - Notification consumer (sends emails)
   - Analytics consumer (tracks events)
   - Logging consumer (audit trail)

**Topic-Based Routing:**
```
github.events.*
├── pull_request.opened
├── pull_request.closed
├── push
├── issues.created
└── (other GitHub event types)
```

---

### 5. Database Strategy

**TypeORM as ORM:**
- Database-agnostic query builder
- Automatic type checking
- Migration system for schema versioning

**Entities:**
- `User` - GitHub user information
- `Repository` - Synced repositories
- `PullRequest` - PR tracking
- `Webhook` - Registered webhooks
- `Notification` - Notification preferences

**Migrations:**
```bash
# Generate migration after schema changes
npm run backend:migration:generate

# Run pending migrations
npm run backend:migration:run

# Revert last migration
npm run backend:migration:revert
```

---

### 6. Error Handling Strategy

**Global Exception Filter:**

Located in `@github-web-integration/common` library:
- Catches all exceptions globally
- Transforms exceptions to consistent JSON response
- Logs errors for debugging
- Returns appropriate HTTP status codes

```typescript
// All services throw exceptions
// Filter catches and formats them
// Frontend receives consistent error structure
```

---

### 7. Configuration Management

**Environment Variables:**

```bash
# GitHub OAuth
GITHUB_CLIENT_ID=xxxx
GITHUB_CLIENT_SECRET=xxxx
GITHUB_BASE_URL=https://github.com
GUTHUB_API_BASE_URL=https://api.github.com

# Authentication
JWT_SECRET=your-secret-key
APP_FRONTEND_BASE_URL=http://localhost:3000

# Database
DATABSE_HOST=localhost
DATABASE_PORT=3306
DATABSE_USERNAME=root
DATABSE_PASSWORD=password
DB_NAME=github_integration

# RabbitMQ
AMQP_URI=amqp://guest:guest@localhost:5672
```

**Configuration Modules:**
- `github.config.ts` - GitHub-specific settings
- `auth.config.ts` - Authentication settings
- `config.config.ts` - System settings

**Benefits:**
- Centralized configuration
- Environment-specific overrides
- Type-safe config injection
- DI-friendly approach

---

## Configuration

### Development Setup

**Prerequisites:**
- Node.js 18+
- npm 9+
- MySQL 8.0+
- RabbitMQ 3.8+
- ngrok (for local webhook testing)

**Environment File (.env):**
```env
# Copy .env.example to .env
# Fill in GitHub OAuth credentials
# Fill in database credentials
# Set JWT_SECRET to random string
```

**Installation:**
```bash
npm install
```

**Run Migrations:**
```bash
npm run backend:migration:run
```

**Start Development Servers:**
```bash
npm run serve              # Both backend and frontend
npm run serve:backend      # Backend only
npm run serve:frontend     # Frontend only
```

### Production Build

**Build:**
```bash
npx nx build backend
npx nx build frontend
```

**Deploy:**
- Backend: Deploy to Node.js hosting (Heroku, DigitalOcean, AWS)
- Frontend: Deploy to static hosting (Vercel, Netlify) or same Node.js server
- Database: Managed MySQL service
- RabbitMQ: Managed message queue service

---

## Deployment Guide

### Architecture Deployment Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                         Production                            │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────────┐     ┌──────────────────────────┐    │
│  │  CDN / Static Host  │     │  Docker Container        │    │
│  │  (Frontend - Next)  │     │  (Backend - NestJS)      │    │
│  │                     │     │                          │    │
│  │  - HTML/CSS/JS      │     │  - Node.js process       │    │
│  │  - SSR rendering    │     │  - All modules loaded    │    │
│  │  - Client-side code │     │  - Process manager (PM2) │    │
│  └─────────────────────┘     └──────────────────────────┘    │
│           │                              │                    │
│           │                              │                    │
│           └──────────────┬───────────────┘                    │
│                          │                                    │
│                          │ API calls                          │
│                          │ (JWT auth)                         │
│                          │                                    │
│        ┌─────────────────┴──────────────────┐                │
│        │                                    │                │
│        ▼                                    ▼                │
│  ┌──────────────┐                  ┌──────────────┐         │
│  │  MySQL 8.0   │                  │  RabbitMQ    │         │
│  │  (Managed)   │                  │  (Managed)   │         │
│  │              │                  │              │         │
│  │  - All data  │                  │  - Events    │         │
│  │  - Replicated│                  │  - Queues    │         │
│  └──────────────┘                  └──────────────┘         │
│                                                                │
├──────────────────────────────────────────────────────────────┤
│              External Services                                 │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────────┐      ┌────────────────────────────┐    │
│  │  GitHub API      │      │  SMTP Server (Email)       │    │
│  │  - OAuth         │      │  - Nodemailer integration  │    │
│  │  - REST/GraphQL  │      │  - Notification delivery   │    │
│  │  - Webhooks      │      │  - SendGrid/AWS SES/etc    │    │
│  └──────────────────┘      └────────────────────────────┘    │
│                                                                │
└──────────────────────────────────────────────────────────────┘
```

### Deployment Steps

**1. Backend Deployment (Docker)**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm ci --only=production
RUN npx nx build backend
ENV NODE_ENV=production
CMD ["node", "dist/apps/backend/main.js"]
```

**2. Environment Variables (Production)**
```env
NODE_ENV=production
JWT_SECRET=<random-secret-key>
GITHUB_CLIENT_ID=<prod-oauth-app-id>
GITHUB_CLIENT_SECRET=<prod-oauth-secret>
DATABASE_URL=<managed-mysql-connection>
AMQP_URI=<managed-rabbitmq-uri>
```

**3. Database Initialization**
```bash
# SSH into production server
npm run backend:migration:run
```

**4. Monitoring & Health Checks**
- Implement health check endpoint: `GET /health`
- Monitor logs via logging service
- Set up alerts for errors
- Monitor database connections
- Monitor RabbitMQ queue depth

---

## Development Best Practices

### Code Organization

1. **Each module is self-contained**
   - Controller (routes)
   - Service (business logic)
   - Module (exports/imports)
   - Entity (database model) if needed

2. **Shared logic goes to `shared/` libraries**
   - Don't duplicate code
   - Use HttpClient from `http-client` lib
   - Use Exception handlers from `common` lib

3. **Configuration is centralized**
   - All env vars accessed via `ConfigService`
   - Config modules in `config/` folder
   - Type-safe injection

### Testing

```bash
# Run all tests
npx nx test

# Test specific project
npx nx test backend

# Test with coverage
npx nx test backend --coverage

# E2E tests
npx nx e2e backend-e2e
```

### Linting & Formatting

```bash
# Lint all code
npx nx lint

# Fix linting issues
npx nx lint --fix

# Format code
npx nx format:write
```

---

## Troubleshooting

### Common Issues

**Issue: "No repositories showing on dashboard"**
- Check GitHub access token is stored in DB
- Verify GitHub API credentials
- Check user permissions on GitHub OAuth app

**Issue: "Webhooks not triggering notifications"**
- Verify RabbitMQ is running
- Check ngrok URL is correct in GitHub webhook settings
- Verify webhook secret matches `GITHUB_WEBHOOK_SECRET`
- Check notification consumer is running

**Issue: "Database migration errors"**
- Ensure all old migrations have been run
- Check TypeORM entities match database schema
- Verify MySQL connection string

**Issue: "Frontend not connecting to backend"**
- Check CORS configuration
- Verify API endpoint URL in frontend
- Check JWT cookie is being set
- Verify JWT_SECRET matches between frontend/backend

---

## Summary

This project implements a **modern, scalable GitHub integration platform** using:

✅ **Monorepo structure** for code organization and reuse  
✅ **OAuth 2.0 authentication** for secure user access  
✅ **NestJS backend** with modular architecture  
✅ **Next.js frontend** for server-side rendering  
✅ **TypeORM database** for reliable data persistence  
✅ **RabbitMQ** for asynchronous event processing  
✅ **GitHub webhooks** for real-time updates  
✅ **Email notifications** via Nodemailer  

The approach prioritizes **scalability, maintainability, and security** through thoughtful architecture decisions and industry best practices.

---

**Last Updated:** May 2026  
**Maintainers:** Development Team  
**Repository:** github-web-integration
