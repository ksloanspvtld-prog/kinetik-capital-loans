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

    const { leadId, verified } = await req.json();

    await connectDB();

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
    }

    lead.kycStatus = verified ? "Verified" : "Rejected";
    
    // ✅ Add type annotation for 'doc'
    lead.kycDocuments.forEach((doc: { verified: boolean }) => {
      doc.verified = verified;
    });
    
    await lead.save();

    return NextResponse.json({
      success: true,
      message: `KYC ${verified ? "Verified" : "Rejected"} successfully`,
      kycStatus: lead.kycStatus,
    });
  } catch (error) {
    console.error("KYC verify error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}