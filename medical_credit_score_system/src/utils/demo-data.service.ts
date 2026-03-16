// Demo Data Service for Real-time Interactions
// This service provides realistic demo data that updates based on user actions

export class DemoDataService {
  private static instance: DemoDataService;
  private patientData: any = {
    id: 'P001',
    name: 'Rahul Sharma',
    age: 34,
    creditScore: 750,
    loyaltyLevel: 'Gold',
    trustScore: 85,
    adherenceScore: 90,
    totalPoints: 2840,
    activeEMI: 2,
    pendingBills: 1,
    todayAppointments: 2,
    completedEvaluations: 0
  };

  private activities: any[] = [];
  private healthTasks: any[] = [
    {
      id: 'T001',
      title: 'Morning Blood Pressure Check',
      type: 'DAILY',
      points: 5,
      completed: false,
      streak: 15
    },
    {
      id: 'T002',
      title: 'Evening Walk - 30 mins',
      type: 'DAILY',
      points: 8,
      completed: false,
      streak: 12
    },
    {
      id: 'T003',
      title: 'Medicine Adherence',
      type: 'DAILY',
      points: 10,
      completed: true,
      streak: 30
    },
    {
      id: 'T004',
      title: 'Weekly Weight Tracking',
      type: 'WEEKLY',
      points: 15,
      completed: false,
      streak: 8
    }
  ];

  private appointments: any[] = [
    {
      id: 'A001',
      providerName: 'Dr. Priya Patel',
      type: 'Follow-up Consultation',
      date: '2024-03-20',
      time: '10:30 AM',
      status: 'confirmed',
      creditScore: 750
    },
    {
      id: 'A002',
      providerName: 'Dr. Amit Kumar',
      type: 'Cardiac Review',
      date: '2024-03-25',
      time: '02:00 PM',
      status: 'scheduled',
      creditScore: 750
    }
  ];

  private emiPlans: any[] = [
    {
      id: 'E001',
      treatment: 'Cardiac Catheterization',
      amount: 250000,
      emi: 12500,
      remaining: 87500,
      nextDue: '2024-03-25'
    },
    {
      id: 'E002',
      treatment: 'MRI Scan',
      amount: 15000,
      emi: 3000,
      remaining: 9000,
      nextDue: '2024-03-20'
    }
  ];

  private notifications: any[] = [];

  static getInstance(): DemoDataService {
    if (!DemoDataService.instance) {
      DemoDataService.instance = new DemoDataService();
    }
    return DemoDataService.instance;
  }

  // Get current patient data
  getPatientData() {
    return { ...this.patientData };
  }

  // Track activity and update data
  trackActivity(activityType: string, title: string, points: number) {
    const activity = {
      id: `ACT_${Date.now()}`,
      activityType,
      activityTitle: title,
      pointsEarned: points,
      completedAt: new Date().toISOString(),
      patientId: this.patientData.id
    };

    this.activities.unshift(activity);
    this.patientData.totalPoints += points;
    
    // Update adherence score
    this.patientData.adherenceScore = Math.min(100, this.patientData.adherenceScore + 2);
    
    // Update credit score based on activity
    this.updateCreditScore(points);
    
    // Add notification
    this.addNotification(`Activity Completed!`, `+${points} points earned for ${title}`, 'success');
    
    return activity;
  }

