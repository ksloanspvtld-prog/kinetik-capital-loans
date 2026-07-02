import mongoose, { Schema, models } from "mongoose";

const LeadSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    mobile: { type: String, required: true, trim: true, match: [/^[0-9]{10}$/, "Valid mobile required"] },
    email: { type: String, trim: true, lowercase: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    loanType: { type: String, required: true, trim: true },
    monthlyIncome: { type: String, trim: true },
    status: {
      type: String,
      enum: ["New", "Contacted", "Processing", "Approved", "Rejected"],
      default: "New",
    },
    notes: { type: String, default: "" },
    followUpDate: { type: String, default: "" },
    reminderSent: { type: Boolean, default: false },

    // ✅ Referral System
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    referralCode: {
      type: String,
      default: null,
    },

    // ✅ KYC
    kycStatus: {
      type: String,
      enum: ["Pending", "Submitted", "Verified", "Rejected"],
      default: "Pending",
    },
    kycDocuments: [
      {
        type: { type: String, enum: ["aadhaar", "pan", "photo", "address"] },
        url: String,
        verified: { type: Boolean, default: false },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    panNumber: { type: String, default: "" },
    aadhaarNumber: { type: String, default: "" },

    // ✅ Commission
    commission: { type: Number, default: 0 },
    commissionPaid: { type: Boolean, default: false },

    // ✅ Payment
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    paymentId: { type: String, default: "" },
    paymentAmount: { type: Number, default: 0 },

    notesHistory: [
      {
        note: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    followUpHistory: [
      {
        date: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    assignedAgent: { type: Schema.Types.ObjectId, ref: "User" },
    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default models.Lead || mongoose.model("Lead", LeadSchema);