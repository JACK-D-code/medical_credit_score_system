import React, { useState, useEffect, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const OTPVerification = ({ mobileNumber, onVerify, onResend, onBack, isLoading }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  useEffect(() => {
    if (inputRefs?.current?.[0]) {
      inputRefs?.current?.[0]?.focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/?.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value?.slice(-1);
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs?.current?.[index + 1]?.focus();
    }

    if (newOtp?.every(digit => digit !== '') && newOtp?.join('')?.length === 6) {
      setTimeout(() => {
        handleVerify(newOtp?.join(''));
      }, 100);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e?.key === 'Backspace' && !otp?.[index] && index > 0) {
      inputRefs?.current?.[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e?.preventDefault();
    const pastedData = e?.clipboardData?.getData('text')?.slice(0, 6);
    if (!/^\d+$/?.test(pastedData)) return;

    const newOtp = pastedData?.split('');
    while (newOtp?.length < 6) newOtp?.push('');
    setOtp(newOtp);
    setError('');

    if (pastedData?.length === 6) {
      inputRefs?.current?.[5]?.focus();
      setTimeout(() => {
        handleVerify(pastedData);
      }, 100);
    }
  };

  const handleVerify = (otpValue) => {
    const otpString = otpValue || otp?.join('');
    if (otpString?.length !== 6) {
      setError('Please enter complete 6-digit OTP');
      return;
    }
    onVerify(otpString);
  };

  const handleResend = () => {
    setOtp(['', '', '', '', '', '']);
    setTimer(30);
    setCanResend(false);
    setError('');
    onResend();
    inputRefs?.current?.[0]?.focus();
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full mb-4">
          <Icon name="Smartphone" size={32} color="var(--color-primary)" />
        </div>
        <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
          Verify Mobile Number
        </h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Enter the 6-digit OTP sent to
        </p>
        <p className="text-base md:text-lg font-medium text-foreground">
          +91 {mobileNumber}
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex justify-center space-x-2 md:space-x-3">
          {otp?.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e?.target?.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`
                w-10 h-12 md:w-12 md:h-14 text-center text-lg md:text-xl font-mono font-semibold
                rounded-md border-2 transition-smooth
                ${error
                  ? 'border-error bg-error/5 text-error'
                  : digit
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border bg-background text-foreground'
                }
                focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
              `}
            />
          ))}
        </div>

        {error && (
          <div className="flex items-center justify-center space-x-2 text-error text-sm">
            <Icon name="AlertCircle" size={16} color="currentColor" />
            <span>{error}</span>
          </div>
        )}

        <div className="text-center space-y-2">
          {!canResend ? (
            <p className="text-sm text-muted-foreground">
              Resend OTP in <span className="font-mono font-semibold text-primary">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-sm md:text-base text-primary hover:text-primary/80 transition-smooth font-medium"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm text-muted-foreground">
            For testing purposes, use OTP: <span className="font-mono font-semibold text-foreground">123456</span>
          </p>
        </div>
      </div>
      <div className="space-y-3">
        <Button
          variant="default"
          size="lg"
          fullWidth
          onClick={() => handleVerify()}
          loading={isLoading}
          disabled={otp?.some(digit => digit === '')}
          iconName="CheckCircle"
          iconPosition="left"
        >
          Verify OTP
        </Button>

        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={onBack}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Back to Registration
        </Button>
      </div>
      <div className="text-center">
        <p className="text-xs md:text-sm text-muted-foreground">
          Didn't receive the OTP? Check your SMS inbox or try resending
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;