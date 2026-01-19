import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ProfileSettingsTab = ({ userData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: userData?.fullName || '',
    email: userData?.email || '',
    mobileNumber: userData?.mobileNumber || '',
    aadhaarId: userData?.aadhaarId || '',
    dateOfBirth: userData?.dateOfBirth || '',
    gender: userData?.gender || '',
    address: userData?.address || '',
    city: userData?.city || '',
    state: userData?.state || '',
    pincode: userData?.pincode || ''
  });
  const [errors, setErrors] = useState({});

  const validateAadhaar = (value) => {
    const aadhaarPattern = /^\d{4}\s\d{4}\s\d{4}$/;
    return aadhaarPattern?.test(value);
  };

  const validateEmail = (value) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern?.test(value);
  };

  const validateMobile = (value) => {
    const mobilePattern = /^[6-9]\d{9}$/;
    return mobilePattern?.test(value);
  };

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSave = () => {
    const newErrors = {};
    
    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!validateEmail(formData?.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!validateMobile(formData?.mobileNumber)) {
      newErrors.mobileNumber = 'Invalid mobile number (10 digits starting with 6-9)';
    }
    
    if (!validateAadhaar(formData?.aadhaarId)) {
      newErrors.aadhaarId = 'Invalid Aadhaar format (XXXX XXXX XXXX)';
    }
    
    if (!formData?.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      fullName: userData?.fullName || '',
      email: userData?.email || '',
      mobileNumber: userData?.mobileNumber || '',
      aadhaarId: userData?.aadhaarId || '',
      dateOfBirth: userData?.dateOfBirth || '',
      gender: userData?.gender || '',
      address: userData?.address || '',
      city: userData?.city || '',
      state: userData?.state || '',
      pincode: userData?.pincode || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">Profile Information</h2>
          <p className="text-sm text-muted-foreground">Update your personal details and contact information</p>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            iconName="Edit"
            iconPosition="left"
            iconSize={16}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>

      <div className="space-y-6">
        <div className="border border-border rounded-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="User" size={20} color="var(--color-primary)" />
            <span>Personal Details</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              name="fullName"
              value={formData?.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              disabled={!isEditing}
              error={errors?.fullName}
              required
            />

            <Input
              label="Aadhaar Number"
              type="text"
              name="aadhaarId"
              value={formData?.aadhaarId}
              onChange={handleChange}
              placeholder="XXXX XXXX XXXX"
              disabled={!isEditing}
              error={errors?.aadhaarId}
              description="Format: XXXX XXXX XXXX"
              required
            />

            <Input
              label="Date of Birth"
              type="date"
              name="dateOfBirth"
              value={formData?.dateOfBirth}
              onChange={handleChange}
              disabled={!isEditing}
              error={errors?.dateOfBirth}
              required
            />

            <Input
              label="Gender"
              type="text"
              name="gender"
              value={formData?.gender}
              onChange={handleChange}
              placeholder="Male/Female/Other"
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="border border-border rounded-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-4 flex items-center space-x-2">
            <Icon name="Mail" size={20} color="var(--color-primary)" />
            <span>Contact Information</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData?.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              disabled={!isEditing}
              error={errors?.email}
              required
            />

            <Input
              label="Mobile Number"
              type="tel"
              name="mobileNumber"
              value={formData?.mobileNumber}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              disabled={!isEditing}
              error={errors?.mobileNumber}
              required
            />

            <div className="md:col-span-2">
              <Input
                label="Address"
                type="text"
                name="address"
                value={formData?.address}
                onChange={handleChange}
                placeholder="Street address"
                disabled={!isEditing}
              />
            </div>

            <Input
              label="City"
              type="text"
              name="city"
              value={formData?.city}
              onChange={handleChange}
              placeholder="City"
              disabled={!isEditing}
            />

            <Input
              label="State"
              type="text"
              name="state"
              value={formData?.state}
              onChange={handleChange}
              placeholder="State"
              disabled={!isEditing}
            />

            <Input
              label="Pincode"
              type="text"
              name="pincode"
              value={formData?.pincode}
              onChange={handleChange}
              placeholder="6-digit pincode"
              disabled={!isEditing}
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex items-center space-x-3 pt-4 border-t border-border">
            <Button
              variant="default"
              iconName="Save"
              iconPosition="left"
              iconSize={16}
              onClick={handleSave}
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              iconName="X"
              iconPosition="left"
              iconSize={16}
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </div>
        )}

        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-heading font-semibold text-foreground mb-1">Verification Status</h4>
              <p className="text-sm text-muted-foreground">Your Aadhaar and contact details are verified. Changes to verified information may require re-verification.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsTab;