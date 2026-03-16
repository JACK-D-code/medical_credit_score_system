import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

class ApiService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Patient APIs
  async getPatient(patientId: string) {
    try {
      const response = await this.api.get(`/demo/patient/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patient:', error);
      throw error;
    }
  }

  async processCreditApplication(applicationData: any) {
    try {
      const response = await this.api.post('/demo/credit-application', applicationData);
      return response.data;
    } catch (error) {
      console.error('Error processing application:', error);
      throw error;
    }
  }

  async updateCreditScore(patientId: string, paymentData: any) {
    try {
      const response = await this.api.put(`/demo/credit-score/${patientId}`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error updating credit score:', error);
      throw error;
    }
  }

  // Dashboard APIs
  async getDashboardStats() {
    try {
      const response = await this.api.get('/demo/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getReusabilityAnalysis(patientId: string, treatmentType: string) {
    try {
      const response = await this.api.get(`/demo/reusability/${patientId}/${treatmentType}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching reusability analysis:', error);
      throw error;
    }
  }

  // Credit Score APIs
  async calculateCreditScore(patientId: string) {
    try {
      const response = await this.api.post(`/credit-score/calculate/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error calculating credit score:', error);
      throw error;
    }
  }

  async getCreditScoreHistory(patientId: string) {
    try {
      const response = await this.api.get(`/credit-score/history/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching credit score history:', error);
      throw error;
    }
  }

  // Treatment Authorization APIs
  async createTreatmentAuthorization(authData: any) {
    try {
      const response = await this.api.post('/treatment-authorization', authData);
      return response.data;
    } catch (error) {
      console.error('Error creating authorization:', error);
      throw error;
    }
  }

  async getPendingAuthorizations() {
    try {
      const response = await this.api.get('/treatment-authorization/pending');
      return response.data;
    } catch (error) {
      console.error('Error fetching authorizations:', error);
      throw error;
    }
  }

  async approveAuthorization(authorizationId: string, approvalData: any) {
    try {
      const response = await this.api.put(`/treatment-authorization/approve/${authorizationId}`, approvalData);
      return response.data;
    } catch (error) {
      console.error('Error approving authorization:', error);
      throw error;
    }
  }

  // EMI Management APIs
  async getEMIPlans(patientId: string) {
    try {
      const response = await this.api.get(`/emi/plans/${patientId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching EMI plans:', error);
      throw error;
    }
  }

  async processEMIPayment(emiPlanId: string, paymentData: any) {
    try {
      const response = await this.api.post(`/emi/payment/${emiPlanId}`, paymentData);
      return response.data;
    } catch (error) {
      console.error('Error processing EMI payment:', error);
      throw error;
    }
  }

  async getOverduePayments() {
    try {
      const response = await this.api.get('/emi/overdue');
      return response.data;
    } catch (error) {
      console.error('Error fetching overdue payments:', error);
      throw error;
    }
  }

  // Credit Offer APIs
  async generateCreditOffers(offerData: any) {
    try {
      const response = await this.api.post('/credit-offers/generate', offerData);
      return response.data;
    } catch (error) {
      console.error('Error generating offers:', error);
      throw error;
    }
  }

  async acceptCreditOffer(offerId: string, acceptanceData: any) {
    try {
      const response = await this.api.post(`/credit-offers/accept/${offerId}`, acceptanceData);
      return response.data;
    } catch (error) {
      console.error('Error accepting offer:', error);
      throw error;
    }
  }

  // Authentication APIs
  async login(credentials: any) {
    try {
      const response = await this.api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async register(userData: any) {
    try {
      const response = await this.api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  }

  // Utility methods
  setAuthToken(token: string) {
    this.api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  removeAuthToken() {
    delete this.api.defaults.headers.common['Authorization'];
  }

  // Real-time WebSocket connection
  connectWebSocket() {
    const wsUrl = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleWebSocketMessage(data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect after 3 seconds
      setTimeout(() => this.connectWebSocket(), 3000);
    };

    return ws;
  }

  private handleWebSocketMessage(data: any) {
    switch (data.type) {
      case 'CREDIT_SCORE_UPDATE':
        // Handle real-time credit score updates
        window.dispatchEvent(new CustomEvent('creditScoreUpdate', { detail: data.payload }));
        break;
      case 'APPLICATION_STATUS':
        // Handle application status changes
        window.dispatchEvent(new CustomEvent('applicationUpdate', { detail: data.payload }));
        break;
      case 'NEW_BILL':
        // Handle new billing records
        window.dispatchEvent(new CustomEvent('newBill', { detail: data.payload }));
        break;
      case 'PAYMENT_RECEIVED':
        // Handle payment confirmations
        window.dispatchEvent(new CustomEvent('paymentReceived', { detail: data.payload }));
        break;
      default:
        console.log('Unknown WebSocket message type:', data.type);
    }
  }
}

export default new ApiService();
