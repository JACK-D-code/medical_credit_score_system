export const checkEligibility = (score) => {
  if (score >= 750) return "APPROVED";
  if (score >= 600) return "REVIEW";
  return "REJECTED";
};
