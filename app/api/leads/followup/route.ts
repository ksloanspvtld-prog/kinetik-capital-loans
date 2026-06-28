import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Leads from "@/models/Lead";

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { leadId, historyId } = await req.json();

    console.log("Lead ID:", leadId);
    console.log("History ID:", historyId);

    const lead = await Leads.findById(leadId);

    console.log("Lead Found:", !!lead);

    if (!lead) {
      return NextResponse.json(
        {
          success: false,
          message: "Lead not found",
        },
        { status: 404 }
      );
    }

    console.log("Before:", lead.followUpHistory);

    lead.followUpHistory = lead.followUpHistory.filter(
      (item: any) => item._id.toString() !== historyId
    );

    console.log("After:", lead.followUpHistory);

    await lead.save();

    console.log("Saved Successfully");

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.log("DELETE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}