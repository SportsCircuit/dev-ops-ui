-- Add authentication columns to portal_users
ALTER TABLE ops.portal_users ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
ALTER TABLE ops.portal_users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
