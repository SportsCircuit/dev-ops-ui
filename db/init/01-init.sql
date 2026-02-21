-- ============================================================
-- DevOps Portal - Database Initialization Script
-- Executed automatically on first container startup via
-- Docker entrypoint (/docker-entrypoint-initdb.d/)
-- ============================================================

-- Create the 'ops' schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS ops;

-- Grant full privileges on the ops schema to the application user
GRANT ALL PRIVILEGES ON SCHEMA ops TO sports;
ALTER DEFAULT PRIVILEGES IN SCHEMA ops GRANT ALL ON TABLES TO sports;
ALTER DEFAULT PRIVILEGES IN SCHEMA ops GRANT ALL ON SEQUENCES TO sports;

-- Set default search_path so the app user sees 'ops' first
ALTER ROLE sports SET search_path TO ops, public;
