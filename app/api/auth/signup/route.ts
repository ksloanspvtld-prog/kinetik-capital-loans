import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { generateVerificationToken, generateToken } from "@/lib/jwt";
// import { sendVerificationEmail, sendWelcomeEmail } from "@/lib/email"; // हे तात्पुरते comment करा

export async function POST(req: Request) {
  try {
    const { fullName, email, mobile, password } = await req.json();

    // ✅ Validation
    if (!fullName || !email || !mobile || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 6 characters" },
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

    // ✅ Check if user exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { mobile }],
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? "Email" : "Mobile";
      return NextResponse.json(
        { success: false, message: `${field} already registered` },
        { status: 400 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user (सुरुवातीला isVerified true करा)
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      mobile,
      password: hashedPassword,
      role: email === "ksloanspvtld@gmail.com" ? "admin" : "customer",
      isVerified: true, // ⬅️ Email verification skip
      verificationToken: null,
    });

    // ⬇️ Email sending skip करा (तात्पुरते)
    // await sendVerificationEmail(email, verificationToken, fullName);

    // ✅ Generate JWT
    const token = generateToken(user._id.toString(), user.role);

    return NextResponse.json({
      success: true,
      message: "Account created successfully! (Email verification skipped)",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        isVerified: true,
      },
    });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}