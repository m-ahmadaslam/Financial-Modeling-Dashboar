import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";
import type { Session } from "next-auth";

// Save draft
export async function POST(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions as any) as Session | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { formData, currentStep, projectId, status = "draft", version, parentProjectId } = await request.json();
    const { db } = await connectToDatabase();

    const draftData = {
      userId: session.user.id,
      formData,
      currentStep,
      lastSaved: new Date(),
      status,
      projectType: formData.projectType || "",
      projectName: formData.projectName || "Untitled Project",
      projectReference: formData.projectReference || "",
      country: formData.country || "",
      city: formData.city || "",
      stage: formData.stage || "",
      version: version || formData.version || "",
      lifecyclePhase: formData.lifecyclePhase || "estimation",
      parentProjectId: parentProjectId || null,
      bidDate: formData.bidDate || "",
      fcDate: formData.fcDate || "",
      cod: formData.cod || "",
      plantCapacityAC: formData.plantCapacityAC || "",
      plantCapacityDC: formData.plantCapacityDC || "",
      plf: formData.plf || "",
      degradationFirstYear: formData.degradationFirstYear || "",
      degradationSecondYear: formData.degradationSecondYear || "",
      degradationStartYear: formData.degradationStartYear || "",
      comments: [], // Initialize comments array
      // Add other fields as needed
    };

    let result;
    if (projectId) {
      // Update existing draft
      result = await db.collection("project_drafts").updateOne(
        { _id: new ObjectId(projectId), userId: session.user.id },
        { $set: draftData }
      );
    } else {
      // Create new draft
      result = await db.collection("project_drafts").insertOne(draftData);
    }

    if (projectId) {
      return NextResponse.json({
        success: true,
        projectId,
        message: "Draft updated successfully",
      });
    } else {
      const insertedId = (result as { insertedId?: { toString(): string } })?.insertedId?.toString();
      return NextResponse.json({
        success: true,
        projectId: insertedId,
        message: "Draft saved successfully",
      });
    }

  } catch (error) {
    console.error("Error saving draft:", error);
    return NextResponse.json({ error: "Failed to save draft" }, { status: 500 });
  }
}

// Get all drafts for user
export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions as any) as Session | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const drafts = await db.collection("project_drafts")
      .find({ userId: session.user.id })
      .sort({ lastSaved: -1 })
      .toArray();

    // Convert ObjectIds to strings for JSON serialization
    const serializedDrafts = drafts.map(draft => ({
      ...draft,
      _id: draft._id.toString(),
      parentProjectId: draft.parentProjectId ? draft.parentProjectId.toString() : null
    }));

    return NextResponse.json({ drafts: serializedDrafts });

  } catch (error) {
    console.error("Error fetching drafts:", error);
    return NextResponse.json({ error: "Failed to fetch drafts" }, { status: 500 });
  }
}

// Delete draft
export async function DELETE(request: NextRequest) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = await getServerSession(authOptions as any) as Session | null;
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("project_drafts").deleteOne({
      _id: new ObjectId(projectId),
      userId: session.user.id
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Project deleted successfully" });

  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
