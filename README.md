# DevOps Portal UI

A centralized DevOps dashboard built with React, Vite, Express, PostgreSQL, and Drizzle ORM. Manage tools, microservices, and portal users across environments (Local, Dev, QA, Stage, Prod).

## Tech Stack

| Layer      | Technology                           |
| ---------- | ------------------------------------ |
| Frontend   | React 19 + Vite 6                    |
| Routing    | React Router 7                       |
| Backend    | Express 5 (TypeScript via tsx)       |
| Language   | TypeScript 5                         |
| Styling    | Tailwind CSS 4                       |
| Database   | PostgreSQL 16                        |
| ORM        | Drizzle ORM                          |
| Migrations | Flyway 11                            |
| Runtime    | Node.js 22+                          |
| Container  | Docker Compose                       |

## Prerequisites

- **Node.js** >= 22
- **npm** >= 11
- **Docker Desktop** (for PostgreSQL + Flyway)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example env file and adjust values if needed:

```bash
cp .env.example .env.local
```

Default values in `.env.local`:

```env
DATABASE_URL=postgresql://sports:sports_secret@localhost:5432/sports_circuit?search_path=ops
DB_USER=sports
DB_PASSWORD=sports_secret
DB_NAME=sports_circuit
DB_PORT=5432
APP_ENV=local
```

### 3. Start the database

This app shares the PostgreSQL instance (`sc-postgres`) managed by the parent SportsCircuit Docker stack. Make sure it's running:

```bash
# From the SportsCircuit root (if not already running)
docker compose up -d
```

### 4. Run Flyway migrations

```bash
npm run flyway:migrate
```

This connects to `sc-postgres` via the `sports-circuit-net` Docker network and runs all SQL migrations from `flyway/sql/` into the `ops` schema (creates tables, seeds data, adds triggers).

### 5. Start the development server

```bash
npm run dev
```

This starts both the Vite dev server (port 3000) and the Express API server (port 3001) concurrently. Vite proxies `/api` requests to Express.

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Sign in

The app requires authentication. After seeding, use any of these demo accounts:

| Email                  | Password      | Role   |
| ---------------------- | ------------- | ------ |
| alice@devportal.io     | password123   | Admin  |
| bob@devportal.io       | password123   | DevOps |
| charlie@devportal.io   | password123   | Dev    |
| dana@devportal.io      | password123   | QA     |

> **Note:** Only the **Admin** role can access the Settings page and perform create / update / delete operations.

## Available Scripts

### Application

| Script            | Command                                      | Description                              |
| ----------------- | -------------------------------------------- | ---------------------------------------- |
| `npm run dev`     | `concurrently server:dev + client:dev`       | Start both API & Vite with hot reload    |
| `npm run client:dev` | `vite`                                    | Start Vite dev server only (port 3000)   |
| `npm run server:dev` | `tsx watch server/index.ts`               | Start Express API with watch (port 3001) |
| `npm run build`   | `tsc -b && vite build`                       | Type-check and create production build   |
| `npm run preview` | `vite preview`                               | Preview production build locally         |
| `npm run lint`    | `eslint src/ server/`                        | Run ESLint                               |

### Docker

PostgreSQL is managed by the parent SportsCircuit stack (`sc-postgres`). This project only runs Flyway for migrations.

### Flyway Migrations

| Script                 | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `npm run flyway:migrate` | Run pending migrations                       |
| `npm run flyway:info`    | Show migration status                        |
| `npm run flyway:validate`| Validate applied migrations against scripts  |
| `npm run flyway:repair`  | Repair migration checksums / failed entries  |

### Drizzle ORM

| Script             | Description                                      |
| ------------------ | ------------------------------------------------ |
| `npm run db:generate` | Generate migration SQL from schema changes    |
| `npm run db:migrate`  | Apply Drizzle migrations                      |
| `npm run db:push`     | Push schema directly (dev only)               |
| `npm run db:studio`   | Open Drizzle Studio (visual DB browser)       |

## Project Structure

