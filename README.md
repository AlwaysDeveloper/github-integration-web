# GitHub Web Integration

A scalable **NestJS backend** monorepo for integrating with the GitHub API — built with [Nx](https://nx.dev), TypeScript, and structured for enterprise-grade development.

---

## Table of Contents

- [GitHub Web Integration](#github-web-integration)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Architecture](#architecture)
    - [How it works](#how-it-works)
  - [Project Structure](#project-structure)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Run the development server](#run-the-development-server)
    - [Build for production](#build-for-production)
  - [Available Scripts](#available-scripts)
  - [Configuration](#configuration)
    - [TypeScript](#typescript)
    - [Nx](#nx)
    - [ESLint](#eslint)
  - [Development Tooling](#development-tooling)
    - [Nx Console (recommended)](#nx-console-recommended)
    - [Adding new apps or libraries](#adding-new-apps-or-libraries)
    - [CI with Nx Cloud](#ci-with-nx-cloud)
  - [Contributing](#contributing)
  - [License](#license)

---

## Overview

`github-integration-web` is a monorepo workspace that provides a NestJS-powered backend service for integrating with GitHub's web APIs. The workspace is managed by **Nx** (v22.7), enabling modular project organization, intelligent build caching, and scalable CI/CD pipelines.

The backend is built on the NestJS framework with full TypeScript support, `axios` for HTTP communication, and `rxjs` for reactive programming patterns.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Nx Monorepo Workspace              │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │              apps/                           │   │
│  │                                             │   │
│  │  ┌──────────────────┐  ┌─────────────────┐ │   │
│  │  │    backend/       │  │  backend-e2e/   │ │   │
│  │  │  (NestJS App)     │  │  (E2E Tests)    │ │   │
│  │  │                  │  │                 │ │   │
│  │  │  ┌────────────┐  │  └─────────────────┘ │   │
│  │  │  │ Controllers│  │                       │   │
│  │  │  ├────────────┤  │                       │   │
│  │  │  │  Services  │  │                       │   │
│  │  │  ├────────────┤  │                       │   │
│  │  │  │  Modules   │  │                       │   │
│  │  │  └────────────┘  │                       │   │
│  │  │        │         │                       │   │
│  │  │        ▼         │                       │   │
│  │  │  ┌──────────┐    │                       │   │
│  │  │  │  Axios   │    │                       │   │
│  │  │  │ (GitHub  │    │                       │   │
│  │  │  │   API)   │    │                       │   │
│  │  │  └──────────┘    │                       │   │
│  │  └──────────────────┘                       │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │           Shared Tooling & Config            │   │
│  │  ESLint · Prettier · Jest · TypeScript       │   │
│  │  Webpack · SWC Compiler · Nx Plugins         │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### How it works

1. **Nx Workspace** is the root orchestrator. It manages all applications under `apps/`, handles task caching, dependency graphs, and CI pipelines.
2. **Backend App** (`apps/backend`) is a NestJS application. It follows NestJS's module-based architecture — dividing functionality into `Modules`, `Controllers` (handling HTTP routes), and `Services` (containing business logic).
3. **GitHub API Integration** happens via `axios`, which is used inside NestJS services to make HTTP calls to GitHub's REST or GraphQL API.
4. **E2E Tests** live in `apps/backend-e2e` and are excluded from the standard Jest run (they have their own pipeline step).
5. **Build & Serve** are powered by `@nx/webpack` and `@nx/nest` plugins, providing optimized production builds and hot-reload dev servers.

---

## Project Structure

```
github-integration-web/
├── apps/
│   ├── backend/                  # NestJS backend application
│   │   └── src/
│   │       ├── app/              # App module, controllers, services
│   │       └── main.ts           # Entry point
│   └── backend-e2e/              # End-to-end test suite
├── .vscode/                      # Editor settings
├── .editorconfig                 # Cross-editor formatting
├── .prettierrc                   # Prettier config
├── .prettierignore
├── eslint.config.mjs             # Flat ESLint config with Nx module boundary rules
├── jest.config.ts                # Root Jest config
├── jest.preset.js                # Shared Jest preset
├── nx.json                       # Nx workspace config (plugins, targets, caching)
├── package.json                  # Root dependencies & npm workspaces
├── tsconfig.base.json            # Shared TypeScript compiler options
└── tsconfig.json                 # Root TS config
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | LTS |
| Framework | NestJS | ^11.0.0 |
| Language | TypeScript | ~5.9 |
| HTTP Client | Axios | ^1.6.0 |
| Reactive | RxJS | ^7.8.0 |
| Monorepo | Nx | 22.7.1 |
| Bundler | Webpack (via @nx/webpack) | ^5 |
| Compiler | SWC | ~1.15 |
| Testing | Jest | ^30.0 |
| Linting | ESLint (flat config) | ^9.8 |
| Formatting | Prettier | ~3.6 |

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/AlwaysDeveloper/github-integration-web.git
cd github-integration-web

# Install dependencies
npm install
```

### Run the development server

```bash
npx nx serve backend
```

The backend will start in watch mode. By default it runs on `http://localhost:3000`.

### Build for production

```bash
npx nx build backend
```

Output will be in `dist/apps/backend`.

---

## Available Scripts

| Command | Description |
|---|---|
| `npx nx serve backend` | Start dev server with hot reload |
| `npx nx build backend` | Create production bundle |
| `npx nx test backend` | Run unit tests for the backend |
| `npx nx lint backend` | Lint the backend app |
| `npx nx typecheck backend` | Run TypeScript type checking |
| `npx nx show project backend` | Show all available Nx targets |
| `npx nx graph` | Visualize the project dependency graph |
| `npx nx connect` | Connect workspace to Nx Cloud for remote caching |

---

## Configuration

### TypeScript

The `tsconfig.base.json` at the root defines shared compiler options used across all apps and libraries:

- **Target**: `ES2022`
- **Module**: `NodeNext` (with `moduleResolution: nodenext`)
- **Strict mode** enabled
- `noUnusedLocals`, `noImplicitReturns`, `noImplicitOverride` — all enforced

### Nx

`nx.json` configures the workspace with four plugins:

- `@nx/js/typescript` — TypeScript build & typecheck targets
- `@nx/webpack/plugin` — Build, serve, and preview targets
- `@nx/eslint/plugin` — Lint target for all projects
- `@nx/jest/plugin` — Test target (excludes `backend-e2e`)

Test tasks depend on the build completing first (`"dependsOn": ["^build"]`).

### ESLint

Uses the new **flat config** format (`eslint.config.mjs`) with:
- Nx module boundary enforcement (`@nx/enforce-module-boundaries`)
- TypeScript-aware rules via `@nx/eslint-plugin`
- Prettier integration

---

## Development Tooling

### Nx Console (recommended)

Install the [Nx Console extension](https://nx.dev/getting-started/editor-setup) for VS Code or IntelliJ to browse generators, run tasks, and visualize the project graph from your IDE.

### Adding new apps or libraries

```bash
# Generate a new NestJS application
npx nx g @nx/nest:app my-new-app

# Generate a shared library
npx nx g @nx/node:lib my-shared-lib
```

### CI with Nx Cloud

For faster CI using remote caching and distributed task execution:

```bash
npx nx connect
npx nx g ci-workflow
```

---

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

Please ensure `lint`, `typecheck`, and `test` all pass before submitting.

---

## License

MIT © [AlwaysDeveloper](https://github.com/AlwaysDeveloper)
