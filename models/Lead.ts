import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  loanType: {
    type: String,
  },
  monthlyIncome: {
    type: String,
  },
  status: {
    type: String,
    default: "New",
  },
  notes: {
    type: String,
    default: "",
  },
  notesHistory: [
    {
      note: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  followUpDate: {
    type: String,
    default: "",
  },
  followUpHistory: [
    {
      date: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export default mongoose.models.Lead ||
  mongoose.model("Lead", LeadSchema);
