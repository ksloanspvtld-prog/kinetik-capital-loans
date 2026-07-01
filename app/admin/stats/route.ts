import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import Partner from "@/models/Partner";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
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

    await connectDB();

    const [totalLeads, pendingLeads, totalPartners, pendingPartners, totalUsers] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: "pending" }),
      Partner.countDocuments(),
      Partner.countDocuments({ status: "pending" }),
      User.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalLeads,
        pendingLeads,
        totalPartners,
        pendingPartners,
        totalUsers,
      },
    });
  } catch (error) {
    console.error("Stats Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}