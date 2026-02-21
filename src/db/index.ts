import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://sports:sports_secret@localhost:5432/sports_circuit?search_path=ops";

// For query purposes - connection pool
const queryClient = postgres(connectionString);

export const db = drizzle(queryClient, { schema });
