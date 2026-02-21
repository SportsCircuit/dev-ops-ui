import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { microservices } from "@/db/schema";
import { desc } from "drizzle-orm";
import { microserviceSchema } from "@/lib/validators";

// GET /api/microservices - Get all microservices
export async function GET() {
  try {
    const rows = await db
      .select()
      .from(microservices)
      .orderBy(desc(microservices.createdAt));
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch microservices:", error);
    return NextResponse.json(
      { error: "Failed to fetch microservices" },
      { status: 500 }
    );
  }
}

// POST /api/microservices - Create a new microservice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = microserviceSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }
    const [created] = await db
      .insert(microservices)
      .values(result.data)
      .returning();
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Failed to create microservice:", error);
    return NextResponse.json(
      { error: "Failed to create microservice" },
      { status: 500 }
    );
  }
}
