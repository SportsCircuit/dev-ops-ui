import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  schemaFilter: ["ops"],
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      "postgresql://sports:sports_secret@localhost:5432/sports_circuit",
  },
});
