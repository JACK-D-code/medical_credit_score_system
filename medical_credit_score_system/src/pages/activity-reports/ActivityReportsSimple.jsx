import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import SessionSecurityHeader from '../../components/ui/SessionSecurityHeader';
import MobileBottomNav from '../../components/ui/MobileBottomNav';
import { Card } from '../../components/ui/card';
import Button from '../../components/ui/Button';
import { Calendar, Search, Filter, FileText, Activity, CreditCard, ChevronRight, Download } from 'lucide-react';

const ActivityReports = () => {
  const [activeTab, setActiveTab] = useState('clinical');
  const [activities, setActivities] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true);
        
        // Get patient data from PHID system
        const savedPHID = localStorage.getItem('currentPHID');
        const savedData = localStorage.getItem('patientData');
        
        if (savedPHID && savedData) {
          const patientInfo = JSON.parse(savedData);
          setPatientData(patientInfo);
          
          // Mock activities
          const mockActivities = [
            {
              id: '1',
              activityType: 'MEDICINE',
              activityTitle: 'Morning Medicine',
              pointsEarned: 5,
              completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              status: 'COMPLETED'
            },
            {
              id: '2',
              activityType: 'EXERCISE',
              activityTitle: 'Morning Walk',
              pointsEarned: 8,
              completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              status: 'COMPLETED'
            },
            {
              id: '3',
              activityType: 'DIET',
              activityTitle: 'Healthy Breakfast',
              pointsEarned: 5,
              completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
              status: 'COMPLETED'
            }
          ];

          // Mock bills
          const mockBills = [
            {
              id: '1',
              billNumber: 'BILL-001',
              title: 'General Consultation',
              billAmount: 500,
              status: 'PAID',
              billDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: '2',
              billNumber: 'BILL-002',
              title: 'Lab Tests',
              billAmount: 1200,
              status: 'PAID',
              billDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
            }
          ];

          setActivities(mockActivities);
          setBills(mockBills);
        } else {
          setActivities([]);
          setBills([]);
        }

      } catch (error) {
        console.error('Error fetching activity reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <SessionSecurityHeader />
        <div className="flex">
          <div className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading activity reports...</span>
            </div>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <SessionSecurityHeader />
        <div className="flex">
          <div className="flex-1 p-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Patient Data Found</h2>
              <p className="text-gray-600 mb-4">Please enter your PHID to access your activity reports.</p>
              <Button onClick={() => window.location.href = '/phid-entry'} className="mt-4">
                Enter PHID
              </Button>
            </div>
          </div>
        </div>
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <SessionSecurityHeader />
      <div className="flex">
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity Reports</h1>
            {patientData && (
              <p className="text-gray-600">
                Reports for {patientData.name} • PHID: {patientData.phid}
              </p>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{activities.length}</div>
                    <div className="text-sm text-gray-600">Total Activities</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{bills.length}</div>
                    <div className="text-sm text-gray-600">Total Bills</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{activities.reduce((sum, a) => sum + (a.pointsEarned || 0), 0)}</div>
                    <div className="text-sm text-gray-600">Points Earned</div>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <FileText className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">₹{bills.reduce((sum, b) => sum + (b.billAmount || 0), 0).toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Total Amount</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('clinical')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'clinical'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Activity className="h-4 w-4 inline mr-2" />
                Clinical Activities
              </button>
              <button
                onClick={() => setActiveTab('billing')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'billing'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <CreditCard className="h-4 w-4 inline mr-2" />
                Billing History
              </button>
            </nav>
          </div>

          {/* Clinical Activities Tab */}
          {activeTab === 'clinical' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Clinical Activities</h3>
                {activities.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No activities found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Activity className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{activity.activityTitle}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {activity.activityType}
                              </span>
                              <span>{new Date(activity.completedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            +{activity.pointsEarned || 0} points
                          </span>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Billing History Tab */}
          {activeTab === 'billing' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Billing History</h3>
                {bills.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No billing records found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bills.map((bill) => (
                      <div key={bill.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{bill.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>{bill.billNumber}</span>
                              <span>•</span>
                              <span>{new Date(bill.billDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-semibold">₹{bill.billAmount.toLocaleString()}</div>
                            <span className={`px-2 py-1 rounded text-xs ${
                              bill.status === 'PAID' ? 'bg-green-100 text-green-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {bill.status}
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
};

export default ActivityReports;
