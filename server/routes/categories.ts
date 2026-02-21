import { Router } from "express";
import { db } from "../../src/db/index.js";
import { categories } from "../../src/db/schema.js";
import { asc, eq } from "drizzle-orm";
import { categorySchema } from "../../src/lib/validators.js";

const router = Router();

// GET /api/categories
router.get("/", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(categories)
      .orderBy(asc(categories.sortOrder));
    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// POST /api/categories
router.post("/", async (req, res) => {
  try {
    const result = categorySchema.safeParse(req.body);
    if (!result.success) {
      res
        .status(400)
        .json({ error: "Validation failed", details: result.error.flatten() });
      return;
    }
    const [created] = await db
      .insert(categories)
      .values(result.data)
      .returning();
    res.status(201).json(created);
  } catch (error) {
    console.error("Failed to create category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});

// PUT /api/categories/:id
router.put("/:id", async (req, res) => {
  try {
    const result = categorySchema.safeParse(req.body);
    if (!result.success) {
      res
        .status(400)
        .json({ error: "Validation failed", details: result.error.flatten() });
      return;
    }
    const [updated] = await db
      .update(categories)
      .set(result.data)
      .where(eq(categories.id, req.params.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.json(updated);
  } catch (error) {
    console.error("Failed to update category:", error);
    res.status(500).json({ error: "Failed to update category" });
  }
});

// DELETE /api/categories/:id
router.delete("/:id", async (req, res) => {
  try {
    const [deleted] = await db
      .delete(categories)
      .where(eq(categories.id, req.params.id))
      .returning();
    if (!deleted) {
      res.status(404).json({ error: "Category not found" });
      return;
    }
    res.status(204).end();
  } catch (error) {
    console.error("Failed to delete category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export default router;
