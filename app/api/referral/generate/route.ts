import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
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

    await connectDB();

    // Generate unique partner code
    const code = `KC${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const partner = await Partner.findOneAndUpdate(
      { userId: decoded.id },
      { partnerCode: code },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      partnerCode: code,
      referralLink: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}?ref=${code}`,
    });
  } catch (error) {
    console.error("Generate referral error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}