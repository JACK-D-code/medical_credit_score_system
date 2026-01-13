import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const BillEntryForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    providerName: '',
    providerType: '',
    serviceType: '',
    serviceDate: '',
    billNumber: '',
    totalAmount: '',
    insuranceCovered: '',
    description: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});
  const [isDuplicateCheck, setIsDuplicateCheck] = useState(false);

  const providerTypes = [
    { value: 'hospital', label: 'Hospital' },
    { value: 'clinic', label: 'Clinic' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'laboratory', label: 'Laboratory' },
    { value: 'specialist', label: 'Specialist' }
  ];

  const serviceTypes = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'diagnostic', label: 'Diagnostic Tests' },
    { value: 'medication', label: 'Medication' },
    { value: 'therapy', label: 'Therapy' },
    { value: 'emergency', label: 'Emergency Care' },
    { value: 'other', label: 'Other' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.providerName?.trim()) {
      newErrors.providerName = 'Provider name is required';
    }

    if (!formData?.providerType) {
      newErrors.providerType = 'Provider type is required';
    }

    if (!formData?.serviceType) {
      newErrors.serviceType = 'Service type is required';
    }

    if (!formData?.serviceDate) {
      newErrors.serviceDate = 'Service date is required';
    } else {
      const serviceDate = new Date(formData.serviceDate);
      const today = new Date();
      if (serviceDate > today) {
        newErrors.serviceDate = 'Service date cannot be in the future';
      }
    }

    if (!formData?.billNumber?.trim()) {
      newErrors.billNumber = 'Bill number is required';
    }

    if (!formData?.totalAmount || parseFloat(formData?.totalAmount) <= 0) {
      newErrors.totalAmount = 'Valid total amount is required';
    }

    if (formData?.insuranceCovered && parseFloat(formData?.insuranceCovered) > parseFloat(formData?.totalAmount)) {
      newErrors.insuranceCovered = 'Insurance covered cannot exceed total amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const checkDuplicate = () => {
    setIsDuplicateCheck(true);
    setTimeout(() => {
      setIsDuplicateCheck(false);
    }, 1000);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    
    if (validateForm()) {
      checkDuplicate();
      
      const patientResponsibility = parseFloat(formData?.totalAmount) - (parseFloat(formData?.insuranceCovered) || 0);
      
      const billData = {
        ...formData,
        totalAmount: parseFloat(formData?.totalAmount),
        insuranceCovered: parseFloat(formData?.insuranceCovered) || 0,
        patientResponsibility,
        status: 'pending',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)?.toISOString(),
        createdAt: new Date()?.toISOString()
      };

      onSubmit(billData);
    }
  };

  const calculatePatientResponsibility = () => {
    const total = parseFloat(formData?.totalAmount) || 0;
    const insurance = parseFloat(formData?.insuranceCovered) || 0;
    return total - insurance;
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-elevation-2 p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="Plus" size={24} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground">Add New Bill</h2>
          <p className="text-sm text-muted-foreground caption">Enter medical bill details</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Provider Name"
            type="text"
            placeholder="Enter hospital/clinic name"
            value={formData?.providerName}
            onChange={(e) => handleChange('providerName', e?.target?.value)}
            error={errors?.providerName}
            required
          />

          <Select
            label="Provider Type"
            placeholder="Select provider type"
            options={providerTypes}
            value={formData?.providerType}
            onChange={(value) => handleChange('providerType', value)}
            error={errors?.providerType}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Service Type"
            placeholder="Select service type"
            options={serviceTypes}
            value={formData?.serviceType}
            onChange={(value) => handleChange('serviceType', value)}
            error={errors?.serviceType}
            required
          />

          <Input
            label="Service Date"
            type="date"
            value={formData?.serviceDate}
            onChange={(e) => handleChange('serviceDate', e?.target?.value)}
            error={errors?.serviceDate}
            required
          />
        </div>

        <Input
          label="Bill Number"
          type="text"
          placeholder="Enter bill/invoice number"
          value={formData?.billNumber}
          onChange={(e) => handleChange('billNumber', e?.target?.value)}
          error={errors?.billNumber}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Total Amount"
            type="number"
            placeholder="0.00"
            value={formData?.totalAmount}
            onChange={(e) => handleChange('totalAmount', e?.target?.value)}
            error={errors?.totalAmount}
            required
          />

          <Input
            label="Insurance Covered"
            type="number"
            placeholder="0.00"
            value={formData?.insuranceCovered}
            onChange={(e) => handleChange('insuranceCovered', e?.target?.value)}
            error={errors?.insuranceCovered}
          />
        </div>

        {formData?.totalAmount && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Patient Responsibility</span>
              <span className="text-xl md:text-2xl font-semibold text-primary data-text">
                ${calculatePatientResponsibility()?.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <Input
          label="Description"
          type="text"
          placeholder="Brief description of services"
          value={formData?.description}
          onChange={(e) => handleChange('description', e?.target?.value)}
        />

        <Input
          label="Additional Notes"
          type="text"
          placeholder="Any additional information"
          value={formData?.notes}
          onChange={(e) => handleChange('notes', e?.target?.value)}
        />

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            variant="default"
            iconName="Save"
            iconPosition="left"
            loading={isDuplicateCheck}
            fullWidth
            className="sm:flex-1"
          >
            {isDuplicateCheck ? 'Checking for duplicates...' : 'Add Bill'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            fullWidth
            className="sm:flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BillEntryForm;