import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Partner from "@/models/Partner";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendDSAAprovalEmail } from "@/lib/email";

// ============================================================
// GET – Fetch a single partner
// ============================================================
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    await connectDB();

    const partner = await Partner.findById(id);
    if (!partner) {
      return NextResponse.json(
        { success: false, message: "Partner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, partner });
  } catch (error) {
    console.error("Get partner error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// ============================================================
// PATCH – Update partner status, notes, and create user on approval
// ============================================================
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { status, notes } = await req.json();

    const validStatuses = ["Pending", "Approved", "Rejected"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status" },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ Get partner first
    const partner = await Partner.findById(id);
    if (!partner) {
      return NextResponse.json(
        { success: false, message: "Partner not found" },
        { status: 404 }
      );
    }

    // ✅ Prepare update data
    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;

    // ✅ If status is "Approved" and user not yet created, create user account
    let generatedPassword = "";
    let user = null;

    if (status === "Approved") {
      // Check if user already exists
      user = await User.findOne({ email: partner.email });

      if (!user) {
        // ✅ Generate random password (8 characters)
        generatedPassword = crypto.randomBytes(8).toString("hex").slice(0, 8);
        const hashedPassword = await bcrypt.hash(generatedPassword, 10);

        // ✅ Create user with role "agent"
        user = await User.create({
          fullName: partner.fullName,
          email: partner.email,
          mobile: partner.mobile,
          password: hashedPassword,
          role: "agent",
          isVerified: true, // Auto-verified since admin approved
        });

        // ✅ Link user to partner
        updateData.userId = user._id;

        // ✅ Send approval email with credentials
        const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
        const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
        const dashboardLink = `${cleanBaseUrl}/agent`;

        try {
          await sendDSAAprovalEmail(
            partner.email,
            partner.fullName,
            generatedPassword,
            dashboardLink
          );
          console.log(`✅ DSA approval email sent to ${partner.email}`);
        } catch (emailError) {
          console.error("❌ Email send error:", emailError);
          // Don't fail the request, but log the error
        }
      } else {
        // ✅ User already exists, update role to agent if not already
        if (user.role !== "agent") {
          user.role = "agent";
          await user.save();
        }
        // Link user to partner
        updateData.userId = user._id;

        console.log(`✅ Partner ${partner.email} already has a user account`);
      }
    }

    // ✅ Update partner with all changes
    const updatedPartner = await Partner.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json({ success: true, partner: updatedPartner });
  } catch (error) {
    console.error("Update partner error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// ============================================================
// DELETE – Delete a partner (admin only)
// ============================================================
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    await connectDB();

    const partner = await Partner.findByIdAndDelete(id);
    if (!partner) {
      return NextResponse.json(
        { success: false, message: "Partner not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Partner deleted successfully",
    });
  } catch (error) {
    console.error("Delete partner error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}