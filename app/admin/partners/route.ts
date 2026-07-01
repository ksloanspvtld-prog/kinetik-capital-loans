import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Partner from "@/models/Partner";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "all";

    await connectDB();

    const query = status === "all" ? {} : { status };
    const partners = await Partner.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, partners });
  } catch (error) {
    console.error("Partners Error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}