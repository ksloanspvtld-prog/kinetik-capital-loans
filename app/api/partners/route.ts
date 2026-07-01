// app/api/partners/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Partner from "@/models/Partner";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    // Check if partner already exists
    const existingPartner = await Partner.findOne({ mobile: body.mobile });
    if (existingPartner) {
      return NextResponse.json(
        { success: false, message: "This mobile number is already registered." },
        { status: 400 }
      );
    }

    const partner = await Partner.create(body);

    return NextResponse.json({
      success: true,
      message: "Partner registered successfully",
      partner,
    });
  } catch (error: any) {
    console.error("Error registering partner:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to register partner",
      },
      { status: 500 }
    );
  }
}