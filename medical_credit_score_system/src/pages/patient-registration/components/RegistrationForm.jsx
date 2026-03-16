import React, { useState } from 'react';
import { authService } from '../../../lib/api';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const RegistrationForm = ({ onSubmit, onLoginRedirect, isLoading }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP Configuration
  const OTP_REQUIRED = false; // TODO: Set back to true after project completion

  // OTP States
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(!OTP_REQUIRED);
  const [otpValue, setOtpValue] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpFeedback, setOtpFeedback] = useState({ type: '', message: '' });

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(value);
  };

  const validateMobile = (value) => {
    const mobilePattern = /^[6-9]\d{9}$/;
    return mobilePattern?.test(value);
  };

  const validatePassword = (value) => {
    // Basic password validation: at least 8 characters
    return value && value.length >= 8;
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
  };

  const handleMobileChange = (e) => {
    let value = e?.target?.value?.replace(/\D/g, '');
    if (value?.length <= 10) {
      setFormData(prev => ({ ...prev, mobileNumber: value }));
      if (errors?.mobileNumber) {
        setErrors(prev => ({ ...prev, mobileNumber: '' }));
      }
      // Reset OTP states if mobile number changes
      if (OTP_REQUIRED && (otpSent || otpVerified)) {
        setOtpSent(false);
        setOtpVerified(false);
        setOtpValue('');
        setOtpFeedback({ type: '', message: '' });
      }
    }
  };

  const handleSendOtp = async () => {
    if (!formData.mobileNumber || formData.mobileNumber.length < 10) {
      setErrors(prev => ({ ...prev, mobileNumber: 'Valid 10-digit mobile number required to send OTP' }));
      return;
    }

    setIsSendingOtp(true);
    setOtpFeedback({ type: '', message: '' });
    try {
      await authService.sendOtp(formData.mobileNumber);
      setOtpSent(true);
      setOtpFeedback({ type: 'success', message: 'OTP sent successfully!' });
    } catch (error) {
      console.error("Error sending OTP:", error);
      setOtpFeedback({ type: 'error', message: error.response?.data?.error || 'Failed to send OTP.' });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpValue || otpValue.length < 6) {
      setOtpFeedback({ type: 'error', message: 'Please enter a valid 6-digit OTP.' });
      return;
    }

    setIsVerifyingOtp(true);
    setOtpFeedback({ type: '', message: '' });
    try {
      const response = await authService.verifyOtp(formData.mobileNumber, otpValue);
      setOtpVerified(true);
      setOtpFeedback({ type: 'success', message: 'Mobile number verified successfully!' });
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpFeedback({ type: 'error', message: error.response?.data?.error || 'Invalid OTP code.' });
      setOtpVerified(false);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData?.fullName?.trim()?.length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters';
    }

    if (!formData?.email) {
      newErrors.email = 'Email Address is required';
    } else if (!validateEmail(formData?.email)) {
      newErrors.email = 'Invalid email address format';
    }

    if (!formData?.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!validateMobile(formData?.mobileNumber)) {
      newErrors.mobileNumber = 'Invalid mobile number (must start with 6-9)';
    }

    if (!formData?.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData?.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData?.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to terms and conditions';
    }

    if (OTP_REQUIRED && !otpVerified) {
      newErrors.mobileNumber = 'Please verify your mobile number first';
      setOtpFeedback({ type: 'error', message: 'Please verify your mobile number before submitting' });
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
          placeholder="Enter your full name"
          value={formData?.fullName}
          onChange={handleInputChange}
          error={errors?.fullName}
          required
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          placeholder="user@example.com"
          value={formData?.email}
          onChange={handleInputChange}
          error={errors?.email}
          description="We will send your verification code here"
          required
        />

        <div>
          <div className="flex items-start gap-2">
            <div className="flex-1">
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
                disabled={OTP_REQUIRED ? otpVerified : false}
              />
            </div>
            {OTP_REQUIRED && !otpVerified && (
              <div className="mt-[28px]">
                <Button
                  type="button"
                  variant={otpSent ? "outline" : "secondary"}
                  onClick={handleSendOtp}
                  loading={isSendingOtp}
                  disabled={formData.mobileNumber.length < 10}
                >
                  {otpSent ? 'Resend OTP' : 'Send OTP'}
                </Button>
              </div>
            )}
          </div>

          {otpSent && !otpVerified && (
            <div className="mt-3 p-4 bg-muted/30 rounded-lg border border-border animate-in fade-in slide-in-from-top-2">
              <label className="block text-sm font-medium text-foreground mb-1.5">Enter 6-digit OTP</label>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    type="text"
                    name="otpValue"
                    placeholder="000000"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                  />
                </div>
                <Button
                  type="button"
                  variant="default"
                  onClick={handleVerifyOtp}
                  loading={isVerifyingOtp}
                  disabled={otpValue.length < 6}
                >
                  Verify
                </Button>
              </div>
            </div>
          )}

          {OTP_REQUIRED && otpFeedback.message && (
            <p className={`mt-2 text-sm flex items-center gap-1.5 ${otpFeedback.type === 'error' ? 'text-destructive' : 'text-success'}`}>
              <Icon name={otpFeedback.type === 'error' ? 'AlertCircle' : 'CheckCircle2'} size={16} />
              {otpFeedback.message}
            </p>
          )}

          {formData?.mobileNumber && !otpFeedback.message && (
            <p className="mt-2 text-xs md:text-sm text-muted-foreground flex items-center space-x-2">
              <Icon name="Phone" size={14} color="var(--color-primary)" />
              <span>+91 {formData?.mobileNumber}</span>
            </p>
          )}
        </div>

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Create a strong password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            description="Minimum 8 characters"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            placeholder="Retype your password"
            value={formData?.confirmPassword}
            onChange={handleInputChange}
            error={errors?.confirmPassword}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-smooth"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={20} />
          </button>
        </div>
      </div>
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
          disabled={!otpVerified}
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