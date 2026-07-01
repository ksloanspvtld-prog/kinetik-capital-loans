import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  loanType: { type: String, required: true },
  monthlyIncome: { type: String },
  status: {
    type: String,
    enum: ["pending", "processing", "approved", "rejected"],
    default: "pending",
  },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Lead || mongoose.model("Lead", LeadSchema);