import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import Partner from "@/models/Partner";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
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

    await connectDB();

    const partner = await Partner.findOne({ userId: decoded.id });
    if (!partner) {
      return NextResponse.json({ success: false, message: "Partner not found" }, { status: 404 });
    }

    const leads = await Lead.find({ referredBy: decoded.id });
    const total = leads.length;
    const approved = leads.filter((l) => l.status === "Approved").length;
    const pending = leads.filter((l) => l.status === "New" || l.status === "Contacted" || l.status === "Processing").length;
    const commission = leads
      .filter((l) => l.status === "Approved" && l.commissionPaid)
      .reduce((sum, l) => sum + (l.commission || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalReferrals: total,
        approved,
        pending,
        totalCommission: commission,
        partnerCode: partner.partnerCode,
      },
    });
  } catch (error) {
    console.error("Referral stats error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}