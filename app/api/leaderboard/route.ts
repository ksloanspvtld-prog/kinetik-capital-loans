import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";
import User from "@/models/User";
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

    await connectDB();

    // Get all agents
    const agents = await User.find({ role: "agent" }).select("_id fullName");

    const leaderboard = await Promise.all(
      agents.map(async (agent) => {
        const leads = await Lead.find({ assignedAgent: agent._id });
        const total = leads.length;
        const approved = leads.filter((l) => l.status === "Approved").length;
        const rejected = leads.filter((l) => l.status === "Rejected").length;
        const pending = total - approved - rejected;
        const rate = total > 0 ? Math.round((approved / total) * 100) : 0;

        return {
          id: agent._id,
          name: agent.fullName,
          total,
          approved,
          rejected,
          pending,
          rate,
        };
      })
    );

    // Sort by rate descending
    leaderboard.sort((a, b) => b.rate - a.rate);

    return NextResponse.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}