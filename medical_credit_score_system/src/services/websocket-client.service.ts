import { io, Socket } from 'socket.io-client';

// WebSocket Configuration
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';

class WebSocketClient {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    this.connect();
  }

  // Connect to WebSocket server
  connect() {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.warn('No authentication token found');
      return;
    }

    this.socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 10000,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay
    });

    this.setupEventListeners();
  }

  // Setup event listeners
  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
      this.reconnectAttempts = 0;
      this.emit('connection-status', { connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected from WebSocket server:', reason);
      this.emit('connection-status', { connected: false, reason });
      this.handleReconnect();
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.handleReconnect();
    });

    // Custom event listeners
    this.socket.on('patient-score-update', (data) => {
      console.log('📊 Patient score update:', data);
      this.emit('score-update', data);
    });

    this.socket.on('patient-activity-update', (data) => {
      console.log('🏃 Patient activity update:', data);
      this.emit('activity-update', data);
    });

    this.socket.on('provider-activity-update', (data) => {
      console.log('👨‍⚕️ Provider activity update:', data);
      this.emit('provider-activity-update', data);
    });

    this.socket.on('appointment-update', (data) => {
      console.log('📅 Appointment update:', data);
      this.emit('appointment-update', data);
    });

    this.socket.on('evaluation-update', (data) => {
      console.log('⭐ Evaluation update:', data);
      this.emit('evaluation-update', data);
    });

    this.socket.on('payment-update', (data) => {
      console.log('💳 Payment update:', data);
      this.emit('payment-update', data);
    });

    this.socket.on('notification', (data) => {
      console.log('🔔 Notification:', data);
      this.emit('notification', data);
      
      // Show browser notification
      if (Notification.permission === 'granted') {
        new Notification(data.title, {
          body: data.message,
          icon: '/favicon.ico',
          tag: data.id
        });
      }
    });

    this.socket.on('system-announcement', (data) => {
      console.log('📢 System announcement:', data);
      this.emit('system-announcement', data);
    });
  }

  // Handle reconnection
  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('❌ Max reconnection attempts reached');
      this.emit('connection-status', { 
        connected: false, 
        error: 'Max reconnection attempts reached' 
      });
    }
  }

  // Emit events to server
  emit(event: string, data?: any) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn('Socket not connected, cannot emit:', event);
    }
  }

  // Listen to events from server
  on(event: string, callback: (...args: any[]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    // If socket is already connected, set up listener
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  // Remove event listener
  off(event: string, callback?: (...args: any[]) => void) {
    if (callback) {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    } else {
      this.listeners.delete(event);
    }

    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }

  // Join room
  joinRoom(room: string) {
    this.emit('join-room', { room });
    console.log(`🏠 Joined room: ${room}`);
  }

  // Leave room
  leaveRoom(room: string) {
    this.emit('leave-room', { room });
    console.log(`🚪 Left room: ${room}`);
  }

  // Get connection status
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.listeners.clear();
  }

  // Request browser notification permission
  requestNotificationPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }
  }
}

// Create singleton instance
const webSocketClient = new WebSocketClient();

// Request notification permission on load
webSocketClient.requestNotificationPermission();

export default webSocketClient;

// Export types for TypeScript
export interface WebSocketEventData {
  scoreUpdate?: {
    patientId: string;
    newScore: number;
    oldScore: number;
    scoreCategory: string;
    factors: any;
  };
  activityUpdate?: {
    patientId: string;
    activity: {
      id: string;
      activityType: string;
      activityTitle: string;
      pointsEarned: number;
      completedAt: string;
    };
    newScore: number;
  };
  appointmentUpdate?: {
    appointment: {
      id: string;
      patientId: string;
      providerId: string;
      appointmentType: string;
      title: string;
      scheduledFor: string;
      status: string;
    };
    action: 'created' | 'updated' | 'cancelled';
  };
  evaluationUpdate?: {
    evaluation: {
      id: string;
      patientId: string;
      providerId: string;
      evaluationType: string;
      bonusPoints: number;
      reason: string;
      status: string;
    };
    action: 'submitted' | 'approved' | 'rejected';
  };
  paymentUpdate?: {
    patientId: string;
    billId?: string;
    emiPlanId?: string;
    amount: number;
    paymentMethod: string;
    status: string;
  };
  notification?: {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
  };
  systemAnnouncement?: {
    title: string;
    message: string;
    type: string;
    priority: 'low' | 'medium' | 'high';
    targetRole?: string;
  };
}
