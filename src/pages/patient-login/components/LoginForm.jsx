import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobileNumber: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const mockCredentials = {
    mobileNumber: '9876543210',
    password: 'MediCredit@2026'
  };

  const validateMobileNumber = (number) => {
    const cleanNumber = number?.replace(/\D/g, '');
    if (!cleanNumber) return 'Mobile number is required';
    if (cleanNumber?.length !== 10) return 'Mobile number must be 10 digits';
    if (!cleanNumber?.match(/^[6-9]\d{9}$/)) return 'Invalid Indian mobile number';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password?.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const formatMobileNumber = (value) => {
    const cleaned = value?.replace(/\D/g, '');
    if (cleaned?.length <= 10) {
      return cleaned;
    }
    return cleaned?.slice(0, 10);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    
    if (name === 'mobileNumber') {
      const formatted = formatMobileNumber(value);
      setFormData(prev => ({ ...prev, [name]: formatted }));
      if (errors?.[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
      if (errors?.[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    const mobileError = validateMobileNumber(formData?.mobileNumber);
    const passwordError = validatePassword(formData?.password);

    if (mobileError || passwordError) {
      setErrors({
        mobileNumber: mobileError,
        password: passwordError
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (
        formData?.mobileNumber === mockCredentials?.mobileNumber &&
        formData?.password === mockCredentials?.password
      ) {
        navigate('/medical-credit-dashboard');
      } else {
        setLoginAttempts(prev => prev + 1);
        setErrors({
          submit: `Invalid credentials. Please use:\nMobile: ${mockCredentials?.mobileNumber}\nPassword: ${mockCredentials?.password}`
        });
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleForgotPassword = () => {
    navigate('/patient-registration');
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 lg:space-y-6">
        <div>
          <Input
            label="Mobile Number"
            type="tel"
            name="mobileNumber"
            placeholder="Enter 10-digit mobile number"
            value={formData?.mobileNumber}
            onChange={handleInputChange}
            error={errors?.mobileNumber}
            required
            disabled={isLoading}
            description="Enter your registered mobile number without +91"
          />
        </div>

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Enter your password"
            value={formData?.password}
            onChange={handleInputChange}
            error={errors?.password}
            required
            disabled={isLoading}
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

        <div className="flex items-center justify-between flex-wrap gap-3">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData?.rememberMe}
              onChange={handleInputChange}
              disabled={isLoading}
              className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
            />
            <span className="text-sm font-caption text-foreground">Remember me</span>
          </label>

          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm font-caption text-primary hover:text-primary/80 transition-smooth"
            disabled={isLoading}
          >
            Forgot Password?
          </button>
        </div>

        {errors?.submit && (
          <div className="bg-error/10 border border-error/20 rounded-md p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertCircle" size={20} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-error mb-1">Login Failed</p>
                <p className="text-sm text-error/80 whitespace-pre-line">{errors?.submit}</p>
              </div>
            </div>
          </div>
        )}

        {loginAttempts >= 3 && (
          <div className="bg-warning/10 border border-warning/20 rounded-md p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
              <p className="text-sm text-warning-foreground">
                Multiple failed attempts detected. Please verify your credentials or contact support.
              </p>
            </div>
          </div>
        )}

        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          iconName="LogIn"
          iconPosition="right"
          iconSize={20}
          className="mt-6"
        >
          {isLoading ? 'Logging in...' : 'Login to Dashboard'}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;