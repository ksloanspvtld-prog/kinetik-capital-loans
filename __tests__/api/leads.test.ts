import { POST } from "@/app/api/leads/route";
import { connectDB } from "@/lib/mongodb";
import Lead from "@/models/Lead";

// ✅ Mock dependencies
jest.mock("@/lib/mongodb");
jest.mock("@/models/Lead");

describe("POST /api/leads", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new lead successfully", async () => {
    const mockLead = {
      _id: "test123",
      fullName: "Test User",
      mobile: "9876543210",
      loanType: "Personal Loan",
      status: "New",
    };

    (connectDB as jest.Mock).mockResolvedValue(undefined);
    (Lead.create as jest.Mock).mockResolvedValue(mockLead);

    const req = new Request("http://localhost:3000/api/leads", {
      method: "POST",
      body: JSON.stringify({
        fullName: "Test User",
        mobile: "9876543210",
        loanType: "Personal Loan",
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.lead.fullName).toBe("Test User");
  });

  it("should return error if mobile is invalid", async () => {
    const req = new Request("http://localhost:3000/api/leads", {
      method: "POST",
      body: JSON.stringify({
        fullName: "Test User",
        mobile: "12345", // Invalid (should be 10 digits)
        loanType: "Personal Loan",
      }),
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.message).toContain("10 digits");
  });
});