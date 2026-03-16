import axios from 'axios';
import { io, Socket } from 'socket.io-client';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// WebSocket connection
let socket: Socket | null = null;

export const connectWebSocket = () => {
  const token = localStorage.getItem('accessToken');
  if (token && !socket) {
    socket = io(WS_URL, {
      auth: { token }
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }
  return socket;
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Types
export interface Patient {
  id: string;
  name: string;
  age: number;
  creditScore: number;
  loyaltyLevel: string;
  lastVisit: string;
  totalVisits: number;
  adherenceScore: number;
  paymentHistory: string;
  trustScore: number;
  treatmentHistory: string;
  insuranceStatus: string;
  nextAppointment: string;
  status: string;
}

export interface ProviderEvaluation {
  id: string;
  patientId: string;
  patientName: string;
  evaluationType: string;
  bonusPoints: number;
  reason: string;
  comments: string;
  providerName: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: string;
  duration: number;
  status: string;
  creditScore: number;
}

export interface ProviderStats {
  totalPatients: number;
  todayAppointments: number;
  pendingEvaluations: number;
  completedEvaluations: number;
  averageCreditScore: number;
  totalBonusPoints: number;
  monthlyRevenue: number;
  activeEMIPlans: number;
}

export interface EvaluationType {
  value: string;
  label: string;
  maxPoints: number;
  description: string;
}

// Provider API Service
export class ProviderApiService {
  // WebSocket Events
  static onScoreUpdate(callback: (data: any) => void) {
    if (socket) {
      socket.on('patient-score-update', callback);
    }
  }

  static onEvaluationUpdate(callback: (data: any) => void) {
    if (socket) {
      socket.on('evaluation-update', callback);
    }
  }

  static onAppointmentUpdate(callback: (data: any) => void) {
    if (socket) {
      socket.on('appointment-update', callback);
    }
  }

  // Dashboard APIs
  static async getProviderStats(): Promise<ProviderStats> {
    try {
      const response = await api.get('/providers/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching provider stats:', error);
      throw error;
    }
  }

  static async getTodayAppointments(): Promise<Appointment[]> {
    try {
      const response = await api.get('/providers/appointments/today');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching today appointments:', error);
      throw error;
    }
  }

  static async getUpcomingAppointments(days: number = 7): Promise<Appointment[]> {
    try {
      const response = await api.get(`/providers/appointments/upcoming?days=${days}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      throw error;
    }
  }

  // Patient Management APIs
  static async getPatients(filters?: {
    search?: string;
    loyaltyLevel?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ patients: Patient[]; total: number; page: number; totalPages: number }> {
    try {
      const params = new URLSearchParams();
      if (filters?.search) params.append('search', filters.search);
      if (filters?.loyaltyLevel) params.append('loyaltyLevel', filters.loyaltyLevel);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/providers/patients?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  }

  static async getPatientById(patientId: string): Promise<Patient> {
    try {
      const response = await api.get(`/providers/patients/${patientId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }
  }

  static async addPatient(patientData: Partial<Patient>): Promise<Patient> {
    try {
      const response = await api.post('/providers/patients', patientData);
      return response.data.data;
    } catch (error) {
      console.error('Error adding patient:', error);
      throw error;
    }
  }

  static async updatePatient(patientId: string, patientData: Partial<Patient>): Promise<Patient> {
    try {
      const response = await api.put(`/providers/patients/${patientId}`, patientData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating patient:', error);
      throw error;
    }
  }

  // Credit Score APIs
  static async getPatientCreditScore(patientId: string): Promise<any> {
    try {
      const response = await api.get(`/credit-scores/patient/${patientId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching patient credit score:', error);
      throw error;
    }
  }

  static async calculatePatientCreditScore(patientId: string): Promise<any> {
    try {
      const response = await api.post(`/credit-scores/calculate/${patientId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error calculating patient credit score:', error);
      throw error;
    }
  }

  static async getPatientScoreFactors(patientId: string): Promise<any> {
    try {
      const response = await api.get(`/credit-scores/patient/${patientId}/factors`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching patient score factors:', error);
      throw error;
    }
  }

  // Evaluation APIs
  static async getEvaluationTypes(): Promise<EvaluationType[]> {
    try {
      const response = await api.get('/providers/evaluations/types');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching evaluation types:', error);
      throw error;
    }
  }

  static async submitEvaluation(evaluationData: {
    patientId: string;
    evaluationType: string;
    bonusPoints: number;
    reason: string;
    comments?: string;
  }): Promise<ProviderEvaluation> {
    try {
      const response = await api.post('/providers/evaluations', evaluationData);
      return response.data.data;
    } catch (error) {
      console.error('Error submitting evaluation:', error);
      throw error;
    }
  }

  static async getEvaluations(filters?: {
    patientId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ evaluations: ProviderEvaluation[]; total: number; page: number; totalPages: number }> {
    try {
      const params = new URLSearchParams();
      if (filters?.patientId) params.append('patientId', filters.patientId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/providers/evaluations?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      throw error;
    }
  }

  static async getEvaluationById(evaluationId: string): Promise<ProviderEvaluation> {
    try {
      const response = await api.get(`/providers/evaluations/${evaluationId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching evaluation:', error);
      throw error;
    }
  }

  static async updateEvaluation(evaluationId: string, evaluationData: Partial<ProviderEvaluation>): Promise<ProviderEvaluation> {
    try {
      const response = await api.put(`/providers/evaluations/${evaluationId}`, evaluationData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating evaluation:', error);
      throw error;
    }
  }

  static async deleteEvaluation(evaluationId: string): Promise<void> {
    try {
      await api.delete(`/providers/evaluations/${evaluationId}`);
    } catch (error) {
      console.error('Error deleting evaluation:', error);
      throw error;
    }
  }

  // Appointment APIs
  static async getAppointments(filters?: {
    patientId?: string;
    date?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ appointments: Appointment[]; total: number; page: number; totalPages: number }> {
    try {
      const params = new URLSearchParams();
      if (filters?.patientId) params.append('patientId', filters.patientId);
      if (filters?.date) params.append('date', filters.date);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/providers/appointments?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  static async createAppointment(appointmentData: {
    patientId: string;
    appointmentType: string;
    title: string;
    description?: string;
    scheduledFor: string;
    duration?: number;
    cost?: number;
  }): Promise<Appointment> {
    try {
      const response = await api.post('/providers/appointments', appointmentData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  static async updateAppointment(appointmentId: string, appointmentData: Partial<Appointment>): Promise<Appointment> {
    try {
      const response = await api.put(`/providers/appointments/${appointmentId}`, appointmentData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }

  static async cancelAppointment(appointmentId: string, reason?: string): Promise<void> {
    try {
      await api.post(`/providers/appointments/${appointmentId}/cancel`, { reason });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }

  // Billing APIs
  static async createBill(billData: {
    patientId: string;
    title: string;
    description?: string;
    totalAmount: number;
    dueDate: string;
  }): Promise<any> {
    try {
      const response = await api.post('/billing/bills', billData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating bill:', error);
      throw error;
    }
  }

  static async getBills(filters?: {
    patientId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<any> {
    try {
      const params = new URLSearchParams();
      if (filters?.patientId) params.append('patientId', filters.patientId);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/billing/bills?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching bills:', error);
      throw error;
    }
  }

  static async calculateEMIOptions(patientId: string, amount: number): Promise<any> {
    try {
      const response = await api.post('/billing/emi-options', {
        patientId,
        amount
      });
      return response.data.data;
    } catch (error) {
      console.error('Error calculating EMI options:', error);
      throw error;
    }
  }

  // Analytics APIs
  static async getRevenueAnalytics(period: string = 'monthly'): Promise<any> {
    try {
      const response = await api.get(`/providers/analytics/revenue?period=${period}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error;
    }
  }

  static async getPatientAnalytics(): Promise<any> {
    try {
      const response = await api.get('/providers/analytics/patients');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching patient analytics:', error);
      throw error;
    }
  }

  static async getEvaluationAnalytics(): Promise<any> {
    try {
      const response = await api.get('/providers/analytics/evaluations');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching evaluation analytics:', error);
      throw error;
    }
  }

  // Report Generation
  static async generatePatientReport(filters?: {
    dateRange?: string;
    loyaltyLevel?: string;
    format?: 'pdf' | 'excel';
  }): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      if (filters?.dateRange) params.append('dateRange', filters.dateRange);
      if (filters?.loyaltyLevel) params.append('loyaltyLevel', filters.loyaltyLevel);
      if (filters?.format) params.append('format', filters.format);

      const response = await api.get(`/providers/reports/patients?${params}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating patient report:', error);
      throw error;
    }
  }

  static async generateEvaluationReport(filters?: {
    dateRange?: string;
    status?: string;
    format?: 'pdf' | 'excel';
  }): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      if (filters?.dateRange) params.append('dateRange', filters.dateRange);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.format) params.append('format', filters.format);

      const response = await api.get(`/providers/reports/evaluations?${params}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating evaluation report:', error);
      throw error;
    }
  }

  static async generateRevenueReport(filters?: {
    period?: string;
    format?: 'pdf' | 'excel';
  }): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      if (filters?.period) params.append('period', filters.period);
      if (filters?.format) params.append('format', filters.format);

      const response = await api.get(`/providers/reports/revenue?${params}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating revenue report:', error);
      throw error;
    }
  }

  // Utility Methods
  static downloadReport(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  static formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  static formatTime(time: string): string {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// Initialize WebSocket connection
connectWebSocket();

export default ProviderApiService;
