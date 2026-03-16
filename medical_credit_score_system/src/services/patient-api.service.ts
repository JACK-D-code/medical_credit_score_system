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
      console.log('Patient connected to WebSocket server');
    });

    socket.on('disconnect', () => {
      console.log('Patient disconnected from WebSocket server');
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
export interface PatientProfile {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone?: string;
  address?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  email: string;
  creditScore?: number;
  loyaltyLevel?: string;
  trustScore?: number;
  adherenceScore?: number;
  totalPoints?: number;
  profileComplete?: boolean;
}

export interface CreditScore {
  id: string;
  score: number;
  scoreCategory: string;
  paymentHistoryScore: number;
  insuranceScore: number;
  incomeScore: number;
  medicalRiskScore: number;
  bonusPoints: number;
  calculatedAt: string;
}

export interface MedicalActivity {
  id: string;
  activityType: string;
  activityTitle: string;
  description?: string;
  pointsEarned: number;
  completedAt: string;
  metadata?: any;
}

export interface HealthTask {
  id: string;
  title: string;
  description?: string;
  taskType: string;
  points: number;
  targetValue?: number;
  currentValue: number;
  status: string;
  dueDate?: string;
}

export interface Appointment {
  id: string;
  providerId?: string;
  providerName?: string;
  appointmentType: string;
  title: string;
  description?: string;
  scheduledFor: string;
  duration: number;
  status: string;
  cost?: number;
}

export interface EMIPlan {
  id: string;
  billId: string;
  planNumber: string;
  principalAmount: number;
  interestRate: number;
  processingFee: number;
  totalAmount: number;
  emiAmount: number;
  duration: number;
  startDate: string;
  endDate: string;
  status: string;
  nextPaymentDate: string;
  payments: EMIPayment[];
}

export interface EMIPayment {
  id: string;
  paymentDate: string;
  amount: number;
  status: string;
  transactionId?: string;
}

export interface TreatmentBill {
  id: string;
  billNumber: string;
  title: string;
  description?: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  creditScore: number;
  discountRate: number;
  status: string;
  dueDate: string;
  emiPlans?: EMIPlan[];
}

export interface CharityRequest {
  id: string;
  treatmentId?: string;
  requestedAmount: number;
  reason: string;
  status: string;
  approvedAmount?: number;
  approvedBy?: string;
  approvedAt?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  metadata?: any;
  createdAt: string;
}

export interface ProviderEvaluation {
  id: string;
  providerId?: string;
  providerName?: string;
  evaluationType: string;
  bonusPoints: number;
  reason: string;
  comments?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

// Patient API Service
export class PatientApiService {
  // WebSocket Events
  static onScoreUpdate(callback: (data: any) => void) {
    if (socket) {
      socket.on('score-update', callback);
    }
  }

  static onActivityUpdate(callback: (data: any) => void) {
    if (socket) {
      socket.on('activity-update', callback);
    }
  }

  static onAppointmentUpdate(callback: (data: any) => void) {
    if (socket) {
      socket.on('appointment-update', callback);
    }
  }

  static onPaymentUpdate(callback: (data: any) => void) {
    if (socket) {
      socket.on('payment-update', callback);
    }
  }

  static onNotification(callback: (data: any) => void) {
    if (socket) {
      socket.on('notification', callback);
    }
  }

  // Profile Management
  static async getProfile(): Promise<PatientProfile> {
    try {
      const response = await api.get('/patients/profile');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching patient profile:', error);
      throw error;
    }
  }

  static async updateProfile(profileData: Partial<PatientProfile>): Promise<PatientProfile> {
    try {
      const response = await api.put('/patients/profile', profileData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating patient profile:', error);
      throw error;
    }
  }

  static async uploadDocument(file: File, category: string, description?: string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', category);
      if (description) formData.append('description', description);

      const response = await api.post('/patients/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  }

  static async getDocuments(): Promise<any[]> {
    try {
      const response = await api.get('/patients/documents');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  // Credit Score Management
  static async getCurrentCreditScore(): Promise<CreditScore> {
    try {
      const response = await api.get('/credit-scores/current');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching current credit score:', error);
      throw error;
    }
  }

  static async getCreditScoreHistory(limit: number = 12): Promise<CreditScore[]> {
    try {
      const response = await api.get(`/credit-scores/history?limit=${limit}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching credit score history:', error);
      throw error;
    }
  }

  static async getScoreFactors(): Promise<any> {
    try {
      const response = await api.get('/credit-scores/factors');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching score factors:', error);
      throw error;
    }
  }

  static async getScoreImprovementSuggestions(): Promise<any[]> {
    try {
      const response = await api.get('/credit-scores/suggestions');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching score improvement suggestions:', error);
      throw error;
    }
  }

  static async requestScoreCalculation(): Promise<any> {
    try {
      const response = await api.post('/credit-scores/calculate');
      return response.data.data;
    } catch (error) {
      console.error('Error requesting score calculation:', error);
      throw error;
    }
  }

  // Activity Tracking
  static async trackActivity(activityData: {
    activityType: string;
    activityTitle: string;
    description?: string;
    metadata?: any;
  }): Promise<MedicalActivity> {
    try {
      const response = await api.post('/patients/activities', activityData);
      return response.data.data;
    } catch (error) {
      console.error('Error tracking activity:', error);
      throw error;
    }
  }

  static async getActivities(filters?: {
    activityType?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ activities: MedicalActivity[]; total: number; page: number; totalPages: number }> {
    try {
      const params = new URLSearchParams();
      if (filters?.activityType) params.append('activityType', filters.activityType);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/patients/activities?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  }

  static async deleteActivity(activityId: string): Promise<void> {
    try {
      await api.delete(`/patients/activities/${activityId}`);
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  }

  // Health Tasks
  static async getHealthTasks(filters?: {
    status?: string;
    taskType?: string;
    page?: number;
    limit?: number;
  }): Promise<{ tasks: HealthTask[]; total: number; page: number; totalPages: number }> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.taskType) params.append('taskType', filters.taskType);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/patients/health-tasks?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching health tasks:', error);
      throw error;
    }
  }

  static async completeTask(taskId: string): Promise<HealthTask> {
    try {
      const response = await api.post(`/patients/health-tasks/${taskId}/complete`);
      return response.data.data;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }

  static async createTask(taskData: Partial<HealthTask>): Promise<HealthTask> {
    try {
      const response = await api.post('/patients/health-tasks', taskData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  static async updateTask(taskId: string, taskData: Partial<HealthTask>): Promise<HealthTask> {
    try {
      const response = await api.put(`/patients/health-tasks/${taskId}`, taskData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  // Appointments
  static async getAppointments(filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ appointments: Appointment[]; total: number; page: number; totalPages: number }> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/patients/appointments?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  }

  static async createAppointment(appointmentData: {
    providerId?: string;
    appointmentType: string;
    title: string;
    description?: string;
    scheduledFor: string;
    duration?: number;
  }): Promise<Appointment> {
    try {
      const response = await api.post('/patients/appointments', appointmentData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  }

  static async updateAppointment(appointmentId: string, appointmentData: Partial<Appointment>): Promise<Appointment> {
    try {
      const response = await api.put(`/patients/appointments/${appointmentId}`, appointmentData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  }

  static async cancelAppointment(appointmentId: string, reason?: string): Promise<void> {
    try {
      await api.post(`/patients/appointments/${appointmentId}/cancel`, { reason });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  }

  // Billing & EMI
  static async getBills(filters?: {
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ bills: TreatmentBill[]; total: number; page: number; totalPages: number }> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/patients/bills?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching bills:', error);
      throw error;
    }
  }

  static async getBillById(billId: string): Promise<TreatmentBill> {
    try {
      const response = await api.get(`/patients/bills/${billId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching bill:', error);
      throw error;
    }
  }

  static async payBill(billId: string, paymentData: {
    amount: number;
    paymentMethod: string;
    transactionId?: string;
  }): Promise<any> {
    try {
      const response = await api.post(`/patients/bills/${billId}/pay`, paymentData);
      return response.data.data;
    } catch (error) {
      console.error('Error paying bill:', error);
      throw error;
    }
  }

  static async getEMIPlans(filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ emiPlans: EMIPlan[]; total: number; page: number; totalPages: number }> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/patients/emi-plans?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching EMI plans:', error);
      throw error;
    }
  }

  static async payEMI(emiPlanId: string, paymentData: {
    amount: number;
    paymentMethod: string;
    transactionId?: string;
  }): Promise<any> {
    try {
      const response = await api.post(`/patients/emi-plans/${emiPlanId}/pay`, paymentData);
      return response.data.data;
    } catch (error) {
      console.error('Error paying EMI:', error);
      throw error;
    }
  }

  static async calculateEMIOptions(amount: number): Promise<any> {
    try {
      const response = await api.post('/patients/emi-options', { amount });
      return response.data.data;
    } catch (error) {
      console.error('Error calculating EMI options:', error);
      throw error;
    }
  }

  // Charity & Sponsorship
  static async getCharityRequests(filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ requests: CharityRequest[]; total: number; page: number; totalPages: number }> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/patients/charity-requests?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching charity requests:', error);
      throw error;
    }
  }

  static async createCharityRequest(requestData: {
    treatmentId?: string;
    requestedAmount: number;
    reason: string;
  }): Promise<CharityRequest> {
    try {
      const response = await api.post('/patients/charity-requests', requestData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating charity request:', error);
      throw error;
    }
  }

  static async updateCharityRequest(requestId: string, requestData: Partial<CharityRequest>): Promise<CharityRequest> {
    try {
      const response = await api.put(`/patients/charity-requests/${requestId}`, requestData);
      return response.data.data;
    } catch (error) {
      console.error('Error updating charity request:', error);
      throw error;
    }
  }

  // Evaluations
  static async getEvaluations(filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ evaluations: ProviderEvaluation[]; total: number; page: number; totalPages: number }> {
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/patients/evaluations?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching evaluations:', error);
      throw error;
    }
  }

  static async getEvaluationById(evaluationId: string): Promise<ProviderEvaluation> {
    try {
      const response = await api.get(`/patients/evaluations/${evaluationId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching evaluation:', error);
      throw error;
    }
  }

  // Notifications
  static async getNotifications(filters?: {
    isRead?: boolean;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<{ notifications: Notification[]; total: number; page: number; totalPages: number }> {
    try {
      const params = new URLSearchParams();
      if (filters?.isRead !== undefined) params.append('isRead', filters.isRead.toString());
      if (filters?.type) params.append('type', filters.type);
      if (filters?.page) params.append('page', filters.page.toString());
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const response = await api.get(`/patients/notifications?${params}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  static async markNotificationAsRead(notificationId: string): Promise<void> {
    try {
      await api.put(`/patients/notifications/${notificationId}/read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  static async markAllNotificationsAsRead(): Promise<void> {
    try {
      await api.put('/patients/notifications/read-all');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  static async deleteNotification(notificationId: string): Promise<void> {
    try {
      await api.delete(`/patients/notifications/${notificationId}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Analytics & Reports
  static async getDashboardStats(): Promise<any> {
    try {
      const response = await api.get('/patients/dashboard/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  static async getActivityAnalytics(period: string = 'monthly'): Promise<any> {
    try {
      const response = await api.get(`/patients/analytics/activities?period=${period}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching activity analytics:', error);
      throw error;
    }
  }

  static async getHealthProgress(period: string = 'monthly'): Promise<any> {
    try {
      const response = await api.get(`/patients/analytics/health-progress?period=${period}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching health progress:', error);
      throw error;
    }
  }

  static async generateMedicalReport(filters?: {
    dateRange?: string;
    includeActivities?: boolean;
    includeAppointments?: boolean;
    includeBills?: boolean;
    format?: 'pdf' | 'excel';
  }): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      if (filters?.dateRange) params.append('dateRange', filters.dateRange);
      if (filters?.includeActivities) params.append('includeActivities', 'true');
      if (filters?.includeAppointments) params.append('includeAppointments', 'true');
      if (filters?.includeBills) params.append('includeBills', 'true');
      if (filters?.format) params.append('format', filters.format);

      const response = await api.get(`/patients/reports/medical?${params}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error generating medical report:', error);
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

  static calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  static getLoyaltyLevel(creditScore: number): string {
    if (creditScore >= 800) return 'Platinum';
    if (creditScore >= 750) return 'Gold';
    if (creditScore >= 650) return 'Silver';
    return 'Bronze';
  }

  static getCreditScoreCategory(creditScore: number): string {
    if (creditScore >= 800) return 'EXCELLENT';
    if (creditScore >= 650) return 'GOOD';
    if (creditScore >= 500) return 'AVERAGE';
    return 'LOW';
  }
}

// Initialize WebSocket connection
connectWebSocket();

export default PatientApiService;
