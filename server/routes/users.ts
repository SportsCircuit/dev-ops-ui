import { Router } from "express";
import { db } from "../../src/db/index.js";
import { portalUsers } from "../../src/db/schema.js";
import { desc, eq } from "drizzle-orm";
import {
  userSchema,
  userUpdateSchema,
} from "../../src/lib/validators.js";

/** Columns safe to return to the client (excludes passwordHash). */
const publicFields = {
  id: portalUsers.id,
  name: portalUsers.name,
  role: portalUsers.role,
  access: portalUsers.access,
  email: portalUsers.email,
  createdAt: portalUsers.createdAt,
  updatedAt: portalUsers.updatedAt,
};

const router = Router();

// GET /api/users
router.get("/", async (_req, res) => {
  try {
    const rows = await db
      .select(publicFields)
      .from(portalUsers)
      .orderBy(desc(portalUsers.createdAt));
    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// POST /api/users
router.post("/", async (req, res) => {
  try {
    const result = userSchema.safeParse(req.body);
    if (!result.success) {
      res
        .status(400)
        .json({ error: "Validation failed", details: result.error.flatten() });
      return;
    }
    const [created] = await db
      .insert(portalUsers)
      .values(result.data)
      .returning(publicFields);
    res.status(201).json(created);
  } catch (error) {
    console.error("Failed to create user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

// GET /api/users/:id
router.get("/:id", async (req, res) => {
  try {
    const [row] = await db
      .select(publicFields)
      .from(portalUsers)
      .where(eq(portalUsers.id, req.params.id));
    if (!row) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(row);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// PUT /api/users/:id
router.put("/:id", async (req, res) => {
  try {
    const result = userUpdateSchema.safeParse(req.body);
    if (!result.success) {
      res
        .status(400)
        .json({ error: "Validation failed", details: result.error.flatten() });
      return;
    }
    const [updated] = await db
      .update(portalUsers)
      .set({ ...result.data, updatedAt: new Date() })
      .where(eq(portalUsers.id, req.params.id))
      .returning(publicFields);
    if (!updated) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(updated);
  } catch (error) {
    console.error("Failed to update user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// DELETE /api/users/:id
router.delete("/:id", async (req, res) => {
  try {
    await db.delete(portalUsers).where(eq(portalUsers.id, req.params.id));
    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
