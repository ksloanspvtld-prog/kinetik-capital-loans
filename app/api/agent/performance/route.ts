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
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    await connectDB();

    let query = {};
    if (decoded.role === "agent") {
      query = { assignedAgent: decoded.id };
    }

    const leads = await Lead.find(query).populate("assignedAgent", "fullName email");

    const totalLeads = leads.length;
    const approved = leads.filter((l) => l.status === "Approved").length;
    const rejected = leads.filter((l) => l.status === "Rejected").length;
    const pending = leads.filter((l) => l.status === "New" || l.status === "Contacted" || l.status === "Processing").length;

    // Agent performance by agent
    const agentPerformance: Record<string, { name: string; total: number; approved: number; rejected: number; pending: number; rate: number }> = {};

    leads.forEach((lead) => {
      if (lead.assignedAgent) {
        const agentId = lead.assignedAgent._id.toString();
        const agentName = lead.assignedAgent.fullName;
        if (!agentPerformance[agentId]) {
          agentPerformance[agentId] = {
            name: agentName,
            total: 0,
            approved: 0,
            rejected: 0,
            pending: 0,
            rate: 0,
          };
        }
        agentPerformance[agentId].total++;
        if (lead.status === "Approved") agentPerformance[agentId].approved++;
        if (lead.status === "Rejected") agentPerformance[agentId].rejected++;
        if (lead.status === "New" || lead.status === "Contacted" || lead.status === "Processing") {
          agentPerformance[agentId].pending++;
        }
      }
    });

    // Calculate rates
    Object.values(agentPerformance).forEach((agent) => {
      agent.rate = agent.total > 0 ? Math.round((agent.approved / agent.total) * 100) : 0;
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalLeads,
        approved,
        rejected,
        pending,
        conversionRate: totalLeads > 0 ? Math.round((approved / totalLeads) * 100) : 0,
      },
      agentPerformance: Object.values(agentPerformance).sort((a, b) => b.rate - a.rate),
    });
  } catch (error) {
    console.error("Agent performance error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}