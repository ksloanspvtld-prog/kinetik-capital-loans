import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    console.log("BODY RECEIVED:", body);

    const lead = await Lead.create(body);

    console.log("LEAD SAVED:", lead);

    return NextResponse.json({
      success: true,
      lead,
    });
  } catch (error) {
    console.log("POST ERROR:", error);

    return NextResponse.json(
      {
        success: false,
      },
      { status: 500 }
    );
  }
}