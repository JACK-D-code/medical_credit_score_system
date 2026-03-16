import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      icon: 'Shield',
      title: 'RBI Compliant',
      description: 'Follows Reserve Bank of India financial standards',
      color: 'var(--color-success)'
    },
    {
      icon: 'Lock',
      title: 'Secure & Encrypted',
      description: '256-bit SSL encryption for data protection',
      color: 'var(--color-primary)'
    },
    {
      icon: 'Award',
      title: 'Healthcare Certified',
      description: 'Approved by Indian healthcare authorities',
      color: 'var(--color-accent)'
    },
    {
      icon: 'Users',
      title: '50,000+ Patients',
      description: 'Trusted by patients across India',
      color: 'var(--color-secondary)'
    }
  ];

  const securityFeatures = [
    'Aadhaar-based identity verification',
    'OTP authentication for mobile numbers',
    'Encrypted data storage and transmission',
    'HIPAA-compliant medical data handling',
    'Regular security audits and compliance checks'
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="bg-primary/5 rounded-lg border border-primary/20 p-4 md:p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="ShieldCheck" size={24} color="var(--color-primary)" />
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
            Security Features
          </h3>
        </div>

        <ul className="space-y-2 md:space-y-3">
          {securityFeatures?.map((feature, index) => (
            <li key={index} className="flex items-start space-x-2">
              <Icon
                name="CheckCircle2"
                size={16}
                color="var(--color-success)"
                className="flex-shrink-0 mt-1"
              />
              <span className="text-xs md:text-sm text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-card rounded-lg shadow-elevation-1 p-4 md:p-6">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm md:text-base font-medium text-foreground mb-2">
              What happens after registration?
            </h4>
            <ol className="space-y-2 text-xs md:text-sm text-muted-foreground">
              <li className="flex items-start space-x-2">
                <span className="font-mono font-semibold text-primary">1.</span>
                <span>Mobile OTP verification for security</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-mono font-semibold text-primary">2.</span>
                <span>Aadhaar validation through secure gateway</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-mono font-semibold text-primary">3.</span>
                <span>Access to your medical credit dashboard</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="font-mono font-semibold text-primary">4.</span>
                <span>Start building your healthcare credit score</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-xs md:text-sm text-muted-foreground">
          Need help? Contact our support team
        </p>
        <div className="flex items-center justify-center space-x-4 text-xs md:text-sm">
          <a
            href="tel:+919489330190"
            className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-smooth"
          >
            <Icon name="Phone" size={16} color="currentColor" />
            <span>9489330190</span>
          </a>
          <span className="text-muted-foreground">|</span>
          <a
            href="mailto:stevesjc66@gmail.com"
            className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-smooth"
          >
            <Icon name="Mail" size={16} color="currentColor" />
            <span>stevesjc66@gmail.com</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;