import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Partner from "@/models/Partner";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 Partner Registration:", body);

    const { fullName, email, mobile, city, partnerType, experience } = body;

    // ✅ Validation
    if (!fullName || !email || !mobile || !city) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (mobile.length !== 10) {
      return NextResponse.json(
        { success: false, message: "Mobile number must be 10 digits" },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ Check existing
    const existing = await Partner.findOne({ mobile });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Mobile number already registered" },
        { status: 400 }
      );
    }

    // ✅ Create partner
    const partner = await Partner.create({
      fullName,
      email: email.toLowerCase(),
      mobile,
      city,
      partnerType: partnerType || "individual",
      experience: experience || "",
      status: "Pending",
    });

    console.log("✅ Partner created:", partner);

    return NextResponse.json({
      success: true,
      message: "Partner registration successful! We'll contact you soon.",
      partner,
    });
  } catch (error) {
    console.error("❌ Partner registration error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to register. Please try again." },
      { status: 500 }
    );
  }
}