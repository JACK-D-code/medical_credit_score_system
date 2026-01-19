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
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                <Icon name="Activity" size={32} color="var(--color-primary)" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground">
                MediCredit System
              </h1>
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Secure access to your medical credit profile and financial assessment tools
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="order-2 lg:order-1">
              <div className="bg-card rounded-xl shadow-elevation-3 border border-border p-6 md:p-8 lg:p-10">
                <div className="mb-6 md:mb-8">
                  <h2 className="text-2xl md:text-3xl font-heading font-semibold text-foreground mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Login to access your medical credit dashboard
                  </p>
                </div>

                <LoginForm />

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="bg-primary/5 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Icon name="Info" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          Demo Credentials
                        </p>
                        <p className="text-xs text-muted-foreground mb-2">
                          Use these credentials to explore the platform:
                        </p>
                        <div className="space-y-1 font-mono text-xs">
                          <p className="text-foreground">
                            <span className="text-muted-foreground">Mobile:</span>  9876543210
                          </p>
                          <p className="text-foreground">
                            <span className="text-muted-foreground">Password:</span> MediCredit@2026
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 lg:hidden">
                <RegistrationPrompt />
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6 md:space-y-8">
              <div className="hidden lg:block">
                <RegistrationPrompt />
              </div>

              <TrustIndicators />
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