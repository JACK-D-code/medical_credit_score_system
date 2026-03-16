import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, FileText, Activity, CreditCard, ChevronRight, Download } from 'lucide-react';
import Header from '../../components/ui/Header';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import { Card } from '../../components/ui/card';
import Button from '../../components/ui/Button';
import api from '../../lib/api';
import { useNavigate } from 'react-router-dom';

const ActivityReports = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('clinical');
  const [timeline, setTimeline] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/patient-login');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, billingRes] = await Promise.all([
          api.get('/profile'),
          api.get('/billing')
        ]);
        setTimeline(profileRes.data.activities || profileRes.data.timeline || []);
        setBills(billingRes.data.bills || (Array.isArray(billingRes.data) ? billingRes.data : []));
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTimeline = timeline.filter(item => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBills = bills.filter(bill => 
    bill.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.treatmentType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bill.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderClinicalRow = (event) => (
    <tr key={event.id} className="border-b border-border hover:bg-muted/30 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{event.title}</p>
            <p className="text-xs text-muted-foreground">{event.description}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-sm text-muted-foreground">
        {new Date(event.date).toLocaleDateString()}
      </td>
      <td className="py-4 px-4 text-sm text-muted-foreground">
        {event.location || event.device}
      </td>
      <td className="py-4 px-4">
        <span className="bg-emerald-500/10 text-emerald-500 px-2.5 py-1 rounded-full text-xs font-semibold capitalize border border-emerald-500/20">
          Logged
        </span>
      </td>
    </tr>
  );

  const renderFinancialRow = (bill) => (
    <tr key={bill.id} className="border-b border-border hover:bg-muted/30 transition-colors">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="bg-purple-500/10 p-2 rounded-lg text-purple-500">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-foreground">{bill.treatmentType}</p>
            <p className="text-xs text-muted-foreground">{bill.hospitalName}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-sm text-muted-foreground font-mono">
        ₹{bill.billAmount?.toLocaleString()}
      </td>
      <td className="py-4 px-4 text-sm text-muted-foreground">
        {new Date(bill.billDate).toLocaleDateString()}
      </td>
      <td className="py-4 px-4">
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize border ${
          bill.status === 'paid' ? 'bg-success/10 text-success border-success/20' : 
          bill.status === 'emi_active' ? 'bg-primary/10 text-primary border-primary/20' : 
          'bg-destructive/10 text-destructive border-destructive/20'
        }`}>
          {bill.status.replace('_', ' ')}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Header onLogout={handleLogout} />

      <main className="max-w-6xl mx-auto px-4 pt-32 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-2">
              Activity History & Reports
            </h1>
            <p className="text-muted-foreground">
              Review your entire clinical timeline and financial medical billing records.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64 transition-all"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="w-4 h-4" /> Export
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden shadow-elevation-2">
          <div className="flex border-b border-border bg-muted/30 px-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('clinical')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-colors whitespace-nowrap ${
                activeTab === 'clinical' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Activity className="w-4 h-4" /> Clinical Timeline ({filteredTimeline.length})
            </button>
            <button
              onClick={() => setActiveTab('financial')}
              className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-colors whitespace-nowrap ${
                activeTab === 'financial' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <CreditCard className="w-4 h-4" /> Financial Bills ({filteredBills.length})
            </button>
          </div>

          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-muted/10 border-b border-border">
                  <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                    {activeTab === 'clinical' ? 'Event / Details' : 'Treatment / Hospital'}
                  </th>
                  <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                    {activeTab === 'clinical' ? 'Date' : 'Amount'}
                  </th>
                  <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                    {activeTab === 'clinical' ? 'Location' : 'Date'}
                  </th>
                  <th className="py-3 px-4 font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-muted-foreground">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                      Loading reports...
                    </td>
                  </tr>
                ) : activeTab === 'clinical' ? (
                  filteredTimeline.length > 0 ? (
                    filteredTimeline.map(renderClinicalRow)
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-muted-foreground">No clinical events found.</td>
                    </tr>
                  )
                ) : (
                  filteredBills.length > 0 ? (
                    filteredBills.map(renderFinancialRow)
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-muted-foreground">No financial bills found.</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      <MobileBottomNav />
    </div>
  );
};

export default ActivityReports;
