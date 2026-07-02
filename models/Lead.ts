import mongoose, { Schema, models } from "mongoose";

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
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    loanType: {
      type: String,
      required: [true, "Loan type is required"],
      trim: true,
    },
    monthlyIncome: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Processing", "Approved", "Rejected"],
      default: "New",
    },
    notes: {
      type: String,
      default: "",
    },
    followUpDate: {
      type: String,
      default: "",
    },

    reminderSent: { 
        type: Boolean, default: false }, // ✅ नवीन field

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
    assignedAgent: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export default models.Lead || mongoose.model("Lead", LeadSchema);