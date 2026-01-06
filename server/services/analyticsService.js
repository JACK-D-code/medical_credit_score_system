import CreditScore from "../models/CreditScore.js";

export const getRiskDistribution = async () => {
  return CreditScore.aggregate([
    { $group: { _id: "$riskLevel", count: { $sum: 1 } } }
  ]);
};