```
├── server/
│   ├── index.ts                     # Express server entry point
│   ├── middleware/
│   │   └── auth.ts                  # JWT authenticate & requireAdmin
│   └── routes/
│       ├── categories.ts            # GET/POST categories
│       ├── health.ts                # Health check endpoint
│       ├── microservices.ts         # CRUD microservices
│       ├── auth.ts                  # Login & profile endpoints
│       ├── seed.ts                  # POST seed database
│       ├── tools.ts                 # CRUD tools
│       └── users.ts                 # CRUD users
├── src/
│   ├── main.tsx                     # React entry point
│   ├── App.tsx                      # React Router routes
│   ├── globals.css                  # Global styles (Tailwind)
│   ├── components/                  # React components
│   ├── db/
│   │   ├── index.ts                 # Database connection (Drizzle)
│   │   └── schema.ts               # Drizzle schema definitions
│   ├── lib/
│   │   ├── api.ts                   # Frontend API service layer
│   │   ├── constants.tsx            # App constants
│   │   └── validators.ts           # Zod validators
│   └── types/
│       └── index.ts                 # TypeScript type definitions
├── db/
│   └── init/
│       └── 01-init.sql              # Docker entrypoint: creates ops schema
├── flyway/
│   ├── conf/
│   │   └── flyway.conf              # Flyway configuration
│   └── sql/
│       ├── V1__create_schema_and_tables.sql
│       ├── V2__seed_data.sql
│       ├── V3__add_updated_at_trigger.sql
│       └── V4__add_auth_columns.sql
├── index.html                       # SPA entry point
├── vite.config.ts                   # Vite configuration
├── docker-compose.yml               # Flyway service
├── drizzle.config.ts                # Drizzle Kit configuration
└── .env.local                       # Environment variables
```

## API Endpoints

| Method | Endpoint                 | Description              |
| ------ | ------------------------ | ------------------------ |
| GET    | `/api/health`            | Health check             |
| POST   | `/api/auth/login`        | Sign in (email+password) |
| GET    | `/api/auth/me`           | Current user profile     |
| GET    | `/api/categories`        | List all categories      |
| POST   | `/api/categories`        | Create a category        |
| GET    | `/api/tools`             | List all tools           |
| POST   | `/api/tools`             | Create a tool            |
| GET    | `/api/tools/:id`         | Get tool by ID           |
| PUT    | `/api/tools/:id`         | Update a tool            |
| DELETE | `/api/tools/:id`         | Delete a tool            |
| GET    | `/api/microservices`     | List all microservices   |
| POST   | `/api/microservices`     | Create a microservice    |
| GET    | `/api/microservices/:id` | Get microservice by ID   |
| PUT    | `/api/microservices/:id` | Update a microservice    |
| DELETE | `/api/microservices/:id` | Delete a microservice    |
| GET    | `/api/users`             | List all users           |
| POST   | `/api/users`             | Create a user            |
| GET    | `/api/users/:id`         | Get user by ID           |
| PUT    | `/api/users/:id`         | Update a user            |
| DELETE | `/api/users/:id`         | Delete a user            |
| POST   | `/api/seed`              | Seed database (non-prod) |

> All endpoints except `/api/health`, `/api/auth/*`, and `/api/seed` require a valid JWT in the `Authorization: Bearer <token>` header. Non-GET methods additionally require the **Admin** role.

## Adding a New Flyway Migration

1. Create a new file in `flyway/sql/` following the naming convention:
   ```
   V<next_number>__<description>.sql
   ```
   Example: `V4__add_notifications_table.sql`

2. Run the migration:
   ```bash
   npm run flyway:migrate
   ```

3. Verify:
   ```bash
   npm run flyway:info
   ```

## Environment Support

The application is designed as a single deployable artifact configured per environment via environment variables:

| Variable       | Description                | Example                                |
| -------------- | -------------------------- | -------------------------------------- |
| `DATABASE_URL` | Full PostgreSQL connection | `postgresql://user:pass@host:5432/db?search_path=ops` |
| `DB_USER`      | Database user              | `sports`                               |
| `DB_PASSWORD`  | Database password          | `sports_secret`                        |
| `DB_NAME`      | Database name              | `sports_circuit`                       |
| `DB_PORT`      | Exposed PostgreSQL port    | `5432`                                 |
| `APP_ENV`      | Environment label          | `local` / `dev` / `qa` / `stage` / `prod` |
