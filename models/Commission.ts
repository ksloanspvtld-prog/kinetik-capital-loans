import mongoose, { Schema, models } from "mongoose";

const CommissionSchema = new Schema(
  {
    partnerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    leadId: { type: Schema.Types.ObjectId, ref: "Lead", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Paid"],
      default: "Pending",
    },
    paidAt: { type: Date },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default models.Commission || mongoose.model("Commission", CommissionSchema);