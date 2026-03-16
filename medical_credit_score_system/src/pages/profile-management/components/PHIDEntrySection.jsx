import React, { useState } from 'react';
import { KeyRound, CheckCircle, ShieldAlert, Loader2 } from 'lucide-react';
import api from '../../../lib/api';

const PHIDEntrySection = ({ currentPhid, onLinked }) => {
  const [phidInput, setPhidInput] = useState(currentPhid || '');
  const [status, setStatus] = useState(currentPhid ? 'linked' : 'idle'); // idle, linking, linked, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleLink = async (e) => {
    e.preventDefault();
    if (!phidInput.trim()) return;

    setStatus('linking');
    setErrorMessage('');

    try {
      // In a full production app, you might have a dedicated endpoint for this exact binding.
      // For this implementation, we simulate verifying the PHID against the backend profile.
      await api.put('/profile/personal', { phid: phidInput.trim().toUpperCase() });
      
      // Update local storage so the rest of the app knows the PHID is active
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.phid = phidInput.trim().toUpperCase();
      localStorage.setItem('user', JSON.stringify(user));

      setStatus('linked');
      if (onLinked) onLinked(user.phid);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.response?.data?.error || 'Invalid PH-ID or connection failed. Please consult your provider admin.');
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-elevation-2">
      <div className="border-b border-border p-5 bg-muted/30">
        <h3 className="font-heading font-semibold text-lg text-foreground flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-primary" />
          Health Identity Link (PH-ID)
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Link your hospital-generated cryptographic identity to sync your clinical ecosystem.
        </p>
      </div>

      <div className="p-6">
        {status === 'linked' || currentPhid ? (
          <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-success/10 border border-success/20 rounded-xl">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="bg-success/20 p-3 rounded-full hidden sm:block">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-success">Identity Successfully Linked</h4>
                <p className="text-sm text-muted-foreground font-mono mt-1">Active Token: {currentPhid || phidInput.toUpperCase()}</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-background border border-border shadow-sm rounded-lg text-xs font-bold text-muted-foreground tracking-widest">
              SECURE BINDING ACTIVE
            </div>
          </div>
        ) : (
          <form onSubmit={handleLink} className="space-y-4">
            <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl mb-6 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                To access advanced features like <strong>Zero-Interest EMI</strong>, <strong>Live Credit Generation</strong>, and <strong>Automated Claims</strong>, you must securely link your account with an Official Provider Access Code. 
                <br /><br />
                <em>If you do not have a code, please request one from your Hospital Administrator.</em>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Enter Provider Access Code (PH-ID)
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  placeholder="e.g. PHID-2026-ABCD"
                  className="flex-1 bg-background border border-border text-foreground px-4 py-3 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono tracking-widest uppercase text-lg"
                  value={phidInput}
                  onChange={(e) => setPhidInput(e.target.value.toUpperCase())}
                  disabled={status === 'linking'}
                />
                <button
                  type="submit"
                  disabled={status === 'linking' || !phidInput.trim()}
                  className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 whitespace-nowrap flex items-center justify-center min-w-[140px]"
                >
                  {status === 'linking' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    'Link Account'
                  )}
                </button>
              </div>
              {status === 'error' && (
                <p className="text-sm text-destructive mt-3 font-medium flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> {errorMessage}
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PHIDEntrySection;
