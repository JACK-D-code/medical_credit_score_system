import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import RegistrationForm from './components/RegistrationForm';
import TrustSignals from './components/TrustSignals';
import OTPVerification from './components/OTPVerification';

const PatientRegistration = () => {
  const navigate = useNavigate();
  const [registrationStep, setRegistrationStep] = useState('form');
  const [isLoading, setIsLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  const handleFormSubmit = (formData) => {
    setIsLoading(true);
    setRegistrationData(formData);

    setTimeout(() => {
      setIsLoading(false);
      setRegistrationStep('otp');
    }, 1500);
  };

  const handleOTPVerify = (otp) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (otp === '123456') {
        navigate('/medical-credit-dashboard');
      } else {
        alert('Invalid OTP. Please use 123456 for testing.');
      }
    }, 1500);
  };

  const handleOTPResend = () => {
    console.log('OTP resent to:', registrationData?.mobileNumber);
  };

  const handleBackToForm = () => {
    setRegistrationStep('form');
  };

  const handleLoginRedirect = () => {
    navigate('/patient-login');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-6 md:mb-8 lg:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-lg mb-4 md:mb-6 rounded-br-2xl rounded-t-2xl rounded-bl-2xl">
              <Icon name="Activity" size={40} color="var(--color-primary)" />
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-2 md:mb-3 text-center text-[rgba(158,158,255,1)]">
              MediCredit System
            </h1>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto">
              Build your medical creditworthiness and access healthcare financing options
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12">
            <div className="order-2 lg:order-1">
              <div className="bg-card rounded-lg shadow-elevation-3 p-4 md:p-6 lg:p-8">
                {registrationStep === 'form' ? (
                  <RegistrationForm
                    onSubmit={handleFormSubmit}
                    onLoginRedirect={handleLoginRedirect}
                    isLoading={isLoading}
                  />
                ) : (
                  <OTPVerification
                    mobileNumber={registrationData?.mobileNumber}
                    onVerify={handleOTPVerify}
                    onResend={handleOTPResend}
                    onBack={handleBackToForm}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <TrustSignals />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;