import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { verifyToken } from "@/lib/jwt";

// ✅ PATCH - Update lead status
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }  // ← Promise type
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    // ✅ Await params
    const { id } = await params;

    const { status } = await req.json();
    const validStatuses = ["pending", "processing", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    await connectDB();

    const lead = await Lead.findByIdAndUpdate(id, { status }, { new: true });

    if (!lead) {
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Update Lead Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

// ✅ GET - Fetch single lead
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }  // ← Promise type
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    // ✅ Await params
    const { id } = await params;

    await connectDB();
    const lead = await Lead.findById(id);

    if (!lead) {
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Get Lead Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}