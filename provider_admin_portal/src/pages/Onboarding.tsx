import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function Onboarding() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/providers/patients', formData);
            alert('Patient successfully onboarded to the network!');
            navigate('/dashboard');
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to onboard patient');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Patient Onboarding</h1>
                <p className="text-gray-400">Add a new patient to the centralized Medical Credit Engine.</p>
            </div>

            <div className="glass-panel p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">First Name</label>
                            <input type="text" required className="w-full bg-[#0a0f1c] border border-gray-800 rounded-lg px-4 py-2 text-white" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Last Name</label>
                            <input type="text" required className="w-full bg-[#0a0f1c] border border-gray-800 rounded-lg px-4 py-2 text-white" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                            <input type="tel" required className="w-full bg-[#0a0f1c] border border-gray-800 rounded-lg px-4 py-2 text-white" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email <span className="text-xs text-gray-500">(Optional)</span></label>
                            <input type="email" className="w-full bg-[#0a0f1c] border border-gray-800 rounded-lg px-4 py-2 text-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-8">
                        <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-2.5 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors">Cancel</button>
                        <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors disabled:opacity-50">
                            {loading ? 'Onboarding...' : 'Initialize Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
