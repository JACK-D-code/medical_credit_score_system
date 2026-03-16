import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';

import LoginForm from './components/LoginForm';
import TrustIndicators from './components/TrustIndicators';
import RegistrationPrompt from './components/RegistrationPrompt';
import SessionWarning from './components/SessionWarning';

const PatientLogin = () => {
  const navigate = useNavigate();
  const [showSessionWarning, setShowSessionWarning] = useState(false);

  const handleBiometricLogin = () => {
    navigate('/medical-credit-dashboard');
  };

  const handleExtendSession = () => {
    setShowSessionWarning(false);
  };

  const handleLogout = () => {
    setShowSessionWarning(false);
    navigate('/patient-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col justify-center">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        
        <div className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="Activity" size={32} color="var(--color-primary)" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
              Patient Portal
            </h1>
          </div>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Secure access to your health financing and medical credit system
          </p>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="bg-card rounded-2xl shadow-elevation-3 border border-border overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-col items-center mb-8">
                <h2 className="text-2xl font-bold font-heading">Sign In</h2>
              </div>

              <LoginForm />

              <div className="mt-6 flex justify-center">
                <button 
                  onClick={handleBiometricLogin}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-colors"
                >
                  <Icon name="Fingerprint" size={16} />
                  Sign in with Passkey
                </button>
              </div>
            </div>
            
            <RegistrationPrompt />
          </div>
        </div>

      </div>
      <SessionWarning
        show={showSessionWarning}
        onExtend={handleExtendSession}
        onLogout={handleLogout}
      />
    </div>
  );
};

export default PatientLogin;