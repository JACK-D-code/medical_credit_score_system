import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PatientTable = ({ patients, onSort, sortConfig }) => {
  const navigate = useNavigate();
  const [selectedPatients, setSelectedPatients] = useState([]);

  const handleSort = (key) => {
    onSort(key);
  };

  const handleSelectAll = (e) => {
    if (e?.target?.checked) {
      setSelectedPatients(patients?.map(p => p?.id));
    } else {
      setSelectedPatients([]);
    }
  };

  const handleSelectPatient = (patientId) => {
    setSelectedPatients(prev => 
      prev?.includes(patientId) 
        ? prev?.filter(id => id !== patientId)
        : [...prev, patientId]
    );
  };

  const getScoreColor = (score) => {
    if (score >= 750) return 'text-success';
    if (score >= 650) return 'text-primary';
    if (score >= 550) return 'text-warning';
    return 'text-error';
  };

  const getScoreBg = (score) => {
    if (score >= 750) return 'bg-success/10';
    if (score >= 650) return 'bg-primary/10';
    if (score >= 550) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const getStatusBadge = (status) => {
    const styles = {
      current: 'bg-success/10 text-success',
      overdue: 'bg-error/10 text-error',
      paid: 'bg-muted text-muted-foreground'
    };
    return styles?.[status] || styles?.current;
  };

  const getReliabilityIcon = (reliability) => {
    if (reliability === 'high') return { name: 'CheckCircle2', color: 'text-success' };
    if (reliability === 'medium') return { name: 'AlertCircle', color: 'text-warning' };
    return { name: 'XCircle', color: 'text-error' };
  };

  return (
    <div className="bg-card rounded-xl shadow-elevation-1 border border-border overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedPatients?.length === patients?.length}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-border"
                />
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('patientId')}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  Patient ID
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  Patient Name
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('creditScore')}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  Credit Score
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <button
                  onClick={() => handleSort('outstandingBalance')}
                  className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-primary transition-colors"
                >
                  Outstanding Balance
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-foreground">Payment Status</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-foreground">Reliability</span>
              </th>
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-foreground">Last Visit</span>
              </th>
              <th className="px-6 py-4 text-right">
                <span className="text-sm font-semibold text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {patients?.map((patient) => {
              const reliabilityIcon = getReliabilityIcon(patient?.reliability);
              return (
                <tr key={patient?.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedPatients?.includes(patient?.id)}
                      onChange={() => handleSelectPatient(patient?.id)}
                      className="w-4 h-4 rounded border-border"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-foreground data-text">{patient?.patientId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {patient?.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{patient?.name}</p>
                        <p className="text-xs text-muted-foreground caption">{patient?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${getScoreBg(patient?.creditScore)}`}>
                      <span className={`text-sm font-semibold data-text ${getScoreColor(patient?.creditScore)}`}>
                        {patient?.creditScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-foreground data-text">${patient?.outstandingBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium caption ${getStatusBadge(patient?.paymentStatus)}`}>
                      {patient?.paymentStatus?.charAt(0)?.toUpperCase() + patient?.paymentStatus?.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Icon name={reliabilityIcon?.name} size={18} className={reliabilityIcon?.color} />
                      <span className="text-sm text-foreground capitalize">{patient?.reliability}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">{patient?.lastVisit}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Eye"
                        onClick={() => navigate('/patient-dashboard')}
                      >
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="FileText"
                        onClick={() => navigate('/bill-management')}
                      >
                        Bills
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-border">
        {patients?.map((patient) => {
          const reliabilityIcon = getReliabilityIcon(patient?.reliability);
          return (
            <div key={patient?.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedPatients?.includes(patient?.id)}
                    onChange={() => handleSelectPatient(patient?.id)}
                    className="w-4 h-4 rounded border-border mt-1"
                  />
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                    {patient?.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{patient?.name}</p>
                    <p className="text-xs text-muted-foreground caption">{patient?.patientId}</p>
                  </div>
                </div>
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${getScoreBg(patient?.creditScore)}`}>
                  <span className={`text-sm font-semibold data-text ${getScoreColor(patient?.creditScore)}`}>
                    {patient?.creditScore}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <p className="text-xs text-muted-foreground caption mb-1">Outstanding Balance</p>
                  <p className="text-sm font-semibold text-foreground data-text">${patient?.outstandingBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground caption mb-1">Last Visit</p>
                  <p className="text-sm text-foreground">{patient?.lastVisit}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium caption ${getStatusBadge(patient?.paymentStatus)}`}>
                  {patient?.paymentStatus?.charAt(0)?.toUpperCase() + patient?.paymentStatus?.slice(1)}
                </span>
                <div className="flex items-center gap-2">
                  <Icon name={reliabilityIcon?.name} size={16} className={reliabilityIcon?.color} />
                  <span className="text-xs text-foreground capitalize">{patient?.reliability}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Eye"
                  iconPosition="left"
                  onClick={() => navigate('/patient-dashboard')}
                  fullWidth
                >
                  View Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="FileText"
                  iconPosition="left"
                  onClick={() => navigate('/bill-management')}
                  fullWidth
                >
                  View Bills
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PatientTable;