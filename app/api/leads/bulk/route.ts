import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: Request) {
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

    const { leads } = await req.json();

    if (!leads || !Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json({ success: false, message: "No leads provided" }, { status: 400 });
    }

    await connectDB();

    const inserted = [];
    const failed = [];

    for (const lead of leads) {
      try {
        const newLead = await Lead.create({
          fullName: lead.fullName || lead.name || "",
          mobile: lead.mobile || lead.phone || "",
          email: lead.email || "",
          city: lead.city || "",
          state: lead.state || "",
          loanType: lead.loanType || "Personal Loan",
          monthlyIncome: lead.monthlyIncome || lead.income || "",
          status: lead.status || "New",
          notes: lead.notes || "",
          followUpDate: lead.followUpDate || "",
        });
        inserted.push(newLead);
      } catch (error) {
        failed.push({ ...lead, error: (error as Error).message });
      }
    }

    return NextResponse.json({
      success: true,
      message: `${inserted.length} leads imported, ${failed.length} failed`,
      inserted: inserted.length,
      failed: failed.length,
      failedDetails: failed,
    });
  } catch (error) {
    console.error("Bulk import error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}