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
    navigate('/provider-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                <Icon name="Activity" size={32} color="var(--color-primary)" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
                Enterprise Provider Portal
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Secure hospital access to issue bills and assess patient medical credit
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mt-8 md:mt-12">
            <div className="order-2 lg:order-1 flex flex-col justify-center">
              <div className="bg-card rounded-2xl p-6 md:p-8 shadow-elevation-2 border border-border mb-8">
                <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
                  Provider Access
                </h2>
                <LoginForm />
              </div>
              <TrustIndicators />
            </div>

            <div className="order-1 lg:order-2">
              <RegistrationPrompt />
            </div>
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