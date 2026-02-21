import "dotenv/config";
import express, { type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import { authenticate, requireAdmin } from "./middleware/auth.js";
import categoriesRouter from "./routes/categories.js";
import toolsRouter from "./routes/tools.js";
import microservicesRouter from "./routes/microservices.js";
import usersRouter from "./routes/users.js";
import seedRouter from "./routes/seed.js";
import healthRouter from "./routes/health.js";

const app = express();
const PORT = parseInt(process.env.API_PORT || "3001", 10);

// Middleware
app.use(cors());
app.use(express.json());

// Public routes (no auth required)
app.use("/api/auth", authRouter);
app.use("/api/health", healthRouter);
app.use("/api/seed", seedRouter); // Public — has its own production guard

// All routes below require authentication
app.use("/api", authenticate);

// Write operations (POST, PUT, DELETE) require Admin role
app.use("/api", (req: Request, res: Response, next: NextFunction) => {
  if (req.method !== "GET") {
    requireAdmin(req, res, next);
  } else {
    next();
  }
});

// Routes
app.use("/api/categories", categoriesRouter);
app.use("/api/tools", toolsRouter);
app.use("/api/microservices", microservicesRouter);
app.use("/api/users", usersRouter);

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
