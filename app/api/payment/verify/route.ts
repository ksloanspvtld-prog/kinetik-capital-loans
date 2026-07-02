import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function POST(req: Request) {
  try {
    const { orderId, paymentId, signature, leadId } = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      return NextResponse.json(
        { success: false, message: "Invalid signature" },
        { status: 400 }
      );
    }

    await connectDB();

    const lead = await Lead.findById(leadId);
    if (lead) {
      lead.paymentStatus = "Paid";
      lead.paymentId = paymentId;
      await lead.save();
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Payment verify error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}