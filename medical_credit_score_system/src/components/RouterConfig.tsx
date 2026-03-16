import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Lazy load components for better performance
const PHIDEntry = React.lazy(() => import('../pages/patient/PHIDEntry'));
const PatientDashboardDynamic = React.lazy(() => import('../pages/patient/PatientDashboard-Dynamic'));
const ActivityTracking = React.lazy(() => import('../pages/patient/ActivityTracking'));
const CreditScoreAnalysis = React.lazy(() => import('../pages/patient/CreditScoreAnalysis'));
const BillingManagement = React.lazy(() => import('../pages/patient/BillingManagement'));
const ProfileManagementSimple = React.lazy(() => import('../pages/patient/ProfileManagementSimple'));
const ActivityReportsSimple = React.lazy(() => import('../pages/activity-reports/ActivityReportsSimple'));
const ProviderDashboardWorking = React.lazy(() => import('../pages/provider/ProviderDashboard-Working'));
const ProviderEvaluation = React.lazy(() => import('../pages/provider/ProviderEvaluation'));
const PHIDManagement = React.lazy(() => import('../pages/admin/PHIDManagement'));
const LoginPage = React.lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('../pages/auth/RegisterPage'));
const DebugTest = React.lazy(() => import('../pages/DebugTest'));

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="flex items-center gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <span className="text-gray-600">Loading...</span>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const phid = localStorage.getItem('currentPHID');
  const patientData = localStorage.getItem('patientData');
  
  if (!phid || !patientData) {
    return <Navigate to="/phid-entry" replace />;
  }
  
  return <>{children}</>;
};

// Admin Protected Route
const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const userRole = localStorage.getItem('userRole');
  
  if (userRole !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/phid-entry" replace />} />
          <Route path="/phid-entry" element={<PHIDEntry />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/debug" element={<DebugTest />} />

          {/* Patient Protected Routes */}
          <Route path="/patient" element={
            <ProtectedRoute>
              <PatientDashboardDynamic />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <PatientDashboardDynamic />
            </ProtectedRoute>
          } />
          <Route path="/activity-tracking" element={
            <ProtectedRoute>
              <ActivityTracking />
            </ProtectedRoute>
          } />
          <Route path="/credit-score-analysis" element={
            <ProtectedRoute>
              <CreditScoreAnalysis />
            </ProtectedRoute>
          } />
          <Route path="/billing-management" element={
            <ProtectedRoute>
              <BillingManagement />
            </ProtectedRoute>
          } />
          <Route path="/profile-management" element={
            <ProtectedRoute>
              <ProfileManagementSimple />
            </ProtectedRoute>
          } />
          <Route path="/activity-reports" element={
            <ProtectedRoute>
              <ActivityReportsSimple />
            </ProtectedRoute>
          } />

          {/* Provider Routes */}
          <Route path="/provider/dashboard" element={<ProviderDashboardWorking />} />
          <Route path="/provider/evaluation" element={<ProviderEvaluation />} />

          {/* Admin Routes */}
          <Route path="/admin/phid-management" element={
            <AdminProtectedRoute>
              <PHIDManagement />
            </AdminProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-4">Page not found</p>
                <button
                  onClick={() => window.location.href = '/phid-entry'}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Go Home
                </button>
              </div>
            </div>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;
