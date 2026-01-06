export function calculateCreditScore({ bills, visits }) {
  let score = 900;

  const unpaid = bills.filter(b => !b.paid);
  score -= unpaid.length * 40;

  const totalDue = unpaid.reduce((s, b) => s + b.amount, 0);
  if (totalDue > 20000) score -= 100;

  if (visits > 10) score -= 50;

  score = Math.max(300, score);

  return {
    score,
    riskLevel:
      score >= 750 ? "LOW" :
      score >= 600 ? "MEDIUM" : "HIGH"
  };
}
