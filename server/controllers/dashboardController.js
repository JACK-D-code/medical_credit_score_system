import { User } from "../models/User.js";
import { Bills } from "../models/Bill.js";
import { creditScores } from "../models/CreditScore.js";

export const adminDashboard = (req, res) => {
  const avgScore =
    creditScores.reduce((s, c) => s + c.score, 0) /
    (creditScores.length || 1);

  res.json({
    totalUsers: user.length,
    totalBills: bill.length,
    averageScore: Math.round(avgScore),
    highRiskPatients: CreditScores.filter(c => c.riskLevel === "HIGH").length
  });
};
