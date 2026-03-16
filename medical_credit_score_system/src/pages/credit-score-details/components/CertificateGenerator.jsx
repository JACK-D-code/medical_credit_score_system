import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CertificateGenerator = ({ patientName, patientId, creditScore, validUntil }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateCertificate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      console.log('Certificate generated');
    }, 2000);
  };

  const handleShareCertificate = () => {
    console.log('Share certificate');
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="FileText" size={28} color="var(--color-primary)" />
        <h3 className="font-heading font-semibold text-lg md:text-xl text-foreground">Credit Score Certificate</h3>
      </div>

      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg p-6 md:p-8 mb-6 border-2 border-primary/20">
        <div className="text-center mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Award" size={40} color="var(--color-primary)" />
          </div>
          <h4 className="font-heading font-bold text-xl md:text-2xl text-foreground mb-2">Medical Credit Certificate</h4>
          <p className="text-sm md:text-base text-muted-foreground">Official Credit Score Document</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-sm md:text-base text-muted-foreground">Patient Name</span>
            <span className="text-sm md:text-base font-medium text-foreground">{patientName}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-sm md:text-base text-muted-foreground">Patient ID</span>
            <span className="text-sm md:text-base font-mono font-medium text-foreground">{patientId}</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-sm md:text-base text-muted-foreground">Credit Score</span>
            <span className="text-xl md:text-2xl font-mono font-bold text-primary">{creditScore}</span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm md:text-base text-muted-foreground">Valid Until</span>
            <span className="text-sm md:text-base font-medium text-foreground">{validUntil}</span>
          </div>
        </div>

        <div className="bg-warning/10 rounded-md p-4 flex items-start space-x-3">
          <Icon name="Info" size={20} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
          <p className="text-xs md:text-sm text-foreground leading-relaxed">
            This certificate is valid for 90 days from the date of issue. It can be used for medical loan applications and cashless treatment approvals at network hospitals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button
          variant="default"
          iconName="Download"
          iconPosition="left"
          loading={isGenerating}
          onClick={handleGenerateCertificate}
          fullWidth
        >
          Download Certificate
        </Button>
        <Button
          variant="outline"
          iconName="Share2"
          iconPosition="left"
          onClick={handleShareCertificate}
          fullWidth
        >
          Share Certificate
        </Button>
      </div>
    </div>
  );
};

export default CertificateGenerator;