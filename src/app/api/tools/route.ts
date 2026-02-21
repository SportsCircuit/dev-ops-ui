import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { tools } from "@/db/schema";
import { desc } from "drizzle-orm";
import { toolSchema } from "@/lib/validators";

// GET /api/tools - Get all tools
export async function GET() {
  try {
    const rows = await db
      .select()
      .from(tools)
      .orderBy(desc(tools.createdAt));
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch tools:", error);
    return NextResponse.json(
      { error: "Failed to fetch tools" },
      { status: 500 }
    );
  }
}

// POST /api/tools - Create a new tool
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = toolSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }
    const [created] = await db
      .insert(tools)
      .values(result.data)
      .returning();
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Failed to create tool:", error);
    return NextResponse.json(
      { error: "Failed to create tool" },
      { status: 500 }
    );
  }
}
