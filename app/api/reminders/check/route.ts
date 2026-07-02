import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { sendFollowUpReminderEmail } from "@/lib/email";

export async function GET(req: Request) {
  try {
    const today = new Date().toISOString().split("T")[0];

    await connectDB();

    // Find leads with follow-up today and reminder not sent
    const leads = await Lead.find({
      followUpDate: today,
      reminderSent: false,
    }).populate("userId", "email fullName");

    let sentCount = 0;

    for (const lead of leads) {
      if (lead.userId?.email) {
        await sendFollowUpReminderEmail(
          lead.userId.email,
          lead.fullName,
          lead.loanType,
          lead.followUpDate,
          lead._id.toString()
        );
        lead.reminderSent = true;
        await lead.save();
        sentCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `${sentCount} reminders sent successfully`,
      sent: sentCount,
      total: leads.length,
    });
  } catch (error) {
    console.error("Reminder error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}