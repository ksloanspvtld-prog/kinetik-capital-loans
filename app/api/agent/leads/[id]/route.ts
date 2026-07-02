import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { verifyToken } from "@/lib/jwt";

// ============================================================
// GET – Fetch a single assigned lead (agent only)
// ============================================================
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Only agents and admins can view, but for simplicity we allow agent role
    if (decoded.role !== "agent" && decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    await connectDB();

    const lead = await Lead.findById(id);
    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 }
      );
    }

    // Check if the lead is assigned to this agent (or admin can see all)
    if (decoded.role === "agent" && lead.assignedAgent?.toString() !== decoded.id) {
      return NextResponse.json(
        { success: false, message: "You are not assigned to this lead" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Get agent lead error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// ============================================================
// PATCH – Update lead status (agent only, assigned leads)
// ============================================================
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Only agents (or admins) can update; for agent route we enforce agent role
    if (decoded.role !== "agent") {
      return NextResponse.json(
        { success: false, message: "Forbidden – Agent access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { status } = await req.json();

    // Validate status
    const validStatuses = ["New", "Contacted", "Processing", "Approved", "Rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find lead and check if assigned to this agent
    const lead = await Lead.findOne({ _id: id, assignedAgent: decoded.id });
    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Lead not found or not assigned to you" },
        { status: 404 }
      );
    }

    // Update status
    lead.status = status;
    await lead.save();

    // Optionally add to followUpHistory or notesHistory? Not required here.

    return NextResponse.json({
      success: true,
      message: `Lead status updated to ${status}`,
      lead,
    });
  } catch (error) {
    console.error("Agent update lead error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}