import { pgTable, text, varchar, jsonb, uuid, timestamp } from "drizzle-orm/pg-core";

// Categories table
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  sortOrder: text("sort_order").notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tools table
export const tools = pgTable("tools", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  environments: jsonb("environments").$type<string[]>().notNull(),
  status: varchar("status", { length: 50 }).notNull().default("unknown"),
  url: text("url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Microservices table
export const microservices = pgTable("microservices", {
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
});

// Portal users table
export const portalUsers = pgTable("portal_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  access: jsonb("access").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
