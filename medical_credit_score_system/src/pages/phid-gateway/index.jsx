import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { io } from 'socket.io-client';

const PHIDGateway = () => {
    const navigate = useNavigate();
    const [phidInput, setPhidInput] = useState('');
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [unlockError, setUnlockError] = useState('');
    const [hasRequested, setHasRequested] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const assignedPhid = user?.phid;

    // Listen for Admin Approval in real-time
    useEffect(() => {
        if (!user?.id) return;
        
        const waitingSocket = io('http://localhost:5000', {
            withCredentials: true
        });
        
        waitingSocket.on('connect', () => {
            waitingSocket.emit('join_user_room', user.id);
        });

        waitingSocket.on('phid_approved', (data) => {
            if (data.phid) {
                setPhidInput(data.phid);
                handleUnlockWithPhid(data.phid);
            }
        });

        return () => waitingSocket.disconnect();
    }, [user?.id]);

    const handleUnlockWithPhid = async (receivedPhid) => {
        setUnlockError('');
        setIsUnlocking(true);
        await new Promise(r => setTimeout(r, 600)); 
    
        try {
            // Verify it against the backend. Since the backend issues it, any mismatch falls out.
            // For now, if the user object has a PHID, it must exactly match.
            // If they don't have one assigned in local storage yet (because they just requested it), the socket payload provides it.
            if (assignedPhid && receivedPhid !== assignedPhid) {
                throw new Error("Invalid PH-ID Data Access. Please enter the secure ID linked to this account.");
            }
            
            // If valid, explicitly save the authorized PH-ID for the dashboard to use
            const updatedUser = { ...user, activePhid: receivedPhid };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            // Forward to the dashboard
            navigate('/dashboard');
            
        } catch (err) {
            console.error('Failed verification:', err);
            setUnlockError(err.message || 'Failed to verify PH-ID');
        } finally {
            setIsUnlocking(false);
        }
    };

    const handleUnlock = async (e) => {
        e.preventDefault();
        const trimmedInput = phidInput.trim().toUpperCase();
        await handleUnlockWithPhid(trimmedInput);
    };

    const handleRequestPhid = async () => {
        try {
            setHasRequested(true);
            await api.post('/patients/request-phid');
        } catch (error) {
            console.error(error);
            setHasRequested(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/patient-login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background relative overflow-hidden">
            {/* Ambient Background Blur */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-50"></div>
                <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] opacity-60"></div>
                <div className="absolute -bottom-20 left-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[100px] opacity-40"></div>
            </div>

            <div className="bg-card border border-primary/20 p-8 md:p-12 rounded-3xl shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.1)] max-w-lg w-full text-center relative z-10">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <svg className="w-48 h-48 text-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                </div>
                
                <div className="relative z-20">
                    <h2 className="text-3xl font-black text-foreground mb-2">System Locked</h2>
                    <p className="text-muted-foreground mb-8">Enter your Patient Health ID (PH-ID) to authenticate and load your medical credit ecosystem.</p>

                    <form onSubmit={handleUnlock} className="space-y-4">
                        <label htmlFor="phid-input" className="sr-only">Patient Health ID</label>
                        <input 
                            id="phid-input"
                            name="phid"
                            type="text" 
                            placeholder="Enter PH-ID (e.g., PH-1A2B3)"
                            value={phidInput}
                            onChange={(e) => setPhidInput(e.target.value)}
                            className="w-full bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary p-4 rounded-xl text-center font-mono tracking-widest uppercase text-xl text-foreground outline-none transition-all shadow-inner"
                        />
                        {unlockError && <p className="text-error text-sm font-semibold animate-in fade-in slide-in-from-top-1">{unlockError}</p>}
                        
                        <button 
                            type="submit"
                            disabled={isUnlocking || !phidInput}
                            className="w-full py-4 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                        >
                            {isUnlocking ? 'Verifying Identity...' : 'Access Dashboard'}
                        </button>
                        
                        <div className="pt-4 flex flex-col items-center space-y-3">
                            <button 
                                type="button"
                                onClick={handleRequestPhid}
                                disabled={hasRequested}
                                className={`text-sm font-semibold transition-colors ${hasRequested ? 'text-emerald-500 animate-pulse' : 'text-primary/80 hover:text-primary underline underline-offset-2'}`}
                            >
                                {hasRequested ? 'Request sent! Waiting for Admin approval...' : 'Don\'t have a PH-ID? Request Access Code from Admin'}
                            </button>
                            
                            <button 
                                type="button"
                                onClick={handleLogout}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Sign out of account
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PHIDGateway;
