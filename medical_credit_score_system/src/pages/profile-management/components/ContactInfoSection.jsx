import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const ContactInfoSection = ({ contactData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    mobileNumber: contactData?.mobileNumber || '',
    email: contactData?.email || '',
    address: contactData?.address || '',
    city: contactData?.city || '',
    state: contactData?.state || '',
    pincode: contactData?.pincode || ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData({
      mobileNumber: contactData?.mobileNumber || '',
      email: contactData?.email || '',
      address: contactData?.address || '',
      city: contactData?.city || '',
      state: contactData?.state || '',
      pincode: contactData?.pincode || ''
    });
  }, [contactData]);

  const validateMobile = (value) => {
    const mobilePattern = /^[6-9]\d{9}$/;
    return mobilePattern?.test(value);
  };

  const validatePincode = (value) => {
    const pincodePattern = /^\d{6}$/;
    return pincodePattern?.test(value);
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

    if (!validateMobile(formData?.mobileNumber)) {
      newErrors.mobileNumber = 'Invalid mobile number (10 digits starting with 6-9)';
    }

    if (!formData?.email?.includes('@')) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData?.address?.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!validatePincode(formData?.pincode)) {
      newErrors.pincode = 'Invalid pincode (6 digits)';
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
      mobileNumber: contactData?.mobileNumber || '',
      email: contactData?.email || '',
      address: contactData?.address || '',
      city: contactData?.city || '',
      state: contactData?.state || '',
      pincode: contactData?.pincode || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6 lg:p-8 transition-smooth">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary/10 rounded-md flex items-center justify-center">
            <Icon name="Phone" size={24} color="var(--color-secondary)" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">Contact Information</h2>
            <p className="text-sm text-muted-foreground">Update your contact details</p>
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
            label="Mobile Number"
            type="tel"
            name="mobileNumber"
            value={formData?.mobileNumber}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            disabled={!isEditing}
            error={errors?.mobileNumber}
            description="Format: 10 digits starting with 6-9"
            required
          />

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
        </div>

        <Input
          label="Address"
          type="text"
          name="address"
          value={formData?.address}
          onChange={handleChange}
          placeholder="House/Flat No., Street, Area"
          disabled={!isEditing}
          error={errors?.address}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Input
            label="City"
            type="text"
            name="city"
            value={formData?.city}
            onChange={handleChange}
            placeholder="City"
            disabled={!isEditing}
            required
          />

          <Input
            label="State"
            type="text"
            name="state"
            value={formData?.state}
            onChange={handleChange}
            placeholder="State"
            disabled={!isEditing}
            required
          />

          <Input
            label="Pincode"
            type="text"
            name="pincode"
            value={formData?.pincode}
            onChange={handleChange}
            placeholder="6-digit pincode"
            disabled={!isEditing}
            error={errors?.pincode}
            required
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

export default ContactInfoSection;