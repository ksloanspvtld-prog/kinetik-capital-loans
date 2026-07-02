import mongoose, { Schema, models } from "mongoose";

const PartnerSchema = new Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobile: { type: String, required: true, trim: true, match: [/^[0-9]{10}$/, "Valid mobile required"], unique: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    partnerType: { type: String, enum: ["individual", "firm", "corporate"], default: "individual" },
    experience: { type: String, default: "" },
    notes: { type: String, default: "" },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    commission: { type: Number, default: 0 },

    // ✅ Partner Code for Referral
    partnerCode: { type: String, unique: true },
    totalReferrals: { type: Number, default: 0 },
    totalCommission: { type: Number, default: 0 },
    commissionPaid: { type: Number, default: 0 },

    // ✅ KYC
    kycStatus: { type: String, enum: ["Pending", "Submitted", "Verified", "Rejected"], default: "Pending" },
    kycDocuments: [
      {
        type: { type: String, enum: ["aadhaar", "pan", "photo", "address", "gst"] },
        url: String,
        verified: { type: Boolean, default: false },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    panNumber: { type: String, default: "" },
    gstNumber: { type: String, default: "" },

    userId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default models.Partner || mongoose.model("Partner", PartnerSchema);