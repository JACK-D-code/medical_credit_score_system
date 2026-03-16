import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import PatientDashboard from './pages/PatientDashboard';
import ClaimCreditPoints from './pages/credit-engine/ClaimCreditPoints';
import OfferApplication from './pages/emi-management/OfferApplication';
// @ts-ignore - The dashboard is written in JSX and doesn't have types yet
import MedicalCreditDashboard from './pages/medical-credit-dashboard';
import Login from './pages/Login';
import ProviderRegistration from './pages/ProviderRegistration';
import './index.css';

// Layout
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/patient-login');
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <header className="header justify-between whitespace-nowrap overflow-hidden text-ellipsis">
        <Link to="/" className="header-logo hover:opacity-80 transition-opacity" style={{ textDecoration: 'none' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          MediScore System
        </Link>
        <div className="flex gap-4 items-center">
          <button onClick={handleSignOut} className="text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none">Sign Out</button>
        </div>
      </header>
      <main style={{ flex: 1, padding: '2rem' }}>{children}</main>
    </div>
  );
};

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/patient-login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/provider-registration" element={<ProviderRegistration />} />
        <Route path="/dashboard" element={<MedicalCreditDashboard />} />
        <Route path="/score-details" element={<PatientDashboard />} />
        <Route path="/claim-credit" element={<ClaimCreditPoints />} />
        <Route path="/offers" element={<OfferApplication />} />
        {/* ADDED MEDICAL CREDIT DASHBOARD ROUTE */}
        <Route path="/medical-credit-dashboard" element={<MedicalCreditDashboard />} />
        <Route path="/" element={<Navigate to="/patient-login" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
