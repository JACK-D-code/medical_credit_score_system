import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import api from '../../../lib/api';

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  const validateIdentifier = (identifier) => {
    if (!identifier) return 'Email or Phone is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      return 'Enter a valid Email or 10-digit Phone Number';
    }
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password?.length < 8) return 'Password must be at least 8 characters';
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors?.[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    const identifierError = validateIdentifier(formData?.identifier);
    const passwordError = validatePassword(formData?.password);

    if (identifierError || passwordError) {
      setErrors({
        identifier: identifierError,
        password: passwordError
      });
      return;
    }

    setIsLoading(true);

    try {
      // Note: We use the identifier safely mapped to email in case it's a mobile.
      const isPhone = /^[6-9]\d{9}$/.test(formData.identifier);
      const emailPayload = isPhone ? `${formData.identifier}@mediscore.local` : formData.identifier;

      const response = await api.post('/auth/login', {
        email: emailPayload,
        password: formData.password,
      });

      const { accessToken, refreshToken, user } = response.data;
      // Store the access token as 'token' for the API interceptor
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/medical-credit-dashboard');
    } catch (err) {
      setLoginAttempts(prev => prev + 1);
      console.error('Login error:', err);

      let errorMessage = 'Invalid credentials. Please verify your email and password.';

      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        errorMessage = 'Cannot connect to server. Please ensure the backend server is running on http://localhost:5000';
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
        if (err.response.data.message) {
          errorMessage += '\n' + err.response.data.message;
        }
      }

      setErrors({
        submit: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/patient-registration');
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5 lg:space-y-6">
        <div>
          <Input
            label="Email Address / Phone Number"
            type="text"
            name="identifier"
            placeholder="user@example.com or 9876543210"
            value={formData?.identifier}
            onChange={handleInputChange}
            error={errors?.identifier}
            required
            disabled={isLoading}
            description="Enter your registered email or 10-digit mobile number"
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