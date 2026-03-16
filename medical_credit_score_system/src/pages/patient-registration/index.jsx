import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import TrustSignals from './components/TrustSignals';
import api from '../../lib/api';
import Icon from '../../components/AppIcon';

const PatientRegistration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        role: 'PATIENT',
        firstName: formData.fullName.split(' ')[0],
        lastName: formData.fullName.split(' ').slice(1).join(' '),
        mobileNumber: formData.mobileNumber,
      });

      if (response.data) {
        setIsLoading(false);
        navigate('/patient-login');
      }
    } catch (err) {
      console.error('Registration failed:', err);
      alert(err.response?.data?.error || 'Failed to register account.');
      setIsLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate('/patient-login');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
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

          <div className="w-full max-w-2xl mx-auto">
            <div className="bg-card rounded-2xl shadow-elevation-3 border border-border py-8 px-5 md:px-12 overflow-hidden relative">
               <div className="text-center mb-8">
                 <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2 text-foreground font-heading">
                   Patient Registration
                 </h2>
                 <p className="text-sm md:text-base text-muted-foreground">
                   Initialize your unique Patient Health ID (PH-ID) securely.
                 </p>
               </div>

               <RegistrationForm 
                 onSubmit={handleFormSubmit} 
                 isLoading={isLoading} 
               />

               <div className="mt-6 md:mt-8 pt-6 border-t border-border text-center">
                 <button
                   onClick={handleLoginRedirect}
                   className="text-primary hover:text-primary/80 text-sm md:text-base font-medium transition-colors"
                 >
                   Already have an account? Sign in
                 </button>
               </div>
            </div>
            
            <div className="mt-8">
               <TrustSignals />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;