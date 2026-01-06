export const predictDefaultRisk = ({
    creditScore,
    totalDue,
    visitFrequency
  }) => {
    let risk = 0;
  
    if (creditScore < 600) risk += 40;
    if (totalDue > 50000) risk += 30;
    if (visitFrequency > 10) risk += 20;
  
    return {
      probability: Math.min(100, risk),
      category:
        risk < 30 ? "LOW" :
        risk < 60 ? "MEDIUM" : "HIGH"
    };
  };
  