import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import NotFound from "./pages/NotFound";
import MedicalCreditDashboard from './pages/medical-credit-dashboard';
import PatientRegistration from './pages/patient-registration';
import BillingRecords from './pages/billing-records';
import ProfileManagement from './pages/profile-management';
import CreditScoreDetails from './pages/credit-score-details';
import PatientLogin from './pages/patient-login';
import AccountSettings from './pages/account-settings';
import InsuranceHub from './pages/insurance-hub';
import EmiSimulator from './pages/emi-simulator';

// Phase 1-3 Modules
import PatientDashboard from './pages/PatientDashboard';
import ClaimCreditPoints from './pages/credit-engine/ClaimCreditPoints';
import OfferApplication from './pages/emi-management/OfferApplication';
import BookAppointment from './pages/book-appointment';
import ActivityReports from './pages/activity-reports';

const Routes = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Define your route here */}
          <Route path="/" element={<PublicRoute><PatientLogin /></PublicRoute>} />
          <Route path="/medical-credit-dashboard" element={<ProtectedRoute><MedicalCreditDashboard /></ProtectedRoute>} />
          <Route path="/patient-registration" element={<PublicRoute><PatientRegistration /></PublicRoute>} />
          <Route path="/billing-records" element={<ProtectedRoute><BillingRecords /></ProtectedRoute>} />
          <Route path="/profile-management" element={<ProtectedRoute><ProfileManagement /></ProtectedRoute>} />
          <Route path="/credit-score-details" element={<ProtectedRoute><CreditScoreDetails /></ProtectedRoute>} />
          <Route path="/insurance-hub" element={<ProtectedRoute><InsuranceHub /></ProtectedRoute>} />
          <Route path="/emi-simulator" element={<ProtectedRoute><EmiSimulator /></ProtectedRoute>} />
          <Route path="/patient-login" element={<PublicRoute><PatientLogin /></PublicRoute>} />
          <Route path="/account-settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
          
          {/* Phase 1-3 Injected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><MedicalCreditDashboard /></ProtectedRoute>} />
          <Route path="/score-details" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
          <Route path="/claim-credit" element={<ProtectedRoute><ClaimCreditPoints /></ProtectedRoute>} />
          <Route path="/offers" element={<ProtectedRoute><OfferApplication /></ProtectedRoute>} />
          <Route path="/book-appointment" element={<ProtectedRoute><BookAppointment /></ProtectedRoute>} />
          <Route path="/activity-reports" element={<ProtectedRoute><ActivityReports /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
