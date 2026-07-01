import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { sendWelcomeEmail } from "@/lib/email";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Verification token is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ Find user with verification token
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired verification token" },
        { status: 400 }
      );
    }

    // ✅ Update user
    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    // ✅ Send welcome email
    await sendWelcomeEmail(user.email, user.fullName);

    // ✅ Redirect to login page with success message
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login?verified=true`
    );
  } catch (error) {
    console.error("❌ Verification Error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}