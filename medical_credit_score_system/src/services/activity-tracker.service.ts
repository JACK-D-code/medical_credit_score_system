interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  timestamp: Date;
  duration: number;
  value: number;
  metadata: Record<string, any>;
}

interface ComponentValue {
  componentId: string;
  moduleName: string;
  currentValue: number;
  targetValue: number;
  lastUpdated: Date;
  activities: string[];
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface ValueIncreaseRule {
  action: string;
  module: string;
  baseValue: number;
  increaseRate: number;
  maxValue: number;
  conditions: string[];
}

export class ActivityTrackerService {
  private static activities: UserActivity[] = [];
  private static componentValues: Record<string, ComponentValue> = {};
  private static valueIncreaseRules: ValueIncreaseRule[] = [];

  // Initialize value increase rules
  static initializeRules() {
    this.valueIncreaseRules = [
      // Credit Score Module
      {
        action: 'calculate_credit_score',
        module: 'credit-engine',
        baseValue: 10,
        increaseRate: 2,
        maxValue: 100,
        conditions: ['Score calculated successfully', 'Processing time < 3 seconds']
      },
      {
        action: 'approve_credit_application',
        module: 'credit-engine',
        baseValue: 15,
        increaseRate: 3,
        maxValue: 150,
        conditions: ['Application approved', 'Credit score > 750']
      },
      {
        action: 'process_emi_payment',
        module: 'emi-management',
        baseValue: 5,
        increaseRate: 2,
        maxValue: 80,
        conditions: ['Payment processed', 'On-time payment']
      },

      // Treatment Authorization Module
      {
        action: 'authorize_treatment',
        module: 'treatment-authorization',
        baseValue: 10,
        increaseRate: 2.5,
        maxValue: 100,
        conditions: ['Treatment authorized', 'Processing time < 5 minutes']
      },
      {
        action: 'batch_approval',
        module: 'treatment-authorization',
        baseValue: 20,
        increaseRate: 4,
        maxValue: 150,
        conditions: ['Multiple treatments approved', 'Time saved > 10 minutes']
      },

      // Patient Management Module
      {
        action: 'register_patient',
        module: 'patient-management',
        baseValue: 5,
        increaseRate: 1,
        maxValue: 50,
        conditions: ['Patient registered', 'Complete profile']
      },
      {
        action: 'update_patient_profile',
        module: 'patient-management',
        baseValue: 3,
        increaseRate: 1.5,
        maxValue: 60,
        conditions: ['Profile updated', 'Data verified']
      },

      // Finance Provider Module
      {
        action: 'process_loan',
        module: 'finance-provider',
        baseValue: 8,
        increaseRate: 2,
        maxValue: 100,
        conditions: ['Loan disbursed', 'Risk assessment accurate']
      },
      {
        action: 'recover_payment',
        module: 'finance-provider',
        baseValue: 12,
        increaseRate: 3,
        maxValue: 120,
        conditions: ['Payment recovered', 'Collection successful']
      },

      // Hospital Admin Module
      {
        action: 'manage_department',
        module: 'hospital-admin',
        baseValue: 6,
        increaseRate: 1.5,
        maxValue: 80,
        conditions: ['Department optimized', 'Efficiency improved']
      },
      {
        action: 'generate_report',
        module: 'hospital-admin',
        baseValue: 10,
        increaseRate: 2.5,
        maxValue: 100,
        conditions: ['Report generated', 'Insights provided']
      },

      // Doctor Module
      {
        action: 'diagnose_patient',
        module: 'doctor',
        baseValue: 4,
        increaseRate: 1.5,
        maxValue: 60,
        conditions: ['Diagnosis completed', 'Treatment plan created']
      },
      {
        action: 'prescribe_treatment',
        module: 'doctor',
        baseValue: 6,
        increaseRate: 2,
        maxValue: 80,
        conditions: ['Treatment prescribed', 'Patient informed']
      }
    ];
  }

  // Track user activity
  static trackActivity(userId: string, userName: string, action: string, module: string, duration: number = 0, metadata: Record<string, any> = {}): void {
    const activity: UserActivity = {
      id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      userName,
      action,
      module,
      timestamp: new Date(),
      duration,
      value: this.calculateActivityValue(action, module, metadata),
      metadata
    };

    this.activities.push(activity);
    this.updateComponentValue(module, action, metadata);
    this.saveActivity(activity);
  }

  // Calculate activity value
  private static calculateActivityValue(action: string, module: string, metadata: Record<string, any>): number {
    const rule = this.valueIncreaseRules.find(r => r.action === action && r.module === module);
    
    if (!rule) return 1;

    let value = rule.baseValue;
    
    // Apply conditions
    const conditionsMet = rule.conditions.every(condition => {
      return this.evaluateCondition(condition, metadata);
    });

    if (conditionsMet) {
      value += rule.increaseRate * rule.baseValue;
    }

    return Math.min(value, rule.maxValue);
  }

  // Evaluate condition
  private static evaluateCondition(condition: string, metadata: Record<string, any>): boolean {
    switch (condition) {
      case 'Score calculated successfully':
        return metadata.success === true && metadata.processingTime < 3;
      case 'Application approved':
        return metadata.approved === true && metadata.creditScore > 750;
      case 'Processing time < 3 seconds':
        return metadata.processingTime < 3;
      case 'Treatment authorized':
        return metadata.authorized === true && metadata.processingTime < 300;
      case 'Multiple treatments approved':
        return metadata.count > 1 && metadata.timeSaved > 600;
      case 'Patient registered':
        return metadata.profileComplete === true;
      case 'Profile updated':
        return metadata.verified === true;
      case 'Loan disbursed':
        return metadata.disbursed === true;
      case 'Payment recovered':
        return metadata.collected === true;
      case 'Department optimized':
        return metadata.efficiencyGain > 0.1;
      case 'Report generated':
        return metadata.insightsProvided === true;
      case 'Diagnosis completed':
        return metadata.diagnosisComplete === true;
      case 'Treatment prescribed':
        return metadata.patientInformed === true;
      default:
        return true;
    }
  }

