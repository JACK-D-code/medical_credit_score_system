import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import PatientDashboard from './pages/PatientDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import ClaimApprovals from './pages/ClaimApprovals';
import Login from './pages/Login';
import ProviderRegistration from './pages/ProviderRegistration';
import PointOfSale from './pages/PointOfSale';
import CharityAdmin from './pages/CharityAdmin';
import AdminControlPanel from './pages/AdminControlPanel';
import './index.css';

// Layout
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isAuthPage = ['/login', '/provider-registration', '/onboarding'].includes(location.pathname);

  if (isAuthPage) {
    return <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex flex-col">{children}</div>;
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <header className="header justify-between">
        <Link to="/" className="header-logo hover:opacity-80 transition-opacity" style={{ textDecoration: 'none' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          MediScore System
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/provider" className="text-sm font-medium text-gray-300 hover:text-white transition-colors" style={{ textDecoration: 'none' }}>Dashboard</Link>
          <Link to="/claim-approvals" className="text-sm font-medium text-gray-300 hover:text-white transition-colors" style={{ textDecoration: 'none' }}>Approvals</Link>
          <Link to="/charity-admin" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors" style={{ textDecoration: 'none' }}>Charity Grants</Link>
          <Link to="/admin-panel" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors" style={{ textDecoration: 'none' }}>Engine Rules</Link>
          <Link to="/provider-pos" className="text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors pointer-cursor" style={{ textDecoration: 'none' }}>⚡ POS Scanner</Link>
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
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/provider-registration" element={<ProviderRegistration />} />
        <Route path="/dashboard" element={<PatientDashboard />} />
        <Route path="/provider" element={<ProviderDashboard />} />
        <Route path="/claim-approvals" element={<ClaimApprovals />} />
        <Route path="/charity-admin" element={<CharityAdmin />} />
        <Route path="/admin-panel" element={<AdminControlPanel />} />
        <Route path="/provider-pos" element={<PointOfSale />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
