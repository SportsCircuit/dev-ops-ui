import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL || "postgresql://admin:secret@localhost:5432/devops";

// For query purposes - connection pool
const queryClient = postgres(connectionString);

export const db = drizzle(queryClient, { schema });
