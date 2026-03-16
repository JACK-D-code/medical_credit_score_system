import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/shadcn-button';
import MedicalCreditScoreSystem from '../../services/MedicalCreditScoreSystem';
import { 
  Calendar, 
  Search, 
  Filter, 
  FileText, 
  Activity, 
  CreditCard, 
  ChevronRight, 
  Download, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Award,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';

const ActivityReportsIntegrated = () => {
  const [mcs] = useState(() => MedicalCreditScoreSystem.getInstance());
  const [patientData, setPatientData] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('activities');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    const loadData = () => {
      setPatientData(mcs.getPatientData());
      setActivities(mcs.getActivities());
      setBills(mcs.getBills());
      setAnalytics(mcs.getAnalytics());
      setLoading(false);
    };

    loadData();

    const unsubscribeActivity = mcs.on('activityCompleted', () => {
      setActivities(mcs.getActivities());
      setAnalytics(mcs.getAnalytics());
    });

    const unsubscribeBill = mcs.on('billPaid', () => {
      setBills(mcs.getBills());
      setAnalytics(mcs.getAnalytics());
    });

    return () => {
      unsubscribeActivity();
      unsubscribeBill();
    };
  }, [mcs]);

  const getActivityStats = () => {
    const today = new Date().toDateString();
    const todayActivities = activities.filter(activity => 
      new Date(activity.completedAt).toDateString() === today
    );
    
    const thisWeek = activities.filter(activity => {
      const activityDate = new Date(activity.completedAt);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return activityDate >= weekAgo;
    });

    const thisMonth = activities.filter(activity => {
      const activityDate = new Date(activity.completedAt);
      const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return activityDate >= monthAgo;
    });

    // Activity type breakdown
    const typeBreakdown = activities.reduce((acc: any, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {});

    return {
      today: todayActivities.length,
      thisWeek: thisWeek.length,
      thisMonth: thisMonth.length,
      totalPoints: todayActivities.reduce((sum, activity) => sum + (activity.points || 0), 0),
      typeBreakdown
    };
  };

  const getBillingStats = () => {
    const totalAmount = bills.reduce((sum, bill) => sum + (bill.amount || 0), 0);
    const paidAmount = bills
      .filter(bill => bill.status === 'paid')
      .reduce((sum, bill) => sum + (bill.amount || 0), 0);
    
    const totalDiscount = bills.reduce((sum, bill) => sum + (bill.discount || 0), 0);
    
    return {
      totalBills: bills.length,
      totalAmount,
      paidAmount,
      pendingAmount: totalAmount - paidAmount,
      totalDiscount,
      paidCount: bills.filter(b => b.status === 'paid').length,
      pendingCount: bills.filter(b => b.status === 'pending').length
    };
  };

  const exportToCSV = (data: any[], filename: string) => {
    const headers = data.length > 0 && data[0].type ? 
      ['Date', 'Activity Type', 'Activity Title', 'Points Earned', 'Status'] :
      ['Date', 'Bill Number', 'Title', 'Amount', 'Status'];
    
    const csvContent = [
      headers.join(','),
      ...data.map((item: any) => {
        if (item.type) {
          return [
            new Date(item.completedAt).toLocaleDateString(),
            item.type,
            item.title,
            item.points || 0,
            'Completed'
          ].join(',');
        } else {
          return [
            new Date(item.dueDate).toLocaleDateString(),
            item.billNumber,
            item.title,
            item.amount || 0,
            item.status
          ].join(',');
        }
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const activityStats = getActivityStats();
  const billingStats = getBillingStats();

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.type?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.billNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Activity Reports</h1>
              <p className="text-slate-400">
                Comprehensive reports • Credit Score: <span className="text-cyan-400 font-bold">{patientData?.creditScore}</span>
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-slate-400">Total Points</div>
                <div className="text-2xl font-bold text-yellow-400">{patientData?.totalPoints?.toLocaleString()}</div>
              </div>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30">
                <BarChart3 className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Activity className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{activityStats.today}</div>
                  <div className="text-sm text-slate-400">Today's Activities</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{activityStats.thisWeek}</div>
                  <div className="text-sm text-slate-400">This Week</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Award className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{activityStats.totalPoints}</div>
                  <div className="text-sm text-slate-400">Today's Points</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">₹{billingStats.totalAmount.toLocaleString()}</div>
                  <div className="text-sm text-slate-400">Total Billing</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Type Breakdown */}
        <Card className="mb-8 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <PieChart className="h-5 w-5 text-cyan-400" />
              Activity Type Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(activityStats.typeBreakdown).map(([type, count]: [string, any]) => (
                <div key={type} className="text-center p-4 bg-slate-700/50 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-400">{count}</div>
                  <div className="text-sm text-slate-400">{type}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search & Filter */}
        <Card className="mb-6 bg-slate-800/50 border-slate-700">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search activities or bills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
                <Button 
                  onClick={() => exportToCSV(activeTab === 'activities' ? filteredActivities : filteredBills, activeTab)}
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border-cyan-500/30"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['activities', 'billing'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Activities Tab */}
        {activeTab === 'activities' && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Activity className="h-5 w-5 text-cyan-400" />
                Activity History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                          <Activity className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{activity.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Badge className="bg-slate-600 text-slate-300">
                              {activity.type}
                            </Badge>
                            <span>{new Date(activity.completedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                            +{activity.points} pts
                          </span>
                          <p className="text-xs text-slate-400 mt-1">{activity.impact}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-500" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <Activity className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">No activities found</p>
                    <p className="text-sm">Complete activities to see them here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Billing Tab */}
        {activeTab === 'billing' && (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CreditCard className="h-5 w-5 text-cyan-400" />
                Billing History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredBills.length > 0 ? (
                  filteredBills.map((bill) => (
                    <div key={bill.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg hover:bg-slate-700 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{bill.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <span>{bill.billNumber}</span>
                            <span>•</span>
                            <span>{new Date(bill.billDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-white font-semibold">₹{bill.billAmount.toLocaleString()}</div>
                          <Badge className={
                            bill.status === 'paid' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                            'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          }>
                            {bill.status.toUpperCase()}
                          </Badge>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-500" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <CreditCard className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">No billing records found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-white font-medium mb-4">Activity Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Activities</span>
                  <span className="text-white font-medium">{activities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">This Week</span>
                  <span className="text-white font-medium">{activityStats.thisWeek}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">This Month</span>
                  <span className="text-white font-medium">{activityStats.thisMonth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Points</span>
                  <span className="text-yellow-400 font-medium">{patientData?.totalPoints?.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <h3 className="text-white font-medium mb-4">Billing Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Bills</span>
                  <span className="text-white font-medium">{billingStats.totalBills}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Paid Bills</span>
                  <span className="text-green-400 font-medium">{billingStats.paidCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pending Bills</span>
                  <span className="text-yellow-400 font-medium">{billingStats.pendingCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Savings</span>
                  <span className="text-green-400 font-medium">₹{billingStats.totalDiscount.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ActivityReportsIntegrated;
