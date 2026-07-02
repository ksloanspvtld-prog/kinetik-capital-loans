import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "all";

    await connectDB();

    const query: any = { assignedAgent: decoded.id };
    if (status !== "all") {
      query.status = status;
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error("Agent leads error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}