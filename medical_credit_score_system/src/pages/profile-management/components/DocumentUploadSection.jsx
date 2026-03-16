import React, { useState, useRef } from 'react';
import api from '../../../lib/api';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentUploadSection = ({ documents, onUpload }) => {
  const [uploadedDocs, setUploadedDocs] = useState(documents || []);

  const documentTypes = [
    {
      id: 'aadhaar',
      name: 'Aadhaar Card',
      icon: 'FileText',
      description: 'Upload front and back of Aadhaar card',
      formats: 'PDF, JPG, PNG (Max 5MB)',
      required: true
    },
    {
      id: 'pan',
      name: 'PAN Card',
      icon: 'CreditCard',
      description: 'Upload PAN card for verification',
      formats: 'PDF, JPG, PNG (Max 5MB)',
      required: false
    },
    {
      id: 'medical',
      name: 'Medical Records',
      icon: 'FileHeart',
      description: 'Upload relevant medical documents',
      formats: 'PDF, JPG, PNG (Max 10MB)',
      required: false
    }
  ];

  const fileInputRef = useRef(null);
  const [activeDocType, setActiveDocType] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const triggerFileInput = (docType) => {
    setActiveDocType(docType);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !activeDocType) return;

    setIsUploading(true);
    try {
      // In a real app we would use FormData to upload the file to S3/Cloudinary.
      // For this demo, we mock the binary upload and just send the filename to the backend
      // to trigger the credit score verification sequence.
      const response = await api.post('/profile/documents', {
        type: activeDocType.id,
        name: file.name
      });

      const newDoc = {
        id: response.data.document.id,
        type: response.data.document.type,
        name: response.data.document.name,
        uploadDate: response.data.document.uploadedAt || new Date().toISOString(),
        status: response.data.document.status
      };

      const updated = [...uploadedDocs, newDoc];
      setUploadedDocs(updated);
      onUpload(updated);

      // Clear input
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
      setActiveDocType(null);
    }
  };

  const handleRemove = (docId) => {
    const updated = uploadedDocs?.filter(doc => doc?.id !== docId);
    setUploadedDocs(updated);
    onUpload(updated);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'text-success';
      case 'pending':
        return 'text-warning';
      case 'rejected':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'rejected':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-elevation-2 p-4 md:p-6 lg:p-8 transition-smooth">
      <div className="flex items-center space-x-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-success/10 rounded-md flex items-center justify-center">
          <Icon name="Upload" size={24} color="var(--color-success)" />
        </div>
        <div>
          <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">Document Verification</h2>
          <p className="text-sm text-muted-foreground">Upload documents to enhance your profile</p>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".pdf,.jpg,.jpeg,.png"
      />
      <div className="space-y-4 md:space-y-6">
        {documentTypes?.map((docType) => {
          const uploadedDoc = uploadedDocs?.find(doc => doc?.type === docType?.id);

          return (
            <div key={docType?.id} className="border border-border rounded-lg p-4 md:p-6 transition-smooth hover:shadow-elevation-1">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center flex-shrink-0">
                    <Icon name={docType?.icon} size={20} color="var(--color-foreground)" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">{docType?.name}</h3>
                      {docType?.required && (
                        <span className="text-xs bg-error/10 text-error px-2 py-0.5 rounded">Required</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{docType?.description}</p>
                    <p className="text-xs text-muted-foreground">{docType?.formats}</p>
                  </div>
                </div>
              </div>
              {uploadedDoc ? (
                <div className="bg-muted rounded-md p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <Icon name="FileCheck" size={20} color="var(--color-success)" className="flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{uploadedDoc?.name}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Icon
                            name={getStatusIcon(uploadedDoc?.status)}
                            size={14}
                            color={uploadedDoc?.status === 'verified' ? 'var(--color-success)' : uploadedDoc?.status === 'pending' ? 'var(--color-warning)' : 'var(--color-error)'}
                          />
                          <span className={`text-xs font-caption ${getStatusColor(uploadedDoc?.status)}`}>
                            {uploadedDoc?.status?.charAt(0)?.toUpperCase() + uploadedDoc?.status?.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconName="Trash2"
                      iconSize={16}
                      onClick={() => handleRemove(uploadedDoc?.id)}
                      className="text-error hover:text-error/80 ml-2"
                    />
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Upload"
                  iconPosition="left"
                  iconSize={16}
                  onClick={() => triggerFileInput(docType)}
                  loading={isUploading && activeDocType?.id === docType?.id}
                  disabled={isUploading}
                  fullWidth
                >
                  Upload {docType?.name}
                </Button>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} color="var(--color-primary)" className="mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-heading font-semibold text-foreground mb-1">Document Verification Process</h4>
            <p className="text-sm text-muted-foreground">Uploaded documents are typically verified within 24-48 hours. Verified documents enhance your medical credit profile and may improve your credit score.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadSection;