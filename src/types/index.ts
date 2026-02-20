export type Environment = "Dev" | "QA" | "Stage" | "Prod";

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
