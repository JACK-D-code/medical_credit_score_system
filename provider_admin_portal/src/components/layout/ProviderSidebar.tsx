import { NavLink, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const ProviderSidebar = () => {
    const location = useLocation();

    const navItems = [
        { name: 'Command Center', path: '/provider-dashboard', icon: 'LayoutDashboard' },
        { name: 'Patient Registry', path: '/provider-patients', icon: 'Users' },
        { name: 'Revenue & Billing', path: '/provider-billing', icon: 'Receipt' },
        { name: 'Risk Analytics', path: '/provider-analytics', icon: 'LineChart' },
        { name: 'POS Scanner', path: '/provider-pos', icon: 'Terminal' },
        { name: 'Claim Approvals', path: '/claim-approvals', icon: 'CheckSquare' },
        { name: 'Settings', path: '/provider-settings', icon: 'Settings' },
    ];

    // Use localStorage to get user data for dynamic display
    const userJson = localStorage.getItem('user');
    const user = userJson ? JSON.parse(userJson) : null;
    
    // Improved name display logic
    const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
    const isGenericName = fullName === 'Unknown User' || !fullName;
    
    const providerName = user 
        ? (isGenericName ? (user.hospitalName || user.email) : fullName)
        : 'Dr. Smith';
        
    const providerId = user 
        ? (user.specialization || `ID: ${user.id.substring(0, 8).toUpperCase()}`) 
        : 'ID: DOC-9901A';

    return (
        <aside className="w-64 h-screen max-h-screen sticky top-0 hidden md:flex flex-col bg-card/80 backdrop-blur-xl border-r border-border shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-30 transition-all duration-300">
            {/* Brand Region */}
            <div className="h-16 flex items-center px-6 border-b border-border/50 bg-background/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-[#8b5cf6] flex items-center justify-center shadow-[0_2px_10px_rgba(139,92,246,0.3)]">
                        <Icon name="Activity" size={18} color="white" />
                    </div>
                    <span className="font-heading font-bold text-lg tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                        Enterprise <span className="text-primary font-black">Portal</span>
                    </span>
                </div>
            </div>

            {/* Navigation Region */}
            <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
                <label className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 block">
                    Hospital Network
                </label>

                {navItems.map((item) => {
                    const isActive = location.pathname.includes(item.path);

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                ? 'bg-primary/10 text-primary font-semibold'
                                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground font-medium'
                                }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-primary to-[#8b5cf6] rounded-r-full shadow-[2px_0_8px_rgba(139,92,246,0.5)]"></div>
                            )}

                            <Icon
                                name={item.icon}
                                size={20}
                                className={`transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_2px_4px_rgba(var(--color-primary-rgb),0.3)]' : 'group-hover:scale-110'}`}
                            />
                            <span className="tracking-wide text-sm">{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* User Mini-Profile Region */}
            <div className="p-4 border-t border-border/50 bg-background/30">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 flex items-center justify-center border border-primary/20 flex-shrink-0 relative">
                        <Icon name="User" size={20} className="text-primary" />
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full border-2 border-card"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{providerName}</p>
                        <p className="text-xs text-muted-foreground truncate font-mono">{providerId}</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default ProviderSidebar;
