import { pgSchema, text, varchar, jsonb, uuid, timestamp, integer, index } from "drizzle-orm/pg-core";

// Define the 'ops' PostgreSQL schema
export const opsSchema = pgSchema("ops");

// Categories table
export const categories = opsSchema.table("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tools table
export const tools = opsSchema.table(
  "tools",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    category: varchar("category", { length: 100 })
      .notNull()
      .references(() => categories.name),
    environments: jsonb("environments").$type<string[]>().notNull(),
    status: varchar("status", { length: 50 }).notNull().default("unknown"),
    url: text("url"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("tools_category_idx").on(table.category)]
);

// Microservices table
export const microservices = opsSchema.table(
  "microservices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    owner: varchar("owner", { length: 255 }).notNull(),
    version: varchar("version", { length: 50 }).notNull(),
    status: varchar("status", { length: 50 }).notNull().default("healthy"),
    description: text("description"),
    techStack: jsonb("tech_stack").$type<string[]>(),
    dependencies: jsonb("dependencies").$type<{ name: string; type: string }[]>(),
    repoUrl: text("repo_url"),
    swaggerUrl: text("swagger_url"),
    apiVersion: varchar("api_version", { length: 50 }),
    apiType: varchar("api_type", { length: 50 }),
    cpu: varchar("cpu", { length: 50 }),
    memory: varchar("memory", { length: 50 }),
    pods: varchar("pods", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("microservices_status_idx").on(table.status)]
);

// Portal users table
export const portalUsers = opsSchema.table("portal_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  access: jsonb("access").$type<string[]>().notNull(),
  email: varchar("email", { length: 255 }).unique(),
  passwordHash: varchar("password_hash", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
