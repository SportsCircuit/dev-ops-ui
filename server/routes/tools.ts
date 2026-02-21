import { Router } from "express";
import { db } from "../../src/db/index.js";
import { tools } from "../../src/db/schema.js";
import { desc, eq } from "drizzle-orm";
import {
  toolSchema,
  toolUpdateSchema,
} from "../../src/lib/validators.js";

const router = Router();

// GET /api/tools
router.get("/", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(tools)
      .orderBy(desc(tools.createdAt));
    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch tools:", error);
    res.status(500).json({ error: "Failed to fetch tools" });
  }
});

// POST /api/tools
router.post("/", async (req, res) => {
  try {
    const result = toolSchema.safeParse(req.body);
    if (!result.success) {
      res
        .status(400)
        .json({ error: "Validation failed", details: result.error.flatten() });
      return;
    }
    const [created] = await db.insert(tools).values(result.data).returning();
    res.status(201).json(created);
  } catch (error) {
    console.error("Failed to create tool:", error);
    res.status(500).json({ error: "Failed to create tool" });
  }
});

// GET /api/tools/:id
router.get("/:id", async (req, res) => {
  try {
    const [row] = await db
      .select()
      .from(tools)
      .where(eq(tools.id, req.params.id));
    if (!row) {
      res.status(404).json({ error: "Tool not found" });
      return;
    }
    res.json(row);
  } catch (error) {
    console.error("Failed to fetch tool:", error);
    res.status(500).json({ error: "Failed to fetch tool" });
  }
});

// PUT /api/tools/:id
router.put("/:id", async (req, res) => {
  try {
    const result = toolUpdateSchema.safeParse(req.body);
    if (!result.success) {
      res
        .status(400)
        .json({ error: "Validation failed", details: result.error.flatten() });
      return;
    }
    const [updated] = await db
      .update(tools)
      .set({ ...result.data, updatedAt: new Date() })
      .where(eq(tools.id, req.params.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Tool not found" });
      return;
    }
    res.json(updated);
  } catch (error) {
    console.error("Failed to update tool:", error);
    res.status(500).json({ error: "Failed to update tool" });
  }
});

// DELETE /api/tools/:id
router.delete("/:id", async (req, res) => {
  try {
    await db.delete(tools).where(eq(tools.id, req.params.id));
    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete tool:", error);
    res.status(500).json({ error: "Failed to delete tool" });
  }
});

export default router;
