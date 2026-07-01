import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Partner from "@/models/Partner";
import { verifyToken } from "@/lib/jwt";

// ✅ PATCH - Update partner status
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }  // ← Promise type
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
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    // ✅ Await params
    const { id } = await params;

    const { status } = await req.json();
    const validStatuses = ["Pending", "Approved", "Rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    await connectDB();

    const partner = await Partner.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!partner) {
      return NextResponse.json(
        { success: false, message: "Partner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, partner });
  } catch (error) {
    console.error("Update Partner Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}