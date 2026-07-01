// models/Lead.ts
import mongoose, { Schema, models } from "mongoose";

const NoteHistorySchema = new Schema({
  note: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const FollowUpHistorySchema = new Schema({
  date: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const LeadSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    loanType: {
      type: String,
      enum: ["Personal Loan", "Home Loan", "Business Loan", "Car Loan"],
      required: [true, "Loan type is required"],
    },
    monthlyIncome: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["New", "Contacted", "Approved", "Rejected"],
      default: "New",
    },
    notes: { type: String, default: "" },
    followUpDate: { type: String, default: "" },
    notesHistory: { type: [NoteHistorySchema], default: [] },
    followUpHistory: { type: [FollowUpHistorySchema], default: [] },
    pincode: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export default models.Lead || mongoose.model("Lead", LeadSchema);