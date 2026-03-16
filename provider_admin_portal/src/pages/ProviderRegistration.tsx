import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/AppIcon';
import api from '../lib/api';

export default function ProviderRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
      email: '',
      password: '',
      hospitalName: '',
      specialization: '',
      licenseNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      try {
          await api.post('/auth/register', {
              email: formData.email,
              password: formData.password,
              role: 'PROVIDER',
              hospitalName: formData.hospitalName,
              specialization: formData.specialization,
              licenseNumber: formData.licenseNumber
          });
          alert('Enterprise successfully registered! You can now login.');
          navigate('/login');
      } catch (err: any) {
          setError(err.response?.data?.error || 'Registration failed');
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                <Icon name="Activity" size={32} color="#6366f1" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                Enterprise Registration
              </h1>
            </div>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
              Join the Medical Credit Network as an authorized hospital
            </p>
          </div>

          <div className="max-w-lg mx-auto glass-panel p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Register Hospital</h2>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-3 mb-6 text-sm text-center">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Portal ID / Email</label>
                    <input type="email" required className="w-full bg-[#0a0f1c]/50 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Admin Password</label>
                    <input type="password" required className="w-full bg-[#0a0f1c]/50 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Hospital / Enterprise Name</label>
                    <input type="text" required className="w-full bg-[#0a0f1c]/50 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors" value={formData.hospitalName} onChange={e => setFormData({...formData, hospitalName: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Specialization Focus</label>
                    <input type="text" className="w-full bg-[#0a0f1c]/50 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Medical License Number</label>
                    <input type="text" required className="w-full bg-[#0a0f1c]/50 border border-gray-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors" value={formData.licenseNumber} onChange={e => setFormData({...formData, licenseNumber: e.target.value})} />
                </div>
                <div className="pt-2">
                    <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 mt-2 shadow-lg shadow-indigo-500/20">
                        {loading ? 'Registering Network...' : 'Complete Registration'}
                    </button>
                </div>
            </form>

            <div className="text-center mt-6 pt-6 border-t border-gray-800">
               <button 
                 onClick={() => navigate('/login')}
                 className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
               >
                 &larr; Already registered? Back to Portal Login
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
