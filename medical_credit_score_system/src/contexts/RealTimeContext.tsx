import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import ApiService from '../services/api.service';

// Types
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
  calculatedAt: string;
}

interface RealTimeState {
  currentPatient: Patient | null;
  applications: CreditApplication[];
  currentCreditScore: CreditScore | null;
  isConnected: boolean;
  isLoading: boolean;
  isProcessingApplication: boolean;
  lastUpdate: string | null;
}

interface RealTimeContextType extends RealTimeState {
  setCurrentPatient: (patient: Patient | null) => void;
  processApplication: (applicationData: any) => Promise<void>;
  updateCreditScore: (patientId: string, paymentData: any) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setConnectionStatus: (connected: boolean) => void;
}

// Action types
type RealTimeAction = 
  | { type: 'SET_PATIENT'; payload: Patient | null }
  | { type: 'ADD_APPLICATION'; payload: CreditApplication }
  | { type: 'UPDATE_APPLICATION'; payload: { id: string; updates: Partial<CreditApplication> } }
  | { type: 'SET_CREDIT_SCORE'; payload: CreditScore }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_CONNECTION'; payload: boolean }
  | { type: 'CREDIT_SCORE_UPDATE'; payload: any }
  | { type: 'APPLICATION_UPDATE'; payload: any }
  | { type: 'NEW_BILL'; payload: any };

// Reducer
const realTimeReducer = (state: RealTimeState, action: RealTimeAction): RealTimeState => {
  switch (action.type) {
    case 'SET_PATIENT':
      return { ...state, currentPatient: action.payload };
    
    case 'ADD_APPLICATION':
      return { ...state, applications: [...state.applications, action.payload] };
    
    case 'UPDATE_APPLICATION':
      return {
        ...state,
        applications: state.applications.map(app =>
          app.id === action.payload.id ? { ...app, ...action.payload.updates } : app
        )
      };
    
    case 'SET_CREDIT_SCORE':
      return { ...state, currentCreditScore: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_PROCESSING':
      return { ...state, isProcessingApplication: action.payload };
    
    case 'SET_CONNECTION':
      return { ...state, isConnected: action.payload };
    
    case 'CREDIT_SCORE_UPDATE':
      return { ...state, lastUpdate: new Date().toISOString() };
    
    case 'APPLICATION_UPDATE':
      return { ...state, lastUpdate: new Date().toISOString() };
    
    case 'NEW_BILL':
      return { ...state, lastUpdate: new Date().toISOString() };
    
    default:
      return state;
  }
};

// Initial state
const initialState: RealTimeState = {
  currentPatient: null,
  applications: [],
  currentCreditScore: null,
  isConnected: false,
  isLoading: false,
  isProcessingApplication: false,
  lastUpdate: null,
};

// Context
const RealTimeContext = createContext<RealTimeContextType | undefined>(undefined);

// Provider component
export const RealTimeProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(realTimeReducer, initialState);

  // WebSocket connection
  useEffect(() => {
    const ws = ApiService.connectWebSocket();
    
    // Set up event listeners for WebSocket messages
    const handleCreditScoreUpdate = (event: CustomEvent) => {
      dispatch({ type: 'CREDIT_SCORE_UPDATE', payload: event.detail });
    };

    const handleApplicationUpdate = (event: CustomEvent) => {
      dispatch({ type: 'APPLICATION_UPDATE', payload: event.detail });
      const data = event.detail as any;
      dispatch({
        type: 'UPDATE_APPLICATION',
        payload: { id: data.id, updates: data }
      });
    };

    const handleNewBill = (event: CustomEvent) => {
      dispatch({ type: 'NEW_BILL', payload: event.detail });
    };

    window.addEventListener('creditScoreUpdate', handleCreditScoreUpdate);
    window.addEventListener('applicationUpdate', handleApplicationUpdate);
    window.addEventListener('newBill', handleNewBill);

    return () => {
      window.removeEventListener('creditScoreUpdate', handleCreditScoreUpdate);
      window.removeEventListener('applicationUpdate', handleApplicationUpdate);
      window.removeEventListener('newBill', handleNewBill);
      ws.close();
    };
  }, []);

  // Actions
  const setCurrentPatient = (patient: Patient | null) => {
    dispatch({ type: 'SET_PATIENT', payload: patient });
  };

  const processApplication = async (applicationData: any) => {
    dispatch({ type: 'SET_PROCESSING', payload: true });
    
    try {
      const result = await ApiService.processCreditApplication(applicationData);
      dispatch({ type: 'ADD_APPLICATION', payload: result.application });
      
      // Update application status after processing
      setTimeout(() => {
        dispatch({
          type: 'UPDATE_APPLICATION',
          payload: { id: result.application.id, updates: result.application }
        });
      }, result.processingTime * 1000);
      
    } catch (error) {
      console.error('Application processing failed:', error);
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  };

  const updateCreditScore = async (patientId: string, paymentData: any) => {
    try {
      const result = await ApiService.updateCreditScore(patientId, paymentData);
      dispatch({ type: 'SET_CREDIT_SCORE', payload: result.updatedScore });
    } catch (error) {
      console.error('Credit score update failed:', error);
    }
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setConnectionStatus = (connected: boolean) => {
    dispatch({ type: 'SET_CONNECTION', payload: connected });
  };

  const contextValue: RealTimeContextType = {
    ...state,
    setCurrentPatient,
    processApplication,
    updateCreditScore,
    setLoading,
    setConnectionStatus,
  };

  return (
    <RealTimeContext.Provider value={contextValue}>
      {children}
    </RealTimeContext.Provider>
  );
};

// Hook to use the context
export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (context === undefined) {
    throw new Error('useRealTime must be used within a RealTimeProvider');
  }
  return context;
};

// Custom hooks for specific data
export const useCurrentPatient = () => {
  const { currentPatient, setCurrentPatient } = useRealTime();
  return { currentPatient, setCurrentPatient };
};

export const useApplications = () => {
  const { applications } = useRealTime();
  return { applications };
};

export const useCreditScore = () => {
  const { currentCreditScore } = useRealTime();
  return { currentCreditScore };
};

export const useConnectionStatus = () => {
  const { isConnected, setConnectionStatus } = useRealTime();
  return { isConnected, setConnectionStatus };
};

export const useApplicationProcessor = () => {
  const { processApplication, isProcessingApplication } = useRealTime();
  return { processApplication, isProcessingApplication };
};
