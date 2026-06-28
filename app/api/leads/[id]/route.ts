import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Leads  from "@/models/Lead";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    console.log("BODY:", body);

    const existingLead = await Leads.findById(id);

    if (!existingLead) {
      return NextResponse.json(
        {
          success: false,
          message: "Lead not found",
        },
        {
          status: 404,
        }
      );
    }

    // Status Update
    if (body.status !== undefined) {
      existingLead.status = body.status;
    }

    // Notes History
    if (
      body.notes !== undefined &&
      body.notes.trim() !== "" &&
      body.notes !== existingLead.notes
    ) {
      existingLead.notesHistory.push({
        note: body.notes,
        createdAt: new Date(),
      });
    }

    // Follow Up History
    if (
      body.followUpDate !== undefined &&
      body.followUpDate !== "" &&
      body.followUpDate !== existingLead.followUpDate
    ) {
      existingLead.followUpHistory.push({
        date: body.followUpDate,
        createdAt: new Date(),
      });
    }

    // Update only fields that are actually sent
    if (body.notes !== undefined) {
      existingLead.notes = body.notes;
    }

    if (body.followUpDate !== undefined) {
      existingLead.followUpDate = body.followUpDate;
    }

    await existingLead.save();

    console.log("STATUS AFTER SAVE:", existingLead.status);

    return NextResponse.json({
      success: true,
      lead: existingLead,
    });
  } catch (error) {
    console.log("PUT ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}
