import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import Partner from "@/models/Partner";
import { verifyToken } from "@/lib/jwt";

export async function POST(req: Request) {
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

    const { leadId, documentType, url, panNumber, aadhaarNumber } = await req.json();

    await connectDB();

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
    }

    // Check if user owns this lead
    if (lead.userId?.toString() !== decoded.id && decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    // Add document
    lead.kycDocuments.push({
      type: documentType,
      url,
      verified: false,
      uploadedAt: new Date(),
    });

    if (panNumber) lead.panNumber = panNumber;
    if (aadhaarNumber) lead.aadhaarNumber = aadhaarNumber;

    lead.kycStatus = "Submitted";
    await lead.save();

    return NextResponse.json({
      success: true,
      message: "KYC documents uploaded successfully",
      kycStatus: lead.kycStatus,
    });
  } catch (error) {
    console.error("KYC upload error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}