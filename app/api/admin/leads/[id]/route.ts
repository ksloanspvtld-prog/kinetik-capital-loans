import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { verifyToken } from "@/lib/jwt";
import { sendStatusUpdateEmail } from "@/lib/email";

// ✅ PATCH – Update lead status, notes, follow-up
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Auth check
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Only admin or assigned agent can update
    // For simplicity, allow admin only, but you can add agent logic if needed
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    // ✅ Get params and body
    const { id } = await params;
    const { status, notes, followUpDate } = await req.json();

    await connectDB();

    // ✅ Build update data
    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) {
      updateData.notes = notes;
      if (notes) {
        updateData.$push = { notesHistory: { note: notes, createdAt: new Date() } };
      }
    }
    if (followUpDate !== undefined) {
      updateData.followUpDate = followUpDate;
      if (followUpDate) {
        updateData.$push = updateData.$push || {};
        updateData.$push.followUpHistory = { date: followUpDate, createdAt: new Date() };
      }
    }

    const lead = await Lead.findByIdAndUpdate(id, updateData, { new: true });

    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 }
      );
    }

    // ✅ Send status update email to customer if status changed and email exists
    if (status && lead.email) {
      try {
        await sendStatusUpdateEmail(
          lead.email,
          lead.fullName,
          lead.loanType,
          status,
          lead._id.toString()
        );
        console.log(`✅ Status update email sent to ${lead.email}`);
      } catch (emailError) {
        console.error("❌ Failed to send status email:", emailError);
        // Don't fail the request
      }
    }

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Update lead error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// ✅ GET – Fetch a single lead
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
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    // Admin or assigned agent can view
    // For now, allow admin only
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;
    await connectDB();

    const lead = await Lead.findById(id);
    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("Get lead error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

// ✅ DELETE – Delete a lead
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

    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      return NextResponse.json(
        { success: false, message: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Delete lead error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}