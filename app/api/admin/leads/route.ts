import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function GET() {
  try {
    await connectDB();

    const leads = await Lead.find({}).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      leads,
    });
  } catch (error) {
    console.error("Admin leads error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}