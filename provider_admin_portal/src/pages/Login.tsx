import React, { useState } from 'react';
import Icon from '../components/AppIcon';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'PROVIDER') {
          navigate('/provider');
      } else {
          navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                <Icon name="Activity" size={32} color="#6366f1" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Enterprise Provider Portal
              </h1>
            </div>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
              Secure hospital access to issue bills and assess patient medical credit
            </p>
          </div>

          <div className="max-w-md mx-auto glass-panel p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Sign In</h2>
            
            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-3 mb-6 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Portal ID / Email</label>
                    <input
                        type="email"
                        required
                        className="w-full bg-[#0a0f1c]/50 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@hospital.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Admin Password</label>
                    <input
                        type="password"
                        required
                        className="w-full bg-[#0a0f1c]/50 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 mt-4 shadow-lg shadow-indigo-500/20"
                >
                    {loading ? 'Authenticating...' : 'Secure Login'}
                </button>
                <div className="text-center mt-6 pt-6 border-t border-gray-800">
                    <button
                        type="button"
                        onClick={() => navigate('/provider-registration')}
                        className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                        Don't have an enterprise account? Register
                    </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
