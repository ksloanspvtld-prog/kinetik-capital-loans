import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
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

    const leads = await Lead.find({}).sort({ createdAt: 1 });

    // Cohort by month
    const cohorts: Record<string, { total: number; converted: number }> = {};

    leads.forEach((lead) => {
      if (lead.createdAt) {
        const month = new Date(lead.createdAt).toISOString().slice(0, 7);
        if (!cohorts[month]) {
          cohorts[month] = { total: 0, converted: 0 };
        }
        cohorts[month].total++;
        if (lead.status === "Approved") {
          cohorts[month].converted++;
        }
      }
    });

    const cohortData = Object.entries(cohorts).map(([month, data]) => ({
      month,
      total: data.total,
      converted: data.converted,
      rate: data.total > 0 ? Math.round((data.converted / data.total) * 100) : 0,
    }));

    return NextResponse.json({
      success: true,
      cohorts: cohortData,
    });
  } catch (error) {
    console.error("Cohort error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}