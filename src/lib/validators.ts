import { z } from "zod";

// ─── Category ───────────────────────────────────────────

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  sortOrder: z.number().int().min(0).default(0),
});

// ─── Tool ───────────────────────────────────────────────

export const toolSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required").max(100),
  environments: z
    .array(z.enum(["Local", "Dev", "QA", "Stage", "Prod"]))
    .min(1, "At least one environment is required"),
  status: z
    .enum(["healthy", "warning", "error", "unknown"])
    .default("unknown"),
  url: z.string().url("Invalid URL").nullable().optional(),
});

export const toolUpdateSchema = toolSchema.partial();

// ─── Microservice ───────────────────────────────────────

export const microserviceSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  owner: z.string().min(1, "Owner is required").max(255),
  version: z.string().min(1, "Version is required").max(50),
  status: z
    .enum(["healthy", "maintenance", "degraded", "down"])
    .default("healthy"),
  description: z.string().nullable().optional(),
  techStack: z.array(z.string()).nullable().optional(),
  dependencies: z
    .array(z.object({ name: z.string(), type: z.string() }))
    .nullable()
    .optional(),
  repoUrl: z.string().nullable().optional(),
  swaggerUrl: z.string().nullable().optional(),
  apiVersion: z.string().max(50).nullable().optional(),
  apiType: z.string().max(50).nullable().optional(),
  cpu: z.string().max(50).nullable().optional(),
  memory: z.string().max(50).nullable().optional(),
  pods: z.string().max(50).nullable().optional(),
});

export const microserviceUpdateSchema = microserviceSchema.partial();

// ─── User ───────────────────────────────────────────────

export const userSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  role: z.enum(["Admin", "DevOps", "Dev", "QA", "Viewer"]),
  access: z.array(z.enum(["Local", "Dev", "QA", "Stage", "Prod"])),
});

export const userUpdateSchema = userSchema.partial();
