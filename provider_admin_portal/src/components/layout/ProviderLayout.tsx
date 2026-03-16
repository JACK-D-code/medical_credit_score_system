import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import ProviderSidebar from './ProviderSidebar';
import SessionSecurityHeader from '../ui/SessionSecurityHeader';
import { Menu, X } from 'lucide-react';

const ProviderLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/provider-login');
    };

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-background flex flex-col font-sans text-foreground overflow-hidden">
            {/* Absolute top session bar */}
            <SessionSecurityHeader sessionTimeout={1800000} onLogout={handleLogout} />

            <div className="flex flex-1 overflow-hidden">
                {/* Desktop Sidebar */}
                <ProviderSidebar />

                {/* Mobile Sidebar Overlay */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-40 md:hidden flex">
                        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
                        <div className="relative z-50 w-64 h-full transform transition-transform duration-300">
                            <ProviderSidebar />
                        </div>
                        <button
                            className="absolute top-4 right-4 z-50 p-2 bg-card rounded-full shadow-lg border border-border"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <X size={20} className="text-foreground" />
                        </button>
                    </div>
                )}

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col h-[calc(100vh-40px)] overflow-y-auto bg-[#FAFAFA] dark:bg-[#0A0A0B]">
                    {/* Internal Header (with Mobile menu toggle) */}
                    <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border shadow-sm flex items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="md:hidden py-4">
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                            >
                                <Menu size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Page Content Injection */}
                    <div className="flex-1 animate-in fade-in duration-500 pb-20">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProviderLayout;
