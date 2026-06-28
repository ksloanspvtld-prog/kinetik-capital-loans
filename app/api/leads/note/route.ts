import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { leadId, noteId } = await req.json();

    const lead = await Lead.findById(leadId);

    if (!lead) {
      return NextResponse.json(
        {
          success: false,
          message: "Lead not found",
        },
        { status: 404 }
      );
    }

    lead.notesHistory = lead.notesHistory.filter(
      (note: any) => String(note._id) !== String(noteId)
    );

    await lead.save();

    return NextResponse.json({
      success: true,
      message: "Note deleted successfully",
      lead,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      { status: 500 }
    );
  }
}