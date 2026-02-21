import { NextResponse } from "next/server";

// GET /api/health - Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "ok",
    environment: process.env.APP_ENV || "local",
    timestamp: new Date().toISOString(),
  });
}
