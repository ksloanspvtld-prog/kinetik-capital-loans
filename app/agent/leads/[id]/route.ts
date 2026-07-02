import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { verifyToken } from "@/lib/jwt";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json();

    const validStatuses = ["New", "Contacted", "Processing", "Approved", "Rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    await connectDB();

    // ✅ Check if lead belongs to this agent
    const lead = await Lead.findOne({ _id: id, assignedAgent: decoded.id });
    if (!lead) {
      return NextResponse.json({ success: false, message: "Lead not found or not assigned" }, { status: 404 });
    }

    lead.status = status;
    await lead.save();

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Agent update error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}