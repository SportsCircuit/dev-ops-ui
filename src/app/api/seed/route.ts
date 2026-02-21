import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories, tools, microservices, portalUsers } from "@/db/schema";
import { sql } from "drizzle-orm";

// Seed data - previously hardcoded values
const seedCategories = [
  { name: "All", sortOrder: "0" },
  { name: "Observability", sortOrder: "1" },
  { name: "Logging", sortOrder: "2" },
  { name: "Metrics", sortOrder: "3" },
  { name: "Tracing", sortOrder: "4" },
  { name: "Container", sortOrder: "5" },
  { name: "CI/CD", sortOrder: "6" },
  { name: "Messaging", sortOrder: "7" },
  { name: "Database", sortOrder: "8" },
  { name: "Documentation", sortOrder: "9" },
  { name: "Frontend", sortOrder: "10" },
  { name: "Health", sortOrder: "11" },
];

const seedTools = [
  {
    name: "Kibana",
    description: "Centralized logging and visualization for ELK stack.",
    category: "Logging",
    environments: ["Dev", "QA", "Prod"],
    status: "healthy",
    url: "#",
  },
  {
    name: "Splunk",
    description: "Enterprise operational intelligence and logging.",
    category: "Logging",
    environments: ["Prod"],
    status: "healthy",
    url: "#",
  },
  {
    name: "Grafana",
    description: "Metrics visualization and dashboards.",
    category: "Metrics",
    environments: ["Dev", "Prod"],
    status: "healthy",
    url: "#",
  },
  {
    name: "Prometheus",
    description: "Time-series database for monitoring metrics.",
    category: "Metrics",
    environments: ["Dev", "Prod"],
    status: "healthy",
    url: "#",
  },
  {
    name: "Jaeger",
    description: "End-to-end distributed tracing.",
    category: "Tracing",
    environments: ["Dev", "QA", "Prod"],
    status: "healthy",
    url: "#",
  },
  {
    name: "Kubernetes Dashboard",
    description: "Web-based Kubernetes user interface.",
    category: "Container",
    environments: ["Dev", "QA", "Stage", "Prod"],
    status: "warning",
    url: "#",
  },
  {
    name: "RHz OpenShift",
    description: "Enterprise Kubernetes container platform.",
    category: "Container",
    environments: ["Prod"],
    status: "healthy",
    url: "#",
  },
  {
    name: "Jenkins",
    description: "Automation server for building and deploying.",
    category: "CI/CD",
    environments: ["Dev", "QA", "Prod"],
    status: "healthy",
    url: "#",
  },
  {
    name: "ArgoCD",
    description: "Declarative GitOps continuous delivery tool for Kubernetes.",
    category: "CI/CD",
    environments: ["Dev", "Prod"],
    status: "healthy",
    url: "#",
  },
  {
    name: "Kafka Manager (AKHQ)",
    description: "GUI for Apache Kafka to manage topics and consumers.",
    category: "Messaging",
    environments: ["Dev", "QA", "Prod"],
    status: "healthy",
    url: "#",
  },
  {
    name: "Confluence",
    description: "Team collaboration and documentation.",
    category: "Documentation",
    environments: ["Prod"],
    status: "healthy",
    url: "#",
  },
  {
    name: "Swagger UI",
    description: "API documentation and testing.",
    category: "Documentation",
    environments: ["Dev", "QA", "Prod"],
    status: "healthy",
    url: "#",
  },
  {
    name: "Sentry",
    description: "Frontend error tracking and performance monitoring.",
    category: "Frontend",
    environments: ["Prod"],
    status: "healthy",
    url: "#",
  },
  {
    name: "Uptime Kuma",
    description: "Self-hosted monitoring tool.",
    category: "Health",
    environments: ["Prod"],
    status: "healthy",
    url: "#",
  },
];

const seedMicroservices = [
  {
    name: "User Service",
    owner: "Identity Team",
    version: "v1.0.0",
    status: "maintenance",
    description: "Manages user authentication and profiles",
    techStack: ["Node.js", "TypeScript", "Express", "Jest"],
    dependencies: [
      { name: "PostgreSQL", type: "Database" },
      { name: "Redis", type: "Cache" },
      { name: "Auth0", type: "External" },
    ],
    repoUrl: "https://github.com/org/user-service",
    swaggerUrl: "https://api.example.com/user/swagger",
    apiVersion: "OpenAPI 3.0",
    apiType: "REST",
    cpu: "1.3 vCPU",
    memory: "513Mi",
    pods: "12/12",
  },
  {
    name: "Payment Service",
    owner: "FinTech Team",
    version: "v2.0.4",
    status: "healthy",
    description: "Handles payment processing and transactions",
    techStack: ["Go", "gRPC", "Protobuf"],
    dependencies: [
      { name: "User Service", type: "Microservice" },
      { name: "Kafka", type: "MessageQueue" },
      { name: "Stripe API", type: "External" },
      { name: "PostgreSQL", type: "Database" },
    ],
    repoUrl: "https://github.com/org/payment-service",
    swaggerUrl: "https://api.example.com/payment/swagger",
    apiVersion: "OpenAPI 3.0",
    apiType: "REST",
    cpu: "2.5 vCPU",
    memory: "2Gi",
    pods: "15/15",
  },
  {
    name: "Inventory Service",
    owner: "Core Team",
    version: "v3.0.0",
    status: "down",
    description: "Tracks product stock and availability",
    techStack: ["Java", "Spring Boot", "Hibernate"],
    dependencies: [
      { name: "MongoDB", type: "Database" },
      { name: "Kafka", type: "MessageQueue" },
      { name: "S3", type: "Storage" },
    ],
    repoUrl: "https://github.com/org/inventory-service",
    swaggerUrl: "https://api.example.com/inventory/swagger",
    apiVersion: "OpenAPI 3.0",
    apiType: "REST",
    cpu: "0.9 vCPU",
    memory: "507Mi",
    pods: "8/8",
  },
];

const seedUsers = [
  {
    name: "Alice Admin",
    role: "Admin",
    access: ["Local", "Dev", "QA", "Stage", "Prod"],
  },
  {
    name: "Bob DevOps",
    role: "DevOps",
    access: ["Dev", "Stage", "Prod"],
  },
  {
    name: "Charlie Dev",
    role: "Dev",
    access: ["Local", "Dev"],
  },
  {
    name: "Dana QA",
    role: "QA",
    access: ["QA", "Stage"],
  },
];

// POST /api/seed - Seed the database with initial data
export async function POST() {
  try {
    // Clear existing data
    await db.delete(tools);
    await db.delete(microservices);
    await db.delete(portalUsers);
    await db.delete(categories);

    // Seed categories
    for (const cat of seedCategories) {
      await db.insert(categories).values(cat).onConflictDoNothing();
    }

    // Seed tools
    for (const tool of seedTools) {
      await db.insert(tools).values(tool);
    }

    // Seed microservices
    for (const service of seedMicroservices) {
      await db.insert(microservices).values(service);
    }

    // Seed users
    for (const user of seedUsers) {
      await db.insert(portalUsers).values(user);
    }

    // Get counts
    const [toolCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(tools);
    const [serviceCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(microservices);
    const [userCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(portalUsers);
    const [catCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(categories);

    return NextResponse.json({
      message: "Database seeded successfully",
      counts: {
        categories: catCount.count,
        tools: toolCount.count,
        microservices: serviceCount.count,
        users: userCount.count,
      },
    });
  } catch (error) {
    console.error("Failed to seed database:", error);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(error) },
      { status: 500 }
    );
  }
}
