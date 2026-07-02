import mongoose, { Schema, models } from "mongoose";

const PartnerSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
      unique: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    partnerType: {
      type: String,
      enum: ["individual", "firm", "corporate"],
      default: "individual",
    },
    experience: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    commission: {
      type: Number,
      default: 0,
    },
    userId: {
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

export default models.Partner || mongoose.model("Partner", PartnerSchema);