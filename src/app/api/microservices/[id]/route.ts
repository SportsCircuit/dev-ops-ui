import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { microservices } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/microservices/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [row] = await db
      .select()
      .from(microservices)
      .where(eq(microservices.id, id));
    if (!row) {
      return NextResponse.json(
        { error: "Microservice not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(row);
  } catch (error) {
    console.error("Failed to fetch microservice:", error);
    return NextResponse.json(
      { error: "Failed to fetch microservice" },
      { status: 500 }
    );
  }
}

// PUT /api/microservices/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const [updated] = await db
      .update(microservices)
      .set({
        name: body.name,
        owner: body.owner,
        version: body.version,
        status: body.status,
        description: body.description,
        techStack: body.techStack,
        dependencies: body.dependencies,
        repoUrl: body.repoUrl,
        swaggerUrl: body.swaggerUrl,
        apiVersion: body.apiVersion,
        apiType: body.apiType,
        cpu: body.cpu,
        memory: body.memory,
        pods: body.pods,
        updatedAt: new Date(),
      })
      .where(eq(microservices.id, id))
      .returning();
    if (!updated) {
      return NextResponse.json(
        { error: "Microservice not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update microservice:", error);
    return NextResponse.json(
      { error: "Failed to update microservice" },
      { status: 500 }
    );
  }
}

// DELETE /api/microservices/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.delete(microservices).where(eq(microservices.id, id));
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete microservice:", error);
    return NextResponse.json(
      { error: "Failed to delete microservice" },
      { status: 500 }
    );
  }
}
