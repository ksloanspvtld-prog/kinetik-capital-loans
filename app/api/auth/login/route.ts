import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { email, mobile, password } = await req.json();

    // ✅ Validation - at least one identifier
    if (!email && !mobile) {
      return NextResponse.json(
        { success: false, message: "Email or mobile is required" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ Find user
    const user = await User.findOne({
      $or: [
        { email: email?.toLowerCase() },
        { mobile },
      ],
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Check if email is verified (optional - you can skip this)
    // if (!user.isVerified) {
    //   return NextResponse.json(
    //     { success: false, message: "Please verify your email first" },
    //     { status: 403 }
    //   );
    // }

    // ✅ Generate JWT
    const token = generateToken(user._id.toString(), user.role);

    return NextResponse.json({
      success: true,
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}