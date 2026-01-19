import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import MedicalCreditDashboard from './pages/medical-credit-dashboard';
import PatientRegistration from './pages/patient-registration';
import BillingRecords from './pages/billing-records';
import ProfileManagement from './pages/profile-management';
import CreditScoreDetails from './pages/credit-score-details';
import PatientLogin from './pages/patient-login';
import AccountSettings from './pages/account-settings';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<PatientLogin />} />
        <Route path="/medical-credit-dashboard" element={<MedicalCreditDashboard />} />
        <Route path="/patient-registration" element={<PatientRegistration />} />
        <Route path="/billing-records" element={<BillingRecords />} />
        <Route path="/profile-management" element={<ProfileManagement />} />
        <Route path="/credit-score-details" element={<CreditScoreDetails />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
