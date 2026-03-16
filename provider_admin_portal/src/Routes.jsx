import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import ProviderLogin from './pages/provider-login';
import ProviderRegistration from './pages/ProviderRegistration';
import AdminLogin from './pages/admin-login';
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderPatients from './pages/ProviderPatients';
import ProviderBilling from './pages/ProviderBilling';
import ProviderAnalytics from './pages/ProviderAnalytics';
import ProviderSettings from './pages/ProviderSettings';
import AdminDashboard from './pages/AdminDashboard';
import ProviderLayout from './components/layout/ProviderLayout';
import PointOfSale from './pages/PointOfSale';
import ClaimApprovals from './pages/ClaimApprovals';

const Routes = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Core Provider & Admin Auth Routes */}
          <Route path="/" element={<ProviderLogin />} />
          <Route path="/provider-login" element={<ProviderLogin />} />
          <Route path="/provider-registration" element={<ProviderRegistration />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Secure Provider Navigation Layout */}
          <Route element={<ProviderLayout />}>
            <Route path="/provider-dashboard" element={<ProviderDashboard />} />
            <Route path="/provider-patients" element={<ProviderPatients />} />
            <Route path="/provider-billing" element={<ProviderBilling />} />
            <Route path="/provider-analytics" element={<ProviderAnalytics />} />
            <Route path="/provider-settings" element={<ProviderSettings />} />
            <Route path="/provider-pos" element={<PointOfSale />} />
            <Route path="/claim-approvals" element={<ClaimApprovals />} />
          </Route>

          {/* Secure Admin Route */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
