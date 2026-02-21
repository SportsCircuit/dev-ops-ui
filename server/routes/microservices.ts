import { Router } from "express";
import { db } from "../../src/db/index.js";
import { microservices } from "../../src/db/schema.js";
import { desc, eq } from "drizzle-orm";
import {
  microserviceSchema,
  microserviceUpdateSchema,
} from "../../src/lib/validators.js";

const router = Router();

// GET /api/microservices
router.get("/", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(microservices)
      .orderBy(desc(microservices.createdAt));
    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch microservices:", error);
    res.status(500).json({ error: "Failed to fetch microservices" });
  }
});

// POST /api/microservices
router.post("/", async (req, res) => {
  try {
    const result = microserviceSchema.safeParse(req.body);
    if (!result.success) {
      res
        .status(400)
        .json({ error: "Validation failed", details: result.error.flatten() });
      return;
    }
    const [created] = await db
      .insert(microservices)
      .values(result.data)
      .returning();
    res.status(201).json(created);
  } catch (error) {
    console.error("Failed to create microservice:", error);
    res.status(500).json({ error: "Failed to create microservice" });
  }
});

// GET /api/microservices/:id
router.get("/:id", async (req, res) => {
  try {
    const [row] = await db
      .select()
      .from(microservices)
      .where(eq(microservices.id, req.params.id));
    if (!row) {
      res.status(404).json({ error: "Microservice not found" });
      return;
    }
    res.json(row);
  } catch (error) {
    console.error("Failed to fetch microservice:", error);
    res.status(500).json({ error: "Failed to fetch microservice" });
  }
});

// PUT /api/microservices/:id
router.put("/:id", async (req, res) => {
  try {
    const result = microserviceUpdateSchema.safeParse(req.body);
    if (!result.success) {
      res
        .status(400)
        .json({ error: "Validation failed", details: result.error.flatten() });
      return;
    }
    const [updated] = await db
      .update(microservices)
      .set({ ...result.data, updatedAt: new Date() })
      .where(eq(microservices.id, req.params.id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Microservice not found" });
      return;
    }
    res.json(updated);
  } catch (error) {
    console.error("Failed to update microservice:", error);
    res.status(500).json({ error: "Failed to update microservice" });
  }
});

// DELETE /api/microservices/:id
router.delete("/:id", async (req, res) => {
  try {
    await db.delete(microservices).where(eq(microservices.id, req.params.id));
    res.status(204).send();
  } catch (error) {
    console.error("Failed to delete microservice:", error);
    res.status(500).json({ error: "Failed to delete microservice" });
  }
});

export default router;
