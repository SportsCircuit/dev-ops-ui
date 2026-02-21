import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { microservices } from "@/db/schema";
import { desc } from "drizzle-orm";

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
    const [created] = await db
      .insert(microservices)
      .values({
        name: body.name,
        owner: body.owner,
        version: body.version,
        status: body.status || "healthy",
        description: body.description || null,
        techStack: body.techStack || null,
        dependencies: body.dependencies || null,
        repoUrl: body.repoUrl || null,
        swaggerUrl: body.swaggerUrl || null,
        apiVersion: body.apiVersion || null,
        apiType: body.apiType || null,
        cpu: body.cpu || null,
        memory: body.memory || null,
        pods: body.pods || null,
      })
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
