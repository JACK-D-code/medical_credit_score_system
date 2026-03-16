// Patient Data Service for Provider Site
class PatientDataService {
  private static instance: PatientDataService;
  private patients: Map<string, any> = new Map();
  private listeners: ((patients: Map<string, any>) => void)[] = [];

  private constructor() {
    this.initializeData();
    this.setupCrossSiteCommunication();
  }

  static getInstance(): PatientDataService {
    if (!PatientDataService.instance) {
      PatientDataService.instance = new PatientDataService();
    }
    return PatientDataService.instance;
  }

  private initializeData() {
    // Initialize with demo patients
    this.addPatient({
      id: 'PHID-1K4J2A8-XYZ123',
      name: 'Rahul Sharma',
      score: 750,
      activities: [],
      lastUpdated: new Date().toISOString(),
      status: 'active'
    });

    this.addPatient({
      id: 'PHID-1K4J2B9-ABC456',
      name: 'Priya Patel',
      score: 720,
      activities: [],
      lastUpdated: new Date().toISOString(),
      status: 'active'
    });

    this.addPatient({
      id: 'PHID-1K4J2C7-DEF789',
      name: 'Amit Kumar',
      score: 680,
      activities: [],
      lastUpdated: new Date().toISOString(),
      status: 'active'
    });
  }

  private setupCrossSiteCommunication() {
    // Listen for messages from patient site
    window.addEventListener('message', (event) => {
      if (event.data.type === 'SCORE_UPDATE') {
        this.updatePatientData(event.data.data);
      }
    });

    // Also listen for local storage changes (for same-origin communication)
    window.addEventListener('storage', (e) => {
      if (e.key === 'patientCreditScore' || e.key === 'patientActivities') {
        this.syncFromLocalStorage();
      }
    });
  }

  private syncFromLocalStorage() {
    try {
      const savedScore = localStorage.getItem('patientCreditScore');
      const savedActivities = localStorage.getItem('patientActivities');
      
      if (savedScore) {
        const score = parseInt(savedScore);
        const patientId = 'PHID-1K4J2A8-XYZ123'; // Default patient
        
        if (this.patients.has(patientId)) {
          const patient = this.patients.get(patientId);
          patient.score = score;
          patient.lastUpdated = new Date().toISOString();
          
          if (savedActivities) {
            patient.activities = JSON.parse(savedActivities);
          }
          
          this.patients.set(patientId, patient);
          this.notifyListeners();
        }
      }
    } catch (error) {
      console.error('Error syncing from localStorage:', error);
    }
  }

  addPatient(patient: any) {
    this.patients.set(patient.id, patient);
    this.notifyListeners();
  }

  updatePatientData(data: any) {
    const { patientId, newScore, activity } = data;
    
    if (this.patients.has(patientId)) {
      const patient = this.patients.get(patientId);
      patient.score = newScore;
      patient.lastUpdated = new Date().toISOString();
      
      if (activity) {
        patient.activities.unshift(activity);
        // Keep only last 20 activities for provider view
        if (patient.activities.length > 20) {
          patient.activities = patient.activities.slice(0, 20);
        }
      }
      
      this.patients.set(patientId, patient);
      this.notifyListeners();
    }
  }

  getPatient(patientId: string) {
    return this.patients.get(patientId);
  }

  getAllPatients() {
    return Array.from(this.patients.values());
  }

  getActivePatients() {
    return this.getAllPatients().filter(p => p.status === 'active');
  }

  getPatientsByScoreRange(min: number, max: number) {
    return this.getAllPatients().filter(p => p.score >= min && p.score <= max);
  }

  subscribe(listener: (patients: Map<string, any>) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.patients));
  }

  // Analytics methods
  getAverageScore() {
    const patients = this.getActivePatients();
    if (patients.length === 0) return 0;
    return patients.reduce((sum, p) => sum + p.score, 0) / patients.length;
  }

  getScoreDistribution() {
    const patients = this.getActivePatients();
    const distribution = {
      excellent: patients.filter(p => p.score >= 800).length,
      good: patients.filter(p => p.score >= 650 && p.score < 800).length,
      fair: patients.filter(p => p.score >= 500 && p.score < 650).length,
      poor: patients.filter(p => p.score < 500).length
    };
    return distribution;
  }

  getRecentActivities(limit: number = 10) {
    const allActivities: any[] = [];
    
    this.patients.forEach((patient) => {
      patient.activities.forEach((activity: any) => {
        allActivities.push({
          ...activity,
          patientName: patient.name,
          patientId: patient.id
        });
      });
    });
    
    return allActivities
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
}

export default PatientDataService;
