// Centralized State Management for Medical Credit Score System
// This service manages all patient data, scores, and activities across all modules

class MedicalCreditScoreSystem {
  private static instance: MedicalCreditScoreSystem;
  
  // Patient Data
  private patientData: any = {
    phid: 'PHID-1K4J2A8-XYZ123',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
    phone: '+91-98765 43210',
    age: 34,
    bloodGroup: 'B+',
    creditScore: 750,
    trustScore: 85,
    adherenceScore: 90,
    loyaltyLevel: 'Gold',
    totalPoints: 2840,
    monthlyIncome: 50000
  };
  
  // Activities
  private activities: any[] = [];
  
  // Bills
  private bills: any[] = [];
  
  // Health Tasks
  private healthTasks: any[] = [];
  
  // Appointments
  private appointments: any[] = [];
  
  // EMI Plans
  private emiPlans: any[] = [];
  
  // Documents
  private documents: any[] = [];
  
  // Score History
  private scoreHistory: any[] = [];
  
  // Event Listeners
  private listeners: { [key: string]: Function[] } = {};

  private constructor() {
    this.initializeData();
    this.loadFromStorage();
    this.setupCrossSiteCommunication();
  }

  static getInstance(): MedicalCreditScoreSystem {
    if (!MedicalCreditScoreSystem.instance) {
      MedicalCreditScoreSystem.instance = new MedicalCreditScoreSystem();
    }
    return MedicalCreditScoreSystem.instance;
  }

  // Initialize with demo data
  private initializeData() {
    // Initialize activities
    this.activities = [
      {
        id: '1',
        type: 'MEDICINE',
        title: 'Morning Medicine',
        points: 5,
        status: 'completed',
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        impact: 'Adherence +2%'
      },
      {
        id: '2',
        type: 'EXERCISE',
        title: 'Morning Walk',
        points: 8,
        status: 'completed',
        completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        impact: 'Trust +3%'
      },
      {
        id: '3',
        type: 'DIET',
        title: 'Healthy Breakfast',
        points: 5,
        status: 'completed',
        completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        impact: 'Credit +1'
      }
    ];

    // Initialize bills
    this.bills = [
      {
        id: '1',
        billNumber: 'BILL-001',
        title: 'General Consultation',
        amount: 500,
        originalAmount: 500,
        status: 'paid',
        dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        paidDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        discount: 0
      },
      {
        id: '2',
        billNumber: 'BILL-002',
        title: 'Lab Tests',
        amount: 1200,
        originalAmount: 1500,
        status: 'paid',
        dueDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        paidDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        discount: 300
      },
      {
        id: '3',
        billNumber: 'BILL-003',
        title: 'Emergency Consultation',
        amount: 1500,
        originalAmount: 2000,
        status: 'pending',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        discount: 500
      }
    ];

    // Initialize health tasks
    this.healthTasks = [
      {
        id: '1',
        title: 'Morning Blood Pressure Check',
        taskType: 'DAILY',
        points: 5,
        status: 'completed',
        dueDate: new Date().toISOString(),
        impact: '+5 points'
      },
      {
        id: '2',
        title: 'Evening Walk - 30 mins',
        taskType: 'DAILY',
        points: 8,
        status: 'pending',
        dueDate: new Date().toISOString(),
        impact: '+8 points'
      },
      {
        id: '3',
        title: 'Medicine Adherence',
        taskType: 'DAILY',
        points: 10,
        status: 'completed',
        dueDate: new Date().toISOString(),
        impact: '+10 points'
      }
    ];

    // Initialize appointments
    this.appointments = [
      {
        id: '1',
        title: 'Follow-up Consultation',
        provider: 'Dr. Smith',
        scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'scheduled',
        type: 'FOLLOW_UP'
      },
      {
        id: '2',
        title: 'General Health Checkup',
        provider: 'Dr. Johnson',
        scheduledFor: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'scheduled',
        type: 'CHECKUP'
      }
    ];

    // Initialize EMI plans
    this.emiPlans = [
      {
        id: 'emi-1',
        totalAmount: 2800,
        emiAmount: 467,
        tenure: 6,
        interestRate: 0,
        status: 'active',
        nextDueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        paidInstallments: 2,
        totalInstallments: 6,
        remainingAmount: 2333
      }
    ];

    // Initialize documents
    this.documents = [
      {
        id: '1',
        fileName: 'Medical Report.pdf',
        fileType: 'PDF',
        status: 'VERIFIED',
        uploadedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        fileName: 'Lab Results.jpg',
        fileType: 'JPG',
        status: 'PENDING',
        uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Initialize score history
    this.scoreHistory = [
      { month: 'Jan', score: 720, change: 0, reason: 'Initial score' },
      { month: 'Feb', score: 735, change: 15, reason: 'Regular activities' },
      { month: 'Mar', score: 750, change: 15, reason: 'Improved adherence' },
      { month: 'Apr', score: 750, change: 0, reason: 'Stable performance' },
      { month: 'May', score: 750, change: 0, reason: 'Current month' }
    ];
  }

  // Load data from localStorage
  private loadFromStorage() {
    try {
      const savedPatientData = localStorage.getItem('mcs_patientData');
      const savedActivities = localStorage.getItem('mcs_activities');
      const savedBills = localStorage.getItem('mcs_bills');
      const savedScoreHistory = localStorage.getItem('mcs_scoreHistory');

      if (savedPatientData) this.patientData = JSON.parse(savedPatientData);
      if (savedActivities) this.activities = JSON.parse(savedActivities);
      if (savedBills) this.bills = JSON.parse(savedBills);
      if (savedScoreHistory) this.scoreHistory = JSON.parse(savedScoreHistory);
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  // Save data to localStorage
  private saveToStorage() {
    try {
      localStorage.setItem('mcs_patientData', JSON.stringify(this.patientData));
      localStorage.setItem('mcs_activities', JSON.stringify(this.activities));
      localStorage.setItem('mcs_bills', JSON.stringify(this.bills));
      localStorage.setItem('mcs_scoreHistory', JSON.stringify(this.scoreHistory));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  // Setup cross-site communication
  private setupCrossSiteCommunication() {
    window.addEventListener('storage', (e) => {
      if (e.key?.startsWith('mcs_')) {
        this.loadFromStorage();
        this.emit('dataUpdated', this.getAllData());
      }
    });

    // Listen for messages from other windows
    window.addEventListener('message', (event) => {
      if (event.data.type === 'MCS_UPDATE') {
        this.updateFromExternal(event.data.data);
      }
    });
  }

  // Event system
  on(event: string, callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  private emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  // Get all data
  getAllData() {
    return {
      patientData: this.patientData,
      activities: this.activities,
      bills: this.bills,
      healthTasks: this.healthTasks,
      appointments: this.appointments,
      emiPlans: this.emiPlans,
      documents: this.documents,
      scoreHistory: this.scoreHistory
    };
  }

  // Get patient data
  getPatientData() {
    return this.patientData;
  }

  // Update patient data
  updatePatientData(updates: any) {
    this.patientData = { ...this.patientData, ...updates };
    this.saveToStorage();
    this.emit('patientDataUpdated', this.patientData);
    this.broadcastUpdate();
    return this.patientData;
  }

  // Get activities
  getActivities() {
    return this.activities;
  }

  // Complete activity - THIS IS THE KEY FUNCTION FOR SCORE UPDATES
  completeActivity(activityId: string) {
    const activity = this.activities.find(a => a.id === activityId);
    if (activity && activity.status === 'pending') {
      // Update activity status
      activity.status = 'completed';
      activity.completedAt = new Date().toISOString();

      // Calculate score impact
      const scoreChange = Math.floor(activity.points / 5);
      const trustChange = 1;
      const adherenceChange = 2;

      // Update patient scores
      const oldScore = this.patientData.creditScore;
      this.patientData.creditScore = Math.min(1000, this.patientData.creditScore + scoreChange);
      this.patientData.trustScore = Math.min(100, this.patientData.trustScore + trustChange);
      this.patientData.adherenceScore = Math.min(100, this.patientData.adherenceScore + adherenceChange);
      this.patientData.totalPoints += activity.points;

      // Add to score history
      this.scoreHistory.push({
        month: new Date().toLocaleString('default', { month: 'short' }),
        score: this.patientData.creditScore,
        change: this.patientData.creditScore - oldScore,
        reason: activity.title
      });

      // Save and notify
      this.saveToStorage();
      this.emit('activityCompleted', { activity, scoreChange });
      this.emit('scoreUpdated', { 
        oldScore, 
        newScore: this.patientData.creditScore, 
        change: scoreChange 
      });
      this.broadcastUpdate();

      return {
        success: true,
        activity,
        scoreChange,
        newScore: this.patientData.creditScore
      };
    }
    return { success: false, message: 'Activity not found or already completed' };
  }

  // Simulate activity (for testing)
  simulateActivity(type: string, points: number, title: string) {
    const activity = {
      id: Date.now().toString(),
      type,
      title,
      points,
      status: 'completed',
      completedAt: new Date().toISOString(),
      impact: `${type} activity completed`
    };

    this.activities.unshift(activity);

    // Calculate score impact
    const scoreChange = Math.floor(points / 5);
    const oldScore = this.patientData.creditScore;
    
    // Update patient scores
    this.patientData.creditScore = Math.min(1000, this.patientData.creditScore + scoreChange);
    this.patientData.trustScore = Math.min(100, this.patientData.trustScore + 1);
    this.patientData.totalPoints += points;

    // Add to score history
    this.scoreHistory.push({
      month: new Date().toLocaleString('default', { month: 'short' }),
      score: this.patientData.creditScore,
      change: scoreChange,
      reason: title
    });

    // Save and notify
    this.saveToStorage();
    this.emit('activityCompleted', { activity, scoreChange });
    this.emit('scoreUpdated', { 
      oldScore, 
      newScore: this.patientData.creditScore, 
      change: scoreChange 
    });
    this.broadcastUpdate();

    return {
      success: true,
      activity,
      scoreChange,
      newScore: this.patientData.creditScore
    };
  }

  // Pay bill - affects credit score
  payBill(billId: string) {
    const bill = this.bills.find(b => b.id === billId);
    if (bill && bill.status === 'pending') {
      bill.status = 'paid';
      bill.paidDate = new Date().toISOString();

      // Increase credit score for timely payment
      const oldScore = this.patientData.creditScore;
      this.patientData.creditScore = Math.min(1000, this.patientData.creditScore + 5);
      this.patientData.trustScore = Math.min(100, this.patientData.trustScore + 2);

      // Add to score history
      this.scoreHistory.push({
        month: new Date().toLocaleString('default', { month: 'short' }),
        score: this.patientData.creditScore,
        change: 5,
        reason: `Bill payment: ${bill.title}`
      });

      this.saveToStorage();
      this.emit('billPaid', { bill, scoreChange: 5 });
      this.emit('scoreUpdated', { 
        oldScore, 
        newScore: this.patientData.creditScore, 
        change: 5 
      });
      this.broadcastUpdate();

      return { success: true, bill, scoreChange: 5 };
    }
    return { success: false, message: 'Bill not found or already paid' };
  }

  // Apply EMI
  applyEMI(billId: string, emiPlan: any) {
    const bill = this.bills.find(b => b.id === billId);
    if (bill && bill.status === 'pending') {
      bill.status = 'emi';
      this.emiPlans.push({
        ...emiPlan,
        billId,
        status: 'active'
      });

      this.saveToStorage();
      this.emit('emiApplied', { bill, emiPlan });
      this.broadcastUpdate();

      return { success: true, bill, emiPlan };
    }
    return { success: false, message: 'Bill not found or already processed' };
  }

  // Get bills
  getBills() {
    return this.bills;
  }

  // Get health tasks
  getHealthTasks() {
    return this.healthTasks;
  }

  // Get appointments
  getAppointments() {
    return this.appointments;
  }

  // Get EMI plans
  getEmiPlans() {
    return this.emiPlans;
  }

  // Get documents
  getDocuments() {
    return this.documents;
  }

  // Add document
  addDocument(document: any) {
    const newDoc = {
      ...document,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString()
    };
    this.documents.unshift(newDoc);
    this.saveToStorage();
    this.emit('documentAdded', newDoc);
    this.broadcastUpdate();
    return newDoc;
  }

  // Get score history
  getScoreHistory() {
    return this.scoreHistory;
  }

  // Get analytics
  getAnalytics() {
    const today = new Date().toDateString();
    const todayActivities = this.activities.filter(a => 
      new Date(a.completedAt).toDateString() === today
    );

    return {
      todayActivities: todayActivities.length,
      totalActivities: this.activities.length,
      completedTasks: this.healthTasks.filter(t => t.status === 'completed').length,
      pendingTasks: this.healthTasks.filter(t => t.status === 'pending').length,
      totalBills: this.bills.length,
      paidBills: this.bills.filter(b => b.status === 'paid').length,
      pendingBills: this.bills.filter(b => b.status === 'pending').length,
      totalSpent: this.bills.reduce((sum, b) => sum + (b.amount || 0), 0),
      totalSavings: this.bills.reduce((sum, b) => sum + (b.discount || 0), 0),
      adherenceRate: Math.round((this.healthTasks.filter(t => t.status === 'completed').length / this.healthTasks.length) * 100),
      creditScore: this.patientData.creditScore,
      trustScore: this.patientData.trustScore,
      totalPoints: this.patientData.totalPoints
    };
  }

  // Update from external source (for cross-site communication)
  private updateFromExternal(data: any) {
    if (data.patientData) this.patientData = data.patientData;
    if (data.activities) this.activities = data.activities;
    if (data.bills) this.bills = data.bills;
    this.saveToStorage();
    this.emit('externalUpdate', data);
  }

  // Broadcast update to other windows
  private broadcastUpdate() {
    window.postMessage({
      type: 'MCS_UPDATE',
      data: this.getAllData()
    }, '*');
  }

  // Reset to initial state (for testing)
  reset() {
    localStorage.removeItem('mcs_patientData');
    localStorage.removeItem('mcs_activities');
    localStorage.removeItem('mcs_bills');
    localStorage.removeItem('mcs_scoreHistory');
    this.initializeData();
    this.saveToStorage();
    this.emit('reset', this.getAllData());
  }
}

export default MedicalCreditScoreSystem;

// Create global instance
const mcs = MedicalCreditScoreSystem.getInstance();
export { mcs };
