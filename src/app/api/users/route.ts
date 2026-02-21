import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { portalUsers } from "@/db/schema";
import { desc } from "drizzle-orm";

// GET /api/users - Get all users
export async function GET() {
  try {
    const rows = await db
      .select()
      .from(portalUsers)
      .orderBy(desc(portalUsers.createdAt));
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const [created] = await db
      .insert(portalUsers)
      .values({
        name: body.name,
        role: body.role,
        access: body.access,
      })
      .returning();
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
