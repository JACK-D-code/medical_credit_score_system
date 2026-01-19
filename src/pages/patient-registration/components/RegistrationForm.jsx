import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const RegistrationForm = ({ onSubmit, onLoginRedirect, isLoading }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    aadhaarId: '',
    mobileNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [showAddressFields, setShowAddressFields] = useState(false);

  const validateAadhaar = (value) => {
    const aadhaarPattern = /^\d{4}\s?\d{4}\s?\d{4}$/;
    return aadhaarPattern?.test(value);
  };

  const validateMobile = (value) => {
    const mobilePattern = /^[6-9]\d{9}$/;
    return mobilePattern?.test(value);
  };

  const validatePincode = (value) => {
    const pincodePattern = /^\d{6}$/;
    return pincodePattern?.test(value);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (name === 'fullName' && value && formData?.aadhaarId && formData?.mobileNumber) {
      setShowAddressFields(true);
    }
  };

  const handleAadhaarChange = (e) => {
    let value = e?.target?.value?.replace(/\s/g, '');
    if (value?.length <= 12 && /^\d*$/?.test(value)) {
      if (value?.length > 4 && value?.length <= 8) {
        value = value?.slice(0, 4) + ' ' + value?.slice(4);
      } else if (value?.length > 8) {
        value = value?.slice(0, 4) + ' ' + value?.slice(4, 8) + ' ' + value?.slice(8);
      }
      setFormData(prev => ({ ...prev, aadhaarId: value }));
      if (errors?.aadhaarId) {
        setErrors(prev => ({ ...prev, aadhaarId: '' }));
      }
    }
  };

  const handleMobileChange = (e) => {
    let value = e?.target?.value?.replace(/\D/g, '');
    if (value?.length <= 10) {
      setFormData(prev => ({ ...prev, mobileNumber: value }));
      if (errors?.mobileNumber) {
        setErrors(prev => ({ ...prev, mobileNumber: '' }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData?.fullName?.trim()?.length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    if (!formData?.aadhaarId) {
      newErrors.aadhaarId = 'Aadhaar ID is required';
    } else if (!validateAadhaar(formData?.aadhaarId)) {
      newErrors.aadhaarId = 'Invalid Aadhaar format (e.g., 1234 5678 9012)';
    }

    if (!formData?.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!validateMobile(formData?.mobileNumber)) {
      newErrors.mobileNumber = 'Invalid mobile number (must start with 6-9)';
    }

    if (!formData?.addressLine1?.trim()) {
      newErrors.addressLine1 = 'Address line 1 is required';
    }

    if (!formData?.city?.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData?.state?.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData?.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!validatePincode(formData?.pincode)) {
      newErrors.pincode = 'Invalid pincode (6 digits required)';
    }

    if (!formData?.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
          Create Your Account
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Register to access medical credit assessment and healthcare financing
        </p>
      </div>
      <div className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          placeholder="Enter your full name as per Aadhaar"
          value={formData?.fullName}
          onChange={handleInputChange}
          error={errors?.fullName}
          required
        />

        <Input
          label="Aadhaar ID"
          type="text"
          name="aadhaarId"
          placeholder="1234 5678 9012"
          value={formData?.aadhaarId}
          onChange={handleAadhaarChange}
          error={errors?.aadhaarId}
          description="12-digit Aadhaar number for identity verification"
          required
        />

        <div>
          <Input
            label="Mobile Number"
            type="tel"
            name="mobileNumber"
            placeholder="9876543210"
            value={formData?.mobileNumber}
            onChange={handleMobileChange}
            error={errors?.mobileNumber}
            description="10-digit mobile number starting with 6-9"
            required
          />
          {formData?.mobileNumber && (
            <p className="mt-2 text-xs md:text-sm text-muted-foreground flex items-center space-x-2">
              <Icon name="Phone" size={14} color="var(--color-primary)" />
              <span>+91 {formData?.mobileNumber}</span>
            </p>
          )}
        </div>
      </div>
      {showAddressFields && (
        <div className="space-y-4 pt-4 border-t border-border spring-bounce">
          <h3 className="text-base md:text-lg font-heading font-medium text-foreground flex items-center space-x-2">
            <Icon name="MapPin" size={20} color="var(--color-primary)" />
            <span>Address Details</span>
          </h3>

          <Input
            label="Address Line 1"
            type="text"
            name="addressLine1"
            placeholder="House/Flat No., Building Name"
            value={formData?.addressLine1}
            onChange={handleInputChange}
            error={errors?.addressLine1}
            required
          />

          <Input
            label="Address Line 2"
            type="text"
            name="addressLine2"
            placeholder="Street, Area, Locality (Optional)"
            value={formData?.addressLine2}
            onChange={handleInputChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City"
              type="text"
              name="city"
              placeholder="Enter city"
              value={formData?.city}
              onChange={handleInputChange}
              error={errors?.city}
              required
            />

            <Input
              label="State"
              type="text"
              name="state"
              placeholder="Enter state"
              value={formData?.state}
              onChange={handleInputChange}
              error={errors?.state}
              required
            />
          </div>

          <Input
            label="Pincode"
            type="text"
            name="pincode"
            placeholder="400001"
            value={formData?.pincode}
            onChange={handleInputChange}
            error={errors?.pincode}
            maxLength={6}
            required
          />
        </div>
      )}
      <div className="pt-4">
        <Checkbox
          label="I agree to the Terms and Conditions and Privacy Policy"
          checked={formData?.agreeTerms}
          onChange={(e) => handleInputChange({
            target: { name: 'agreeTerms', type: 'checkbox', checked: e?.target?.checked }
          })}
          error={errors?.agreeTerms}
          required
        />
      </div>
      <div className="space-y-3 pt-4">
        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          iconName="UserPlus"
          iconPosition="left"
        >
          Create Account
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onLoginRedirect}
            className="text-sm md:text-base text-primary hover:text-primary/80 transition-smooth font-medium"
          >
            Already have an account? Login Instead
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm;