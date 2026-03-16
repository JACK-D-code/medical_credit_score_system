import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const PersonalInfoSection = ({ userData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: userData?.fullName || '',
    aadhaarId: userData?.aadhaarId || '',
    dateOfBirth: userData?.dateOfBirth || '',
    gender: userData?.gender || ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      fullName: userData?.fullName || '',
      aadhaarId: userData?.aadhaarId || '',
      dateOfBirth: userData?.dateOfBirth || '',
      gender: userData?.gender || ''
    });
  }, [userData]);

  const validateAadhaar = (value) => {
    const aadhaarPattern = /^\d{4}\s\d{4}\s\d{4}$/;
    return aadhaarPattern?.test(value);
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
      aadhaarId: userData?.aadhaarId || '',
      dateOfBirth: userData?.dateOfBirth || '',
      gender: userData?.gender || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6 lg:p-8 transition-smooth">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-md flex items-center justify-center">
            <Icon name="User" size={24} color="var(--color-primary)" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">Personal Information</h2>
            <p className="text-sm text-muted-foreground">Manage your personal details</p>
          </div>
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
            Edit
          </Button>
        )}
      </div>
      <div className="space-y-4 md:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
      </div>
    </div>
  );
};

export default PersonalInfoSection;