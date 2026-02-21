import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../../src/db/index.js";
import { portalUsers } from "../../src/db/schema.js";
import { eq } from "drizzle-orm";
import { loginSchema } from "../../src/lib/validators.js";
import {
  authenticate,
  JWT_SECRET,
  type AuthPayload,
} from "../middleware/auth.js";

const TOKEN_EXPIRY = "24h";

const router = Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res
      .status(400)
      .json({ error: "Validation failed", details: result.error.flatten() });
    return;
  }

  const { email, password } = result.data;

  try {
    const [user] = await db
      .select()
      .from(portalUsers)
      .where(eq(portalUsers.email, email));

    if (!user || !user.passwordHash) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const payload: AuthPayload = {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email!,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        access: user.access,
      },
    });
  } catch (error) {
    console.error("Login failed:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// GET /api/auth/me – returns the current user from the token
router.get("/me", authenticate, async (req, res) => {
  try {
    const [user] = await db
      .select()
      .from(portalUsers)
      .where(eq(portalUsers.id, req.user!.id));

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      access: user.access,
    });
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    res.status(500).json({ error: "Failed to fetch current user" });
  }
});

export default router;
