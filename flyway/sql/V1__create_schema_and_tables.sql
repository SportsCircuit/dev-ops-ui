-- ============================================================
-- V1 - Create ops schema and all application tables
-- ============================================================

-- 1. Schema
CREATE SCHEMA IF NOT EXISTS ops;

-- 2. Categories
CREATE TABLE IF NOT EXISTS ops.categories (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    sort_order  INTEGER     NOT NULL DEFAULT 0,
    created_at  TIMESTAMP   DEFAULT NOW(),
    updated_at  TIMESTAMP   DEFAULT NOW()
);

-- 3. Tools (FK → categories.name)
CREATE TABLE IF NOT EXISTS ops.tools (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(255) NOT NULL,
    description   TEXT         NOT NULL,
    category      VARCHAR(100) NOT NULL
                    REFERENCES ops.categories(name)
                    ON UPDATE CASCADE
                    ON DELETE RESTRICT,
    environments  JSONB       NOT NULL DEFAULT '[]',
    status        VARCHAR(50) NOT NULL DEFAULT 'unknown',
    url           TEXT,
    created_at    TIMESTAMP   DEFAULT NOW(),
    updated_at    TIMESTAMP   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS tools_category_idx ON ops.tools(category);

-- 4. Microservices
CREATE TABLE IF NOT EXISTS ops.microservices (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name         VARCHAR(255) NOT NULL,
    owner        VARCHAR(255) NOT NULL,
    version      VARCHAR(50)  NOT NULL,
    status       VARCHAR(50)  NOT NULL DEFAULT 'healthy',
    description  TEXT,
    tech_stack   JSONB,
    dependencies JSONB,
    repo_url     TEXT,
    swagger_url  TEXT,
    api_version  VARCHAR(50),
    api_type     VARCHAR(50),
    cpu          VARCHAR(50),
    memory       VARCHAR(50),
    pods         VARCHAR(50),
    created_at   TIMESTAMP   DEFAULT NOW(),
    updated_at   TIMESTAMP   DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS microservices_status_idx ON ops.microservices(status);

-- 5. Portal Users
CREATE TABLE IF NOT EXISTS ops.portal_users (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    role        VARCHAR(50)  NOT NULL,
    access      JSONB       NOT NULL DEFAULT '[]',
    created_at  TIMESTAMP   DEFAULT NOW(),
    updated_at  TIMESTAMP   DEFAULT NOW()
);
