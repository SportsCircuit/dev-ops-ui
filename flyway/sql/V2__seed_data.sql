-- ============================================================
-- V2 - Seed initial reference / demo data
-- ============================================================

-- -------------------------------------------------------
-- Categories
-- -------------------------------------------------------
INSERT INTO ops.categories (name, sort_order) VALUES
    ('All',            0),
    ('Observability',  1),
    ('Logging',        2),
    ('Metrics',        3),
    ('Tracing',        4),
    ('Container',      5),
    ('CI/CD',          6),
    ('Messaging',      7),
    ('Database',       8),
    ('Documentation',  9),
    ('Frontend',      10),
    ('Health',        11)
ON CONFLICT (name) DO NOTHING;

-- -------------------------------------------------------
-- Tools
-- -------------------------------------------------------
INSERT INTO ops.tools (name, description, category, environments, status, url) VALUES
    ('Kibana',
     'Centralized logging and visualization for ELK stack.',
     'Logging',   '["Dev","QA","Prod"]'::jsonb, 'healthy', '#'),

    ('Splunk',
     'Enterprise operational intelligence and logging.',
     'Logging',   '["Prod"]'::jsonb, 'healthy', '#'),

    ('Grafana',
     'Metrics visualization and dashboards.',
     'Metrics',   '["Dev","Prod"]'::jsonb, 'healthy', '#'),

    ('Prometheus',
     'Time-series database for monitoring metrics.',
     'Metrics',   '["Dev","Prod"]'::jsonb, 'healthy', '#'),

    ('Jaeger',
     'End-to-end distributed tracing.',
     'Tracing',   '["Dev","QA","Prod"]'::jsonb, 'healthy', '#'),

    ('Kubernetes Dashboard',
     'Web-based Kubernetes user interface.',
     'Container', '["Dev","QA","Stage","Prod"]'::jsonb, 'warning', '#'),

    ('RHz OpenShift',
     'Enterprise Kubernetes container platform.',
     'Container', '["Prod"]'::jsonb, 'healthy', '#'),

    ('Jenkins',
     'Automation server for building and deploying.',
     'CI/CD',     '["Dev","QA","Prod"]'::jsonb, 'healthy', '#'),

    ('ArgoCD',
     'Declarative GitOps continuous delivery tool for Kubernetes.',
     'CI/CD',     '["Dev","Prod"]'::jsonb, 'healthy', '#'),

    ('Kafka Manager (AKHQ)',
     'GUI for Apache Kafka to manage topics and consumers.',
     'Messaging', '["Dev","QA","Prod"]'::jsonb, 'healthy', '#'),

    ('Confluence',
     'Team collaboration and documentation.',
     'Documentation', '["Prod"]'::jsonb, 'healthy', '#'),

    ('Swagger UI',
     'API documentation and testing.',
     'Documentation', '["Dev","QA","Prod"]'::jsonb, 'healthy', '#'),

    ('Sentry',
     'Frontend error tracking and performance monitoring.',
     'Frontend',  '["Prod"]'::jsonb, 'healthy', '#'),

    ('Uptime Kuma',
     'Self-hosted monitoring tool.',
     'Health',    '["Prod"]'::jsonb, 'healthy', '#');

-- -------------------------------------------------------
-- Microservices
-- -------------------------------------------------------
INSERT INTO ops.microservices
    (name, owner, version, status, description,
     tech_stack, dependencies,
     repo_url, swagger_url, api_version, api_type,
     cpu, memory, pods)
VALUES
    ('User Service',
     'Identity Team', 'v1.0.0', 'maintenance',
     'Manages user authentication and profiles',
     '["Node.js","TypeScript","Express","Jest"]'::jsonb,
     '[{"name":"PostgreSQL","type":"Database"},{"name":"Redis","type":"Cache"},{"name":"Auth0","type":"External"}]'::jsonb,
     'https://github.com/org/user-service',
     'https://api.example.com/user/swagger',
     'OpenAPI 3.0', 'REST',
     '1.3 vCPU', '513Mi', '12/12'),

    ('Payment Service',
     'FinTech Team', 'v2.0.4', 'healthy',
     'Handles payment processing and transactions',
     '["Go","gRPC","Protobuf"]'::jsonb,
     '[{"name":"User Service","type":"Microservice"},{"name":"Kafka","type":"MessageQueue"},{"name":"Stripe API","type":"External"},{"name":"PostgreSQL","type":"Database"}]'::jsonb,
     'https://github.com/org/payment-service',
     'https://api.example.com/payment/swagger',
     'OpenAPI 3.0', 'REST',
     '2.5 vCPU', '2Gi', '15/15'),

    ('Inventory Service',
     'Core Team', 'v3.0.0', 'down',
     'Tracks product stock and availability',
     '["Java","Spring Boot","Hibernate"]'::jsonb,
     '[{"name":"MongoDB","type":"Database"},{"name":"Kafka","type":"MessageQueue"},{"name":"S3","type":"Storage"}]'::jsonb,
     'https://github.com/org/inventory-service',
     'https://api.example.com/inventory/swagger',
     'OpenAPI 3.0', 'REST',
     '0.9 vCPU', '507Mi', '8/8');

-- -------------------------------------------------------
-- Portal Users
-- -------------------------------------------------------
INSERT INTO ops.portal_users (name, role, access) VALUES
    ('Alice Admin',  'Admin',  '["Local","Dev","QA","Stage","Prod"]'::jsonb),
    ('Bob DevOps',   'DevOps', '["Dev","Stage","Prod"]'::jsonb),
    ('Charlie Dev',  'Dev',    '["Local","Dev"]'::jsonb),
    ('Dana QA',      'QA',     '["QA","Stage"]'::jsonb);
