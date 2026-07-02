import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { sendStatusUpdateEmail } from "@/lib/email";

export async function GET(req: Request) {
  try {
    // ✅ आजची date
    const today = new Date().toISOString().split("T")[0];

    await connectDB();

    // ✅ Follow-up date = today आणि reminder sent नाही
    const leads = await Lead.find({
      followUpDate: today,
      reminderSent: false,
    });

    console.log(`📅 Today's follow-ups: ${leads.length}`);

    let sentCount = 0;

    for (const lead of leads) {
      // ✅ Email send करा (जर email असेल)
      if (lead.email) {
        await sendStatusUpdateEmail(
          lead.email,
          lead.fullName,
          lead.loanType,
          "Follow-up Reminder",
          lead._id.toString()
        );
        console.log(`📧 Reminder sent to ${lead.email}`);
      }

      // ✅ Reminder sent mark करा
      lead.reminderSent = true;
      await lead.save();
      sentCount++;
    }

    return NextResponse.json({
      success: true,
      message: `✅ ${sentCount} reminders sent successfully!`,
      total: leads.length,
      sent: sentCount,
    });
  } catch (error) {
    console.error("Reminder error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}