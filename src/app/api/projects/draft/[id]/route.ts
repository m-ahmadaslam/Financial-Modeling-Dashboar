import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";
import type { Session } from "next-auth";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions as any) as Session | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const { id } = await context.params;
    const draft = await db.collection("project_drafts").findOne({
      _id: new ObjectId(id),
      userId: session.user.id
    });

    if (!draft) {
      return NextResponse.json({ error: "Draft not found" }, { status: 404 });
    }

    // Convert ObjectId to string for JSON serialization
    const serializedDraft = {
      ...draft,
      _id: draft._id.toString()
    };

    return NextResponse.json(serializedDraft);

  } catch (error) {
    console.error("Error loading draft:", error);
    return NextResponse.json({ error: "Failed to load draft" }, { status: 500 });
  }
}
