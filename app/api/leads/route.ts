import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { sendLeadConfirmationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, mobile, email, city, state, pincode, loanType, monthlyIncome } = body;

    // Validation
    if (!fullName || !mobile || !loanType) {
      return NextResponse.json(
        { success: false, message: "Name, Mobile and Loan Type are required" },
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

    const lead = await Lead.create({
      fullName,
      mobile,
      email: email || "",
      city: city || "",
      state: state || "",
      pincode: pincode || "",
      loanType,
      monthlyIncome: monthlyIncome || "",
      status: "New",
    });

    // ✅ Send confirmation email if email is provided
    if (email) {
      try {
        await sendLeadConfirmationEmail(email, fullName, loanType, lead._id.toString());
        console.log("✅ Confirmation email sent to", email);
      } catch (emailError) {
        console.error("❌ Failed to send email:", emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Lead submitted successfully!",
      lead,
    });
  } catch (error) {
    console.error("Lead submit error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit. Please try again." },
      { status: 500 }
    );
  }
}