  // Complete health task
  completeHealthTask(taskId: string) {
    const task = this.healthTasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      task.completed = true;
      this.patientData.totalPoints += task.points;
      this.patientData.adherenceScore = Math.min(100, this.patientData.adherenceScore + 3);
      
      // Update credit score
      this.updateCreditScore(task.points);
      
      // Add notification
      this.addNotification('Task Completed!', `+${task.points} points for completing ${task.title}`, 'success');
      
      return task;
    }
    return null;
  }

  // Submit evaluation (from provider)
  submitEvaluation(patientId: string, evaluationData: any) {
    const evaluation = {
      id: `EVAL_${Date.now()}`,
      patientId,
      providerId: 'PROV001',
      providerName: 'Dr. Priya Patel',
      evaluationType: evaluationData.evaluationType,
      bonusPoints: evaluationData.bonusPoints,
      reason: evaluationData.reason,
      status: 'PENDING',
      date: new Date().toISOString()
    };

    // Update patient credit score after evaluation
    setTimeout(() => {
      this.updateCreditScore(evaluationData.bonusPoints);
      this.addNotification('Evaluation Processed!', `+${evaluationData.bonusPoints} bonus points added to your credit score`, 'success');
    }, 2000);

    return evaluation;
  }

  // Book appointment
  bookAppointment(appointmentData: any) {
    const appointment = {
      id: `APT_${Date.now()}`,
      patientId: this.patientData.id,
      providerName: appointmentData.providerName || 'Dr. Priya Patel',
      type: appointmentData.type,
      date: appointmentData.date,
      time: appointmentData.time,
      status: 'confirmed',
      creditScore: this.patientData.creditScore
    };

    this.appointments.unshift(appointment);
    this.patientData.todayAppointments += 1;
    
    this.addNotification('Appointment Booked!', `Appointment with ${appointmentData.providerName} confirmed`, 'success');
    
    return appointment;
  }

  // Pay bill
  payBill(billId: string, amount: number) {
    const billIndex = this.emiPlans.findIndex(plan => plan.id === billId);
    if (billIndex !== -1) {
      const plan = this.emiPlans[billIndex];
      plan.remaining -= amount;
      
      if (plan.remaining <= 0) {
        this.patientData.activeEMI -= 1;
        this.emiPlans.splice(billIndex, 1);
      }
      
      this.addNotification('Payment Successful!', `Payment of ₹${amount} processed successfully`, 'success');
      
      return true;
    }
    return false;
  }

  // Update credit score
  private updateCreditScore(points: number) {
    const oldScore = this.patientData.creditScore;
    this.patientData.creditScore += Math.round(points * 0.1); // Small impact per activity
    
    // Update loyalty level
    if (this.patientData.creditScore >= 800) {
      this.patientData.loyaltyLevel = 'Platinum';
    } else if (this.patientData.creditScore >= 750) {
      this.patientData.loyaltyLevel = 'Gold';
    } else if (this.patientData.creditScore >= 650) {
      this.patientData.loyaltyLevel = 'Silver';
    } else {
      this.patientData.loyaltyLevel = 'Bronze';
    }

    // Add score update notification
    if (oldScore !== this.patientData.creditScore) {
      this.addNotification(
        'Credit Score Updated!', 
        `Your credit score increased from ${oldScore} to ${this.patientData.creditScore}`, 
        'info'
      );
    }
  }

  // Add notification
  private addNotification(title: string, message: string, type: string) {
    const notification = {
      id: `NOTIF_${Date.now()}`,
      title,
      message,
      type: type.toUpperCase(),
      isRead: false,
      createdAt: new Date().toISOString()
    };

    this.notifications.unshift(notification);
  }

  // Get activities
  getActivities() {
    return [...this.activities];
  }

  // Get health tasks
  getHealthTasks() {
    return [...this.healthTasks];
  }

  // Get appointments
  getAppointments() {
    return [...this.appointments];
  }

  // Get EMI plans
  getEmiPlans() {
    return [...this.emiPlans];
  }

  // Get notifications
  getNotifications() {
    return [...this.notifications];
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  }

  // Get credit score factors
  getCreditScoreFactors() {
    return {
      paymentHistory: {
        score: 85,
        weight: 40,
        description: 'Based on EMI payment history and bill payments'
      },
      insurance: {
        score: 90,
        weight: 25,
        description: 'Based on insurance coverage and claims'
      },
      income: {
        score: 70,
        weight: 20,
        description: 'Based on income stability and employment'
      },
      medicalRisk: {
        score: 60,
        weight: 15,
        description: 'Based on medical history and risk factors'
      }
    };
  }

  // Get score improvement suggestions
  getScoreImprovementSuggestions() {
    const factors = this.getCreditScoreFactors();
    const suggestions = [];

    if (factors.paymentHistory.score < 80) {
      suggestions.push({
        category: 'Payment History',
        suggestion: 'Pay EMIs on time to improve payment history score',
        impact: '+15-25 points',
        priority: 'HIGH'
      });
    }

    if (factors.insurance.score < 80) {
      suggestions.push({
        category: 'Insurance',
        suggestion: 'Maintain continuous insurance coverage',
        impact: '+10-20 points',
        priority: 'MEDIUM'
      });
    }

    if (factors.income.score < 80) {
      suggestions.push({
        category: 'Income Stability',
        suggestion: 'Maintain stable employment and income',
        impact: '+15-30 points',
        priority: 'HIGH'
      });
    }

    if (factors.medicalRisk.score < 80) {
      suggestions.push({
        category: 'Medical Risk',
        suggestion: 'Follow treatment plans and maintain good health',
        impact: '+10-15 points',
        priority: 'MEDIUM'
      });
    }

    return suggestions;
  }

  // Reset demo data
  resetData() {
    this.patientData = {
      id: 'P001',
      name: 'Rahul Sharma',
      age: 34,
      creditScore: 750,
      loyaltyLevel: 'Gold',
      trustScore: 85,
      adherenceScore: 90,
      totalPoints: 2840,
      activeEMI: 2,
      pendingBills: 1,
      todayAppointments: 2,
      completedEvaluations: 0
    };
    this.activities = [];
    this.notifications = [];
    
    // Reset health tasks
    this.healthTasks.forEach(task => {
      task.completed = task.id === 'T003'; // Keep medicine adherence as completed
    });
  }
}

export default DemoDataService.getInstance();
