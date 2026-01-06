import mongoose from "mongoose";

const creditSchema = new mongoose.Schema({
  patientId: mongoose.Schema.Types.ObjectId,
  score: Number,
  riskLevel: String,
  lastUpdated: Date
});

export default mongoose.model("CreditScore", creditSchema);
