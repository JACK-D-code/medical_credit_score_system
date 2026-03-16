import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/shadcn-button';
import MedicalCreditScoreSystem from '../../services/MedicalCreditScoreSystem';
import { 
  CreditCard, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Calculator, 
  Gift, 
  Heart, 
  Shield,
  Percent,
  Target,
  Zap,
  ChevronRight,
  Download,
  Wallet
} from 'lucide-react';

const BillingManagementIntegrated = () => {
  const [mcs] = useState(() => MedicalCreditScoreSystem.getInstance());
  const [patientData, setPatientData] = useState<any>(null);
  const [bills, setBills] = useState<any[]>([]);
  const [emiPlans, setEmiPlans] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bills');
  const [paymentSuccess, setPaymentSuccess] = useState<any>(null);

  useEffect(() => {
    const loadData = () => {
      setPatientData(mcs.getPatientData());
      setBills(mcs.getBills());
      setEmiPlans(mcs.getEmiPlans());
      setAnalytics(mcs.getAnalytics());
      setLoading(false);
    };

    loadData();

    const unsubscribeBill = mcs.on('billPaid', (data: any) => {
      setBills(mcs.getBills());
      setPatientData(mcs.getPatientData());
      setAnalytics(mcs.getAnalytics());
      setPaymentSuccess(data);
      setTimeout(() => setPaymentSuccess(null), 3000);
    });

    return () => unsubscribeBill();
  }, [mcs]);

  const payBill = (billId: string) => {
    const result = mcs.payBill(billId);
    if (result.success) {
      console.log(`Bill paid: ${result.bill.title} (+${result.scoreChange} credit score points)`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'emi': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'charity': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const discounts = [
    { id: '1', title: 'Loyalty Discount', type: 'percentage', value: 20, validUntil: '2024-12-31', used: false },
    { id: '2', title: 'Early Payment', type: 'percentage', value: 15, validUntil: '2024-11-30', used: false },
    { id: '3', title: 'Bulk Payment', type: 'fixed', value: 500, validUntil: '2024-12-15', used: false }
  ];

  const charityPrograms = [
    { 
      id: '1', 
      title: 'Healthcare for All', 
      description: 'Support for underprivileged patients',
      coverage: 50, 
      status: 'eligible',
      icon: Heart
    },
    { 
      id: '2', 
      title: 'Emergency Fund', 
      description: 'Emergency medical expense support',
      coverage: 100, 
      status: 'available',
      icon: Shield
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Payment Success Notification */}
      {paymentSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-400" />
              <div>
                <div className="font-bold text-green-400">Payment Successful!</div>
                <div className="text-sm text-green-300">
                  +{paymentSuccess.scoreChange} credit score points
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Billing Management</h1>
          <p className="text-slate-400">
            Manage your medical bills, EMI plans, and discounts • Credit Score: <span className="text-cyan-400 font-bold">{patientData?.creditScore}</span>
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">₹{analytics?.totalSpent?.toLocaleString() || 0}</div>
                  <div className="text-sm text-slate-400">Total Spent</div>
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
                  <div className="text-2xl font-bold text-white">₹{analytics?.totalSavings?.toLocaleString() || 0}</div>
                  <div className="text-sm text-slate-400">Total Savings</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{emiPlans.filter(p => p.status === 'active').length}</div>
                  <div className="text-sm text-slate-400">Active EMIs</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <Gift className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{analytics?.pendingBills || 0}</div>
                  <div className="text-sm text-slate-400">Pending Bills</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['bills', 'emi', 'discounts', 'charity'].map((tab) => (
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

        {/* Bills Tab */}
        {activeTab === 'bills' && (
          <div className="space-y-4">
            {bills.map((bill) => (
              <Card key={bill.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-white">{bill.title}</h3>
                        <Badge className={getStatusColor(bill.status)}>
                          {bill.status.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>Bill: {bill.billNumber}</span>
                        <span>Due: {new Date(bill.dueDate).toLocaleDateString()}</span>
                        {bill.paidDate && <span>Paid: {new Date(bill.paidDate).toLocaleDateString()}</span>}
                      </div>
                      {bill.discount > 0 && (
                        <div className="mt-2 text-green-400 text-sm">
                          Discount Applied: ₹{bill.discount.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white mb-1">₹{bill.amount.toLocaleString()}</div>
                      {bill.originalAmount > bill.amount && (
                        <div className="text-sm text-slate-500 line-through">
                          ₹{bill.originalAmount.toLocaleString()}
                        </div>
                      )}
                      <div className="mt-2 flex gap-2">
                        {bill.status === 'pending' && (
                          <>
                            <Button 
                              onClick={() => payBill(bill.id)}
                              className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
                            >
                              Pay Now (+5 pts)
                            </Button>
                            <Button 
                              variant="outline" 
                              className="border-slate-600 text-slate-400"
                            >
                              EMI Plan
                            </Button>
                          </>
                        )}
                        {bill.status === 'paid' && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Paid
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* EMI Tab */}
        {activeTab === 'emi' && (
          <div className="space-y-4">
            {emiPlans.length > 0 ? (
              emiPlans.map((plan) => (
                <Card key={plan.id} className="bg-slate-800/50 border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2">EMI Plan - {plan.totalInstallments} Months</h3>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Total:</span>
                            <span className="ml-2 text-white font-medium">₹{plan.totalAmount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Monthly:</span>
                            <span className="ml-2 text-white font-medium">₹{plan.emiAmount.toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Interest:</span>
                            <span className="ml-2 text-white font-medium">{plan.interestRate}%</span>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-slate-400">Progress: {plan.paidInstallments}/{plan.totalInstallments}</span>
                            <span className="text-white">{Math.round((plan.paidInstallments / plan.totalInstallments) * 100)}%</span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-cyan-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(plan.paidInstallments / plan.totalInstallments) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={plan.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}>
                          {plan.status.toUpperCase()}
                        </Badge>
                        <div className="mt-2 text-slate-400 text-sm">
                          Next Due: {new Date(plan.nextDueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 text-slate-400">
                <Calculator className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg">No active EMI plans</p>
                <p className="text-sm">Set up EMI for your pending bills</p>
              </div>
            )}
          </div>
        )}

        {/* Discounts Tab */}
        {activeTab === 'discounts' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {discounts.map((discount) => (
              <Card key={discount.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white">{discount.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">{discount.type === 'percentage' ? `${discount.value}% off` : `₹${discount.value} off`}</p>
                    </div>
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                      <Percent className="h-5 w-5 text-yellow-400" />
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-slate-400 mb-4">
                    <div className="flex justify-between">
                      <span>Valid Until:</span>
                      <span className="text-white">{new Date(discount.validUntil).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge className={discount.used ? 'bg-gray-500/20 text-gray-400' : 'bg-green-500/20 text-green-400'}>
                        {discount.used ? 'Used' : 'Available'}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    disabled={discount.used}
                    className={`w-full ${discount.used ? 'bg-slate-700 text-slate-500' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30'}`}
                  >
                    {discount.used ? 'Already Used' : 'Apply Discount'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Charity Tab */}
        {activeTab === 'charity' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {charityPrograms.map((charity) => (
              <Card key={charity.id} className="bg-slate-800/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white">{charity.title}</h3>
                      <p className="text-slate-400 text-sm mt-1">{charity.description}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <charity.icon className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Coverage:</span>
                      <span className="text-white font-medium">{charity.coverage}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Status:</span>
                      <Badge className={
                        charity.status === 'eligible' ? 'bg-green-500/20 text-green-400' :
                        charity.status === 'available' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-gray-500/20 text-gray-400'
                      }>
                        {charity.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    className="w-full" 
                    className={`w-full ${
                      charity.status === 'eligible' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30' :
                      'bg-slate-700 text-slate-400'
                    }`}
                    disabled={charity.status !== 'eligible'}
                  >
                    {charity.status === 'eligible' ? 'Apply for Support' : 'Check Eligibility'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Credit Impact Info */}
        <Card className="mt-8 bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                <Wallet className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">Credit Score Impact</h3>
                <p className="text-slate-400 text-sm">
                  Paying bills on time increases your credit score by <span className="text-green-400 font-bold">+5 points</span> per payment. 
                  Setting up EMI plans maintains your current score while making payments manageable.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BillingManagementIntegrated;
