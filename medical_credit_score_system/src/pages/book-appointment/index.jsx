import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, ChevronRight, Activity, Award } from 'lucide-react';
import Header from '../../components/ui/Header';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import { Card } from '../../components/ui/card';
import Button from '../../components/ui/Button';
import api from '../../lib/api';
import { useNavigate } from 'react-router-dom';

const HOSPITALS = [
  "City General Hospital",
  "Apollo Wellness Clinic",
  "Specialized Heart Center",
  "MediCare Pediatrics"
];

const DEPARTMENTS = [
  "General Physician",
  "Cardiology",
  "Orthopedics",
  "Neurology",
  "Dermatology"
];

const BookAppointment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hospitalName: '',
    type: '',
    date: '',
    time: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/patient-login');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Record the visit using reportVisit endpoint
      await api.post('/profile/timeline', {
        hospitalName: formData.hospitalName,
        date: formData.date,
        type: formData.type,
        description: `Proactive appointment booked for ${formData.time}. ${formData.description}`
      });
      
      setSuccess(true);
      setTimeout(() => navigate('/medical-credit-dashboard'), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to book appointment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header onLogout={handleLogout} />

      <main className="max-w-4xl mx-auto px-4 pt-32 pb-12">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
            Book Appointment
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            Schedule your visit and earn <Award className="w-4 h-4 text-purple-500" /> <span className="text-purple-500 font-bold">+10 Loyalty Points</span> today!
          </p>
        </div>

        {success ? (
          <Card className="bg-emerald-500/10 border-emerald-500/30 p-8 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.5)]">
              <Calendar className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">Appointment Confirmed!</h2>
            <p className="text-gray-300 mb-6">Your visit has been logged securely to your Medical Profile.</p>
            <div className="inline-block bg-background px-6 py-4 rounded-xl border border-border">
              <p className="font-bold text-purple-500 flex items-center gap-2 justify-center">
                <Award className="w-5 h-5" />
                Loyalty Points Awarded
              </p>
              <p className="text-sm text-muted-foreground mt-1">This proactive booking actively increases your Medical Credit Score.</p>
            </div>
            <p className="text-sm text-gray-500 mt-6">Redirecting to Dashboard...</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b border-border pb-2">Where & Who</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> Provider / Hospital
                        </label>
                        <select
                          name="hospitalName"
                          required
                          value={formData.hospitalName}
                          onChange={handleChange}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                        >
                          <option value="">Select Hospital...</option>
                          {HOSPITALS.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <User className="w-4 h-4" /> Department / Specialist
                        </label>
                        <select
                          name="type"
                          required
                          value={formData.type}
                          onChange={handleChange}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors"
                        >
                          <option value="">Select Department...</option>
                          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-semibold border-b border-border pb-2">When</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> Date
                        </label>
                        <input
                          type="date"
                          name="date"
                          required
                          value={formData.date}
                          onChange={handleChange}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors text-foreground"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Clock className="w-4 h-4" /> Time
                        </label>
                        <input
                          type="time"
                          name="time"
                          required
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:border-primary outline-none transition-colors text-foreground"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-semibold border-b border-border pb-2">Additional Notes</h3>
                    <div className="space-y-2">
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Any specific symptoms or reasons for visit?"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 h-24 resize-none focus:border-primary outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-4 text-lg font-bold flex items-center justify-center gap-2 mt-4"
                    disabled={isSubmitting || !formData.hospitalName || !formData.date || !formData.type}
                  >
                    {isSubmitting ? 'Confirming...' : 'Confirm Appointment'}
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </form>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border-purple-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Loyalty Benefits</h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <span>Booking securely through the portal validates your identity.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <span>Earns Health Activity Points ensuring better Credit Offers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                    <span>Automates Check-In speed upon arrival at the provider.</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        )}
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default BookAppointment;