  // Update component value
  private static updateComponentValue(module: string, action: string, metadata: Record<string, any>): void {
    if (!this.componentValues[module]) {
      this.componentValues[module] = {
        componentId: module,
        moduleName: this.getModuleName(module),
        currentValue: 0,
        targetValue: 100,
        lastUpdated: new Date(),
        activities: [],
        level: 'bronze'
      };
    }

    const component = this.componentValues[module];
    const activityValue = this.calculateActivityValue(action, module, metadata);
    
    component.currentValue = Math.min(component.currentValue + activityValue, 100);
    component.lastUpdated = new Date();
    component.activities.push(`${action}_${Date.now()}`);
    
    // Update level based on current value
    component.level = this.calculateLevel(component.currentValue);
    
    this.saveComponentValue(component);
  }

  // Get module name
  private static getModuleName(module: string): string {
    const moduleNames: Record<string, string> = {
      'credit-engine': 'Credit Scoring Engine',
      'treatment-authorization': 'Treatment Authorization',
      'patient-management': 'Patient Management',
      'finance-provider': 'Finance Provider',
      'hospital-admin': 'Hospital Administration',
      'doctor': 'Doctor Portal',
      'emi-management': 'EMI Management'
    };
    return moduleNames[module] || module;
  }

  // Calculate component level
  private static calculateLevel(value: number): 'bronze' | 'silver' | 'gold' | 'platinum' {
    if (value >= 80) return 'platinum';
    if (value >= 60) return 'gold';
    if (value >= 40) return 'silver';
    return 'bronze';
  }

  // Save activity to storage
  private static saveActivity(activity: UserActivity): void {
    try {
      const activities = this.getStoredActivities();
      activities.push(activity);
      
      // Keep only last 100 activities
      if (activities.length > 100) {
        activities.splice(0, activities.length - 100);
      }
      
      localStorage.setItem('user_activities', JSON.stringify(activities));
    } catch (error) {
      console.error('Error saving activity:', error);
    }
  }

  // Save component value to storage
  private static saveComponentValue(component: ComponentValue): void {
    try {
      const values = this.getComponentValues();
      values[component.componentId] = component;
      localStorage.setItem('component_values', JSON.stringify(values));
    } catch (error) {
      console.error('Error saving component value:', error);
    }
  }

  // Get stored activities
  private static getStoredActivities(): UserActivity[] {
    try {
      const stored = localStorage.getItem('user_activities');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error getting stored activities:', error);
      return [];
    }
  }

  // Get component values
  private static getComponentValues(): Record<string, ComponentValue> {
    try {
      const stored = localStorage.getItem('component_values');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error getting component values:', error);
      return {};
    }
  }

  // Get all component values
  static getAllComponentValues(): Record<string, ComponentValue> {
    this.getComponentValues();
    return this.componentValues;
  }

  // Get component value
  static getComponentValue(module: string): ComponentValue | null {
    this.getComponentValues();
    return this.componentValues[module] || null;
  }

  // Get recent activities
  static getRecentActivities(limit: number = 10): UserActivity[] {
    const activities = this.getStoredActivities();
    return activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Get activities by module
  static getActivitiesByModule(module: string, limit: number = 10): UserActivity[] {
    const activities = this.getStoredActivities();
    return activities
      .filter(activity => activity.module === module)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Get total value score
  static getTotalValueScore(): number {
    const values = this.getAllComponentValues();
    return Object.values(values).reduce((sum, component) => sum + component.currentValue, 0);
  }

  // Get value leaderboard
  static getValueLeaderboard(limit: number = 5): Array<{module: string, value: number, level: string}> {
    const values = this.getAllComponentValues();
    return Object.entries(values)
      .sort(([, a], [, b]) => b[1].currentValue - a[1].currentValue)
      .slice(0, limit)
      .map(([module, component]) => ({
        module: component.moduleName,
        value: component.currentValue,
        level: component.level
      }));
  }

  // Reset component values (for testing)
  static resetAllValues(): void {
    this.componentValues = {};
    this.activities = [];
    localStorage.removeItem('user_activities');
    localStorage.removeItem('component_values');
  }

  // Export data for analysis
  static exportActivityData(): {
    activities: UserActivity[];
    componentValues: Record<string, ComponentValue>;
    totalScore: number;
  } {
    return {
      activities: this.getStoredActivities(),
      componentValues: this.getAllComponentValues(),
      totalScore: this.getTotalValueScore()
    };
  }

  // Get value increase suggestions
  static getValueIncreaseSuggestions(module: string): Array<{action: string; description: string; potentialValue: number}> {
    const component = this.getComponentValue(module);
    if (!component) return [];

    const currentValue = component.currentValue;
    const suggestions = [];

    // Find rules for this module
    const moduleRules = this.valueIncreaseRules.filter(rule => rule.module === module);
    
    for (const rule of moduleRules) {
      if (currentValue < rule.maxValue) {
        const potentialIncrease = Math.min(
          rule.increaseRate * rule.baseValue,
          rule.maxValue - currentValue
        );
        
        suggestions.push({
          action: rule.action,
          description: `${rule.conditions.join(' & ')} → +${potentialIncrease} points`,
          potentialValue: currentValue + potentialIncrease
        });
      }
    }

    return suggestions.sort((a, b) => b.potentialValue - a.potentialValue);
  }
}

// Initialize rules on load
ActivityTrackerService.initializeRules();
