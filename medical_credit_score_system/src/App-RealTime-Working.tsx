import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RealTimeDemo from './components/RealTimeDemo';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import HospitalAdminDashboard from './pages/hospital-admin/HospitalAdminDashboard';
import FinanceProviderDashboard from './pages/finance-provider/FinanceProviderDashboard';
import TreatmentAuthorization from './pages/treatment-authorization/TreatmentAuthorization';
import EMIManagementDashboard from './pages/emi-management/EMIManagementDashboard';
import CreditEngineDashboard from './pages/credit-engine/CreditEngineDashboard';
import ActivityTracker from './components/ActivityTracker';
import './index.css';

const AppRealTimeWorking = () => {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [showActivityTracker, setShowActivityTracker] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Simulate real-time connection
  useEffect(() => {
    const simulateConnection = () => {
      setTimeout(() => setIsConnected(true), 1000);
    };

    simulateConnection();

    // Simulate real-time updates
    const interval = setInterval(() => {
      console.log('🔄 Real-time system active -', new Date().toLocaleTimeString());
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const renderNavigation = () => (
    <div className="bg-white border-b border-gray-200 p-4 mb-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            🏥 Medical Credit System - Real-Time Working
          </h1>
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveModule('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeModule === 'dashboard' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🎯 Dashboard
            </button>
            
            <button
              onClick={() => setActiveModule('demo')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeModule === 'demo' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🎮 Demo
            </button>
          
            <button
              onClick={() => setActiveModule('doctor')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeModule === 'doctor' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              👨‍⚕️ Doctor
            </button>
          
            <button
              onClick={() => setActiveModule('patient')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeModule === 'patient' 
                  ? 'bg-teal-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              👤 Patient
            </button>
          
            <button
              onClick={() => setActiveModule('admin')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeModule === 'admin' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🏢 Admin
            </button>
          
            <button
              onClick={() => setActiveModule('finance')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeModule === 'finance' 
                  ? 'bg-cyan-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              💰 Finance
            </button>
          
            <button
              onClick={() => setActiveModule('authorization')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeModule === 'authorization' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              ✅ Authorization
            </button>
          
            <button
              onClick={() => setActiveModule('emi')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeModule === 'emi' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📊 EMI
            </button>
          
            <button
              onClick={() => setActiveModule('credit-engine')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeModule === 'credit-engine' 
                  ? 'bg-pink-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🧠 Credit Engine
            </button>

            <button
              onClick={() => setShowActivityTracker(!showActivityTracker)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showActivityTracker 
                  ? 'bg-yellow-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              🏆 Activity Tracker
            </button>
          </div>

          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="text-sm font-medium">
              {isConnected ? '🟢 System Live' : '🔴 System Offline'}
            </span>
            {isConnected && (
              <span className="text-xs text-gray-500 ml-4">
                Real-time updates active • Last update: {new Date().toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    if (activeModule === 'dashboard') {
      return <ActivityTracker />;
    }
    return null;
  };

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'demo':
        return <RealTimeDemo />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'patient':
        return <PatientDashboard />;
      case 'admin':
        return <HospitalAdminDashboard />;
      case 'finance':
        return <FinanceProviderDashboard />;
      case 'authorization':
        return <TreatmentAuthorization />;
      case 'emi':
        return <EMIManagementDashboard />;
      case 'credit-engine':
        return <CreditEngineDashboard />;
      default:
        return <RealTimeDemo />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <div className="App">
          {renderNavigation()}
          
          <div className="max-w-7xl mx-auto p-6">
            {/* Show Activity Tracker in Dashboard or as separate view */}
            {(activeModule === 'dashboard' || showActivityTracker) && (
              <div className="mb-8">
                {showActivityTracker && <ActivityTracker />}
              </div>
            )}
            
            {/* Active Module Display */}
            {!showActivityTracker && renderActiveModule()}
          </div>
        </div>
      </Router>
    </div>
  );
};

export default AppRealTimeWorking;
