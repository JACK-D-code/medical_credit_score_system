import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/shadcn-button';
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
  Zap
} from 'lucide-react';

const BillingManagement = () => {
  const [patientData, setPatientData] = useState<any>(null);
  const [bills, setBills] = useState<any[]>([]);
  const [emiPlans, setEmiPlans] = useState<any[]>([]);
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [charityPrograms, setCharityPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bills');

  useEffect(() => {
    const loadBillingData = () => {
      try {
        setLoading(true);
        
        // Get patient data from PHID system
        const savedPHID = localStorage.getItem('currentPHID');
        const savedData = localStorage.getItem('patientData');
        
        if (savedPHID && savedData) {
          const patientInfo = JSON.parse(savedData);
          setPatientData(patientInfo);
          
          // Generate dynamic bills
          const dynamicBills = [
            {
              id: '1',
              billNumber: 'BILL-001',
              title: 'General Consultation',
              description: 'Dr. Smith - Regular checkup',
              amount: 1200,
              originalAmount: 1500,
              status: 'paid',
              dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              paidDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
              category: 'Consultation',
              discount: 300,
              paymentMethod: 'Credit Card'
            },
            {
              id: '2',
              billNumber: 'BILL-002',
              title: 'Lab Tests Package',
              description: 'Complete blood work and tests',
              amount: 2800,
              originalAmount: 3500,
              status: 'emi',
              dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
              emiPlanId: 'emi-1',
              category: 'Diagnostics',
              discount: 700,
              paymentMethod: 'EMI'
            },
            {
              id: '3',
              billNumber: 'BILL-003',
              title: 'Emergency Consultation',
              description: 'Dr. Williams - Emergency visit',
              amount: 2400,
              originalAmount: 3000,
              status: 'pending',
              dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
              category: 'Emergency',
              discount: 600,
              paymentMethod: 'Pending'
            },
            {
              id: '4',
              billNumber: 'BILL-004',
              title: 'Medicine Purchase',
              description: 'Prescribed medications',
              amount: 850,
              originalAmount: 1000,
              status: 'charity',
              dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
              category: 'Pharmacy',
              discount: 150,
              paymentMethod: 'Charity'
            }
          ];

          // Generate EMI plans
          const dynamicEmiPlans = [
            {
              id: 'emi-1',
              billId: '2',
              totalAmount: 2800,
              emiAmount: 467,
              tenure: 6,
              interestRate: 0,
              status: 'active',
              nextDueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
              paidInstallments: 1,
              totalInstallments: 6,
              remainingAmount: 2333
            },
            {
              id: 'emi-2',
              billId: '3',
              totalAmount: 2400,
              emiAmount: 400,
              tenure: 6,
              interestRate: 5,
              status: 'pending',
              nextDueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
              paidInstallments: 0,
              totalInstallments: 6,
              remainingAmount: 2400
            }
          ];

          // Generate available discounts
          const dynamicDiscounts = [
            {
              id: 'discount-1',
              title: 'Loyalty Discount',
              description: 'Gold member special discount',
              type: 'percentage',
              value: 20,
              applicableCategories: ['Consultation', 'Diagnostics'],
              validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              usageLimit: 3,
              usedCount: 1,
              minAmount: 1000
            },
            {
              id: 'discount-2',
              title: 'Early Bird Discount',
              description: 'Pay within 7 days for discount',
              type: 'percentage',
              value: 15,
              applicableCategories: ['All'],
              validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              usageLimit: 1,
              usedCount: 0,
              minAmount: 500
            },
            {
              id: 'discount-3',
              title: 'Bulk Payment Discount',
              description: 'Pay multiple bills together',
              type: 'fixed',
              value: 500,
              applicableCategories: ['All'],
              validUntil: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
              usageLimit: 2,
              usedCount: 0,
              minAmount: 3000
            }
          ];

          // Generate charity programs
          const dynamicCharity = [
            {
              id: 'charity-1',
              title: 'Healthcare for All',
              description: 'Support for underprivileged patients',
              type: 'partial',
              coverage: 50,
              maxAmount: 5000,
              eligibilityCriteria: 'Credit score above 700',
              status: 'eligible',
              appliedTo: 'BILL-004',
              approvedAmount: 425
            },
            {
              id: 'charity-2',
              title: 'Emergency Fund',
              description: 'Emergency medical expense support',
              type: 'full',
              coverage: 100,
              maxAmount: 10000,
              eligibilityCriteria: 'Emergency cases only',
              status: 'available',
              appliedTo: null,
              approvedAmount: 0
            },
            {
              id: 'charity-3',
              title: 'Chronic Illness Support',
              description: 'Long-term treatment assistance',
              type: 'partial',
              coverage: 75,
              maxAmount: 15000,
              eligibilityCriteria: 'Chronic condition verification',
              status: 'pending',
              appliedTo: null,
              approvedAmount: 0
            }
          ];

          setBills(dynamicBills);
          setEmiPlans(dynamicEmiPlans);
          setDiscounts(dynamicDiscounts);
          setCharityPrograms(dynamicCharity);

        } else {
          setPatientData(null);
          setBills([]);
          setEmiPlans([]);
          setDiscounts([]);
          setCharityPrograms([]);
        }

      } catch (error) {
        console.error('Error loading billing data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBillingData();
  }, []);

  const payBill = (billId: string) => {
    setBills(prev => prev.map(bill => 
      bill.id === billId ? { 
        ...bill, 
        status: 'paid',
        paidDate: new Date().toISOString(),
        paymentMethod: 'Credit Card'
      } : bill
    ));

    // Update patient credit score for timely payment
    if (patientData) {
      const updatedPatient = {
        ...patientData,
        creditScore: Math.min(850, (patientData.creditScore || 750) + 5),
        trustScore: Math.min(100, (patientData.trustScore || 85) + 2)
      };

      setPatientData(updatedPatient);
      localStorage.setItem('patientData', JSON.stringify(updatedPatient));
    }
  };

  const applyEMI = (billId: string, emiPlanId: string) => {
    const plan = emiPlans.find(p => p.id === emiPlanId);
    if (plan && plan.status === 'pending') {
      setEmiPlans(prev => prev.map(p => 
        p.id === emiPlanId ? { ...p, status: 'active' } : p
      ));
      
      setBills(prev => prev.map(bill => 
        bill.id === billId ? { 
          ...bill, 
          status: 'emi',
          emiPlanId: emiPlanId,
          paymentMethod: 'EMI'
        } : bill
      ));
    }
  };

  const applyDiscount = (billId: string, discountId: string) => {
    const discount = discounts.find(d => d.id === discountId);
    const bill = bills.find(b => b.id === billId);
    
    if (discount && bill && discount.usedCount < discount.usageLimit) {
      const discountAmount = discount.type === 'percentage' 
        ? (bill.amount * discount.value) / 100
        : Math.min(discount.value, bill.amount);
      
      setBills(prev => prev.map(b => 
        b.id === billId ? { 
          ...b, 
          amount: Math.max(0, b.amount - discountAmount),
          discount: discountAmount
        } : b
      ));

      setDiscounts(prev => prev.map(d => 
        d.id === discountId ? { ...d, usedCount: d.usedCount + 1 } : d
      ));
    }
  };

  const applyCharity = (billId: string, charityId: string) => {
    const charity = charityPrograms.find(c => c.id === charityId);
    const bill = bills.find(b => b.id === billId);
    
    if (charity && bill && charity.status === 'eligible') {
      const coverageAmount = (bill.amount * charity.coverage) / 100;
      
      setBills(prev => prev.map(b => 
        b.id === billId ? { 
          ...b, 
          amount: Math.max(0, b.amount - coverageAmount),
          status: 'charity',
          paymentMethod: 'Charity'
        } : b
      ));

      setCharityPrograms(prev => prev.map(c => 
        c.id === charityId ? { 
          ...c, 
          status: 'applied',
          appliedTo: billId,
          approvedAmount: coverageAmount
        } : c
      ));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'emi': return 'bg-blue-100 text-blue-800';
      case 'charity': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateTotalBilling = () => {
    return bills.reduce((sum, bill) => sum + bill.amount, 0);
  };

  const calculateTotalSavings = () => {
    return bills.reduce((sum, bill) => sum + (bill.discount || 0), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading billing management...</span>
        </div>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Patient Data Found</h2>
          <p className="text-gray-600 mb-4">Please enter your PHID to access billing management.</p>
          <Button onClick={() => window.location.href = '/phid-entry'}>
            Enter PHID
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing Management</h1>
          <p className="text-gray-600">
            Manage your medical bills, EMI plans, discounts, and charity support • PHID: {patientData.phid}
          </p>
        </div>

        {/* Billing Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">₹{calculateTotalBilling().toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Billing</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">₹{calculateTotalSavings().toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Savings</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calculator className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{emiPlans.filter(p => p.status === 'active').length}</div>
                  <div className="text-sm text-gray-600">Active EMIs</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Gift className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{discounts.filter(d => d.usedCount < d.usageLimit).length}</div>
                  <div className="text-sm text-gray-600">Available Discounts</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('bills')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bills'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Bills
            </button>
            <button
              onClick={() => setActiveTab('emi')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'emi'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calculator className="h-4 w-4 inline mr-2" />
              EMI Plans
            </button>
            <button
              onClick={() => setActiveTab('discounts')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'discounts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Percent className="h-4 w-4 inline mr-2" />
              Discounts
            </button>
            <button
              onClick={() => setActiveTab('charity')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'charity'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Heart className="h-4 w-4 inline mr-2" />
              Charity
            </button>
          </nav>
        </div>

        {/* Bills Tab */}
        {activeTab === 'bills' && (
          <div className="space-y-4">
            {bills.map((bill) => (
              <Card key={bill.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{bill.title}</h3>
                        <Badge className={getStatusColor(bill.status)}>
                          {bill.status.toUpperCase()}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800">
                          {bill.category}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{bill.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Bill: {bill.billNumber}</span>
                        <span>Due: {new Date(bill.dueDate).toLocaleDateString()}</span>
                        {bill.paidDate && <span>Paid: {new Date(bill.paidDate).toLocaleDateString()}</span>}
                        <span>Method: {bill.paymentMethod}</span>
                      </div>
                      {bill.discount > 0 && (
                        <div className="mt-2 text-green-600 text-sm">
                          Discount Applied: ₹{bill.discount.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold mb-1">₹{bill.amount.toLocaleString()}</div>
                      {bill.originalAmount > bill.amount && (
                        <div className="text-sm text-gray-500 line-through">
                          ₹{bill.originalAmount.toLocaleString()}
                        </div>
                      )}
                      <div className="mt-2 space-x-2">
                        {bill.status === 'pending' && (
                          <>
                            <Button size="sm" onClick={() => payBill(bill.id)}>
                              Pay Now
                            </Button>
                            <Button size="sm" variant="outline">
                              Apply EMI
                            </Button>
                          </>
                        )}
                        {bill.status === 'emi' && (
                          <Badge className="bg-blue-100 text-blue-800">
                            EMI Active
                          </Badge>
                        )}
                        {bill.status === 'charity' && (
                          <Badge className="bg-purple-100 text-purple-800">
                            Charity Applied
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

        {/* EMI Plans Tab */}
        {activeTab === 'emi' && (
          <div className="space-y-4">
            {emiPlans.map((plan) => (
              <Card key={plan.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">EMI Plan - {plan.totalInstallments} Months</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="ml-2 font-medium">₹{plan.totalAmount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Monthly EMI:</span>
                          <span className="ml-2 font-medium">₹{plan.emiAmount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Interest Rate:</span>
                          <span className="ml-2 font-medium">{plan.interestRate}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Remaining:</span>
                          <span className="ml-2 font-medium">₹{plan.remainingAmount.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress: {plan.paidInstallments}/{plan.totalInstallments}</span>
                          <span>{Math.round((plan.paidInstallments / plan.totalInstallments) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(plan.paidInstallments / plan.totalInstallments) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={
                        plan.status === 'active' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }>
                        {plan.status.toUpperCase()}
                      </Badge>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">Next Due:</p>
                        <p className="text-sm font-medium">
                          {new Date(plan.nextDueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Discounts Tab */}
        {activeTab === 'discounts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {discounts.map((discount) => (
              <Card key={discount.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{discount.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{discount.description}</p>
                    </div>
                    <Badge className={
                      discount.usedCount >= discount.usageLimit ? 'bg-gray-100 text-gray-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {discount.usedCount >= discount.usageLimit ? 'Used Up' : 'Available'}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount:</span>
                      <span className="font-medium">
                        {discount.type === 'percentage' ? `${discount.value}%` : `₹${discount.value}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Usage:</span>
                      <span className="font-medium">{discount.usedCount}/{discount.usageLimit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valid Until:</span>
                      <span className="font-medium">{new Date(discount.validUntil).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min Amount:</span>
                      <span className="font-medium">₹{discount.minAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  {discount.usedCount < discount.usageLimit && (
                    <Button className="w-full mt-4" variant="outline">
                      Apply to Bill
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Charity Tab */}
        {activeTab === 'charity' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {charityPrograms.map((charity) => (
              <Card key={charity.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{charity.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{charity.description}</p>
                    </div>
                    <Badge className={
                      charity.status === 'eligible' ? 'bg-green-100 text-green-800' :
                      charity.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                      charity.status === 'available' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {charity.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coverage:</span>
                      <span className="font-medium">{charity.coverage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Amount:</span>
                      <span className="font-medium">₹{charity.maxAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Eligibility:</span>
                      <span className="font-medium">{charity.eligibilityCriteria}</span>
                    </div>
                    {charity.approvedAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approved Amount:</span>
                        <span className="font-medium text-green-600">₹{charity.approvedAmount.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  {charity.status === 'eligible' && (
                    <Button className="w-full mt-4">
                      Apply for Support
                    </Button>
                  )}
                  {charity.status === 'available' && (
                    <Button className="w-full mt-4" variant="outline">
                      Check Eligibility
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingManagement;
