export type Environment = "Local" | "Dev" | "QA" | "Stage" | "Prod";

export type ToolStatus = "healthy" | "warning" | "error" | "unknown";

export type Category =
  | "All"
  | "Observability"
  | "Logging"
  | "Metrics"
  | "Tracing"
  | "Container"
  | "CI/CD"
  | "Messaging"
  | "Database"
  | "Documentation"
  | "Frontend"
  | "Health";

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: Category;
  environments: Environment[];
  status: ToolStatus;
  url?: string;
}

export interface ToolSection {
  category: Category;
  tools: Tool[];
}

// Microservices types
export type ServiceStatus = "healthy" | "maintenance" | "degraded" | "down";

export type TechTab =
  | "health-check"
  | "architecture"
  | "repositories"
  | "swagger-endpoints"
  | "resources";

export type DependencyType =
  | "Database"
  | "Cache"
  | "External"
  | "Microservice"
  | "MessageQueue"
  | "Storage";

export interface ServiceDependency {
  name: string;
  type: DependencyType;
}

export interface Microservice {
  id: string;
  name: string;
  owner: string;
  version: string;
  status: ServiceStatus;
  description?: string;
  techStack?: string[];
  dependencies?: ServiceDependency[];
  repoUrl?: string;
  swaggerUrl?: string;
  apiVersion?: string;
  apiType?: string;
  cpu?: string;
  memory?: string;
  pods?: string;
}

// Settings / User Management types
export type UserRole = "Admin" | "DevOps" | "Dev" | "QA" | "Viewer";

export interface PortalUser {
  id: string;
  name: string;
  role: UserRole;
  access: Environment[];
}
