// Shared Score Service for Cross-Site Communication
class ScoreService {
  private static instance: ScoreService;
  private score: number = 750;
  private activities: any[] = [];
  private listeners: ((score: number) => void)[] = [];

  private constructor() {
    this.loadFromStorage();
  }

  static getInstance(): ScoreService {
    if (!ScoreService.instance) {
      ScoreService.instance = new ScoreService();
    }
    return ScoreService.instance;
  }

  private loadFromStorage() {
    try {
      const savedScore = localStorage.getItem('patientCreditScore');
      const savedActivities = localStorage.getItem('patientActivities');
      
      if (savedScore) {
        this.score = parseInt(savedScore);
      }
      
      if (savedActivities) {
        this.activities = JSON.parse(savedActivities);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('patientCreditScore', this.score.toString());
      localStorage.setItem('patientActivities', JSON.stringify(this.activities));
    } catch (error) {
      console.error('Error saving to storage:', error);
    }
  }

  getScore(): number {
    return this.score;
  }

  getActivities(): any[] {
    return this.activities;
  }

  updateScore(points: number, activityType: string, title: string) {
    const oldScore = this.score;
    this.score = Math.min(1000, Math.max(0, this.score + points));
    
    const activity = {
      id: Date.now(),
      type: activityType,
      title: title,
      points: points,
      scoreChange: this.score - oldScore,
      timestamp: new Date().toISOString()
    };

    this.activities.unshift(activity);
    
    // Keep only last 50 activities
    if (this.activities.length > 50) {
      this.activities = this.activities.slice(0, 50);
    }

    this.saveToStorage();
    this.notifyListeners();
    
    // Dispatch custom event for cross-component communication
    window.dispatchEvent(new CustomEvent('scoreUpdate', {
      detail: {
        newScore: this.score,
        activity: activity,
        oldScore: oldScore
      }
    }));

    return this.score;
  }

  subscribe(listener: (score: number) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.score));
  }

  // Provider site methods
  getPatientData(patientId: string) {
    return {
      score: this.score,
      activities: this.activities,
      lastUpdated: new Date().toISOString()
    };
  }

  // Cross-site communication
  broadcastUpdate(data: any) {
    // This will be used for cross-site communication
    window.postMessage({
      type: 'SCORE_UPDATE',
      data: data
    }, '*');
  }
}

export default ScoreService;
