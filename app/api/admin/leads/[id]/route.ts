import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { verifyToken } from "@/lib/jwt";
import { sendStatusUpdateEmail } from "@/lib/email";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ... Auth check (same as before) ...

    const { id } = await params;
    const { status, notes, followUpDate } = await req.json();

    await connectDB();

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
      return NextResponse.json({ success: false, message: "Lead not found" }, { status: 404 });
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