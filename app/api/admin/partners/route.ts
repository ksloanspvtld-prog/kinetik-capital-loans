import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Partner from "@/models/Partner";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    // ✅ 1. Authorization check
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
        { success: false, message: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // ✅ 2. Get status filter from query
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "all";

    // ✅ 3. Build query
    const query = status === "all" ? {} : { status };

    // ✅ 4. Connect to DB and fetch partners
    await connectDB();
    const partners = await Partner.find(query)
      .sort({ createdAt: -1 })
      .lean(); // plain objects

    // ✅ 5. Return response
    return NextResponse.json({
      success: true,
      partners,
    });
  } catch (error) {
    console.error("❌ Partners API Error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}