-- ============================================================
-- V3 - Auto-update updated_at on row modification
-- ============================================================

-- Reusable trigger function
CREATE OR REPLACE FUNCTION ops.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach to every table
CREATE TRIGGER trg_categories_updated_at
    BEFORE UPDATE ON ops.categories
    FOR EACH ROW EXECUTE FUNCTION ops.set_updated_at();

CREATE TRIGGER trg_tools_updated_at
    BEFORE UPDATE ON ops.tools
    FOR EACH ROW EXECUTE FUNCTION ops.set_updated_at();

CREATE TRIGGER trg_microservices_updated_at
    BEFORE UPDATE ON ops.microservices
    FOR EACH ROW EXECUTE FUNCTION ops.set_updated_at();

CREATE TRIGGER trg_portal_users_updated_at
    BEFORE UPDATE ON ops.portal_users
    FOR EACH ROW EXECUTE FUNCTION ops.set_updated_at();
