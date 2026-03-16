import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface Patient {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  creditScore: number;
  treatmentHistory: any[];
  insuranceCoverage: number;
  annualIncome: number;
  existingMedicalDebt: number;
}

interface CreditApplication {
  id: string;
  patientId: string;
  patientName: string;
  treatmentType: string;
  requestedAmount: number;
  creditScore: number;
  status: 'pending' | 'approved' | 'rejected';
  emiPlan?: {
    monthlyAmount: number;
    duration: number;
    interestRate: number;
    totalAmount: number;
  };
  processingTime?: number;
  createdAt: string;
}

interface CreditScore {
  scoreValue: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendation: 'instant_approval' | 'manual_review' | 'denied';
  factors: {
    paymentHistory: { score: number; weight: number };
    incomeStability: { score: number; weight: number };
    medicalDebt: { score: number; weight: number };
    insuranceCoverage: { score: number; weight: number };
  };
  breakdown: {
    paymentHistoryContribution: number;
    incomeStabilityContribution: number;
    medicalDebtContribution: number;
    insuranceCoverageContribution: number;
    bonusContribution: number;
  };
  calculatedAt: string;
}

interface CreditStore {
  // Patient state
  currentPatient: Patient | null;
  patients: Patient[];
  
  // Credit application state
  applications: CreditApplication[];
  currentApplication: CreditApplication | null;
  
  // Credit score state
  creditScores: Record<string, CreditScore>;
  currentCreditScore: CreditScore | null;
  
  // Real-time updates
  lastUpdate: string | null;
  isConnected: boolean;
  
  // Loading states
  isLoading: boolean;
  isProcessingApplication: boolean;
  
  // Actions
  setCurrentPatient: (patient: Patient | null) => void;
  setPatients: (patients: Patient[]) => void;
  addApplication: (application: CreditApplication) => void;
  updateApplication: (id: string, updates: Partial<CreditApplication>) => void;
  setCurrentApplication: (application: CreditApplication | null) => void;
  setCreditScore: (patientId: string, creditScore: CreditScore) => void;
  updateCreditScore: (patientId: string, updates: Partial<CreditScore>) => void;
  setLoading: (loading: boolean) => void;
  setProcessingApplication: (processing: boolean) => void;
  setConnectionStatus: (connected: boolean) => void;
  setLastUpdate: (timestamp: string) => void;
  
  // Real-time actions
  handleCreditScoreUpdate: (data: any) => void;
  handleApplicationUpdate: (data: any) => void;
  handleNewBill: (data: any) => void;
  handlePaymentReceived: (data: any) => void;
}

export const useCreditStore = create<CreditStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentPatient: null,
        patients: [],
        applications: [],
        currentApplication: null,
        creditScores: {},
        currentCreditScore: null,
        lastUpdate: null,
        isConnected: false,
        isLoading: false,
        isProcessingApplication: false,

        // Patient actions
        setCurrentPatient: (patient) => set({ currentPatient: patient }),
        setPatients: (patients) => set({ patients }),
        addApplication: (application) => set((state) => ({ 
          applications: [...state.applications, application] 
        })),
        updateApplication: (id, updates) => set((state) => ({
          applications: state.applications.map(app => 
            app.id === id ? { ...app, ...updates } : app
          )
        })),
        setCurrentApplication: (application) => set({ currentApplication: application }),

        // Credit score actions
        setCreditScore: (patientId, creditScore) => set((state) => ({
          creditScores: { ...state.creditScores, [patientId]: creditScore }
        })),
        updateCreditScore: (patientId, updates) => set((state) => {
          const currentScore = state.creditScores[patientId];
          if (currentScore) {
            return {
              creditScores: {
                ...state.creditScores,
                [patientId]: { ...currentScore, ...updates }
              }
            };
          }
          return state;
        }),
        setCurrentCreditScore: (creditScore) => set({ currentCreditScore: creditScore }),

        // Loading actions
        setLoading: (loading) => set({ isLoading: loading }),
        setProcessingApplication: (processing) => set({ isProcessingApplication: processing }),
        setConnectionStatus: (connected) => set({ isConnected: connected }),
        setLastUpdate: (timestamp) => set({ lastUpdate: timestamp }),

        // Real-time event handlers
        handleCreditScoreUpdate: (data) => {
          const { patientId, creditScore } = data;
          console.log('Real-time credit score update:', data);
          
          set((state) => ({
            creditScores: { ...state.creditScores, [patientId]: creditScore },
            lastUpdate: new Date().toISOString()
          }));

          // Update current patient if it matches
          const { currentPatient } = get();
          if (currentPatient && currentPatient.id === patientId) {
            set({ currentPatient: { ...currentPatient, creditScore: creditScore.scoreValue } });
          }
        },

        handleApplicationUpdate: (data) => {
          console.log('Real-time application update:', data);
          const { id, status, emiPlan, processingTime } = data;
          
          set((state) => ({
            applications: state.applications.map(app => 
              app.id === id ? { ...app, status, emiPlan, processingTime } : app
            ),
            lastUpdate: new Date().toISOString()
          }));

          // Update current application if it matches
          const { currentApplication } = get();
          if (currentApplication && currentApplication.id === id) {
            set({ 
              currentApplication: { ...currentApplication, status, emiPlan, processingTime }
            });
          }
        },

        handleNewBill: (data) => {
          console.log('Real-time new bill:', data);
          const { patientId, bill } = data;
          
          // Update patient's treatment history
          const { patients } = get();
          const patient = patients.find(p => p.id === patientId);
          if (patient) {
            set((state) => ({
              patients: state.patients.map(p => 
                p.id === patientId 
                  ? { 
                      ...p, 
                      treatmentHistory: [...(p.treatmentHistory || []), bill]
                    } 
                  : p
              ),
              lastUpdate: new Date().toISOString()
            }));
          }
        },

        handlePaymentReceived: (data) => {
          console.log('Real-time payment received:', data);
          const { patientId, amount, newCreditScore } = data;
          
          // Update credit score
          get().handleCreditScoreUpdate({ patientId, creditScore: newCreditScore });
          
          set((state) => ({
            lastUpdate: new Date().toISOString()
          }));
        }
      }),
      {
        name: 'credit-store',
        partialize: (state) => ({
          // Only persist these fields
          currentPatient: state.currentPatient,
          patients: state.patients,
          applications: state.applications,
          creditScores: state.creditScores,
        })
      }
    )
  )
);

// Selectors for easy access
export const useCurrentPatient = () => useCreditStore((state) => state.currentPatient);
export const useApplications = () => useCreditStore((state) => state.applications);
export const useCreditScores = () => useCreditStore((state) => state.creditScores);
export const useConnectionStatus = () => useCreditStore((state) => state.isConnected);
export const useLoadingStates = () => useCreditStore((state) => ({
  isLoading: state.isLoading,
  isProcessingApplication: state.isProcessingApplication
}));
