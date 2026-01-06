import { calculateCreditScore } from "../services/creditEngine.js";
import { checkEligibility } from "../services/eligibilityService.js";
import { bills } from "../data/bills.js";

export const getPatientCredit = (req, res) => {
  const patientId = req.params.id;

  const patientBills = bills.filter(
    b => b.patientId === patientId
  );

  const credit = calculateCreditScore({
    bills: patientBills,
    visits: 5
  });

  res.json({
    score: credit.score,
    riskLevel: credit.riskLevel,
    outstandingDues: patientBills
      .filter(b => !b.paid)
      .reduce((s, b) => s + b.amount, 0),
    eligibility: checkEligibility(credit.score)
  });
};
