import { Router } from "express";

const router = Router();

// GET /api/health
router.get("/", (_req, res) => {
  res.json({
    status: "ok",
    environment: process.env.APP_ENV || "local",
    timestamp: new Date().toISOString(),
  });
});

export default router;
