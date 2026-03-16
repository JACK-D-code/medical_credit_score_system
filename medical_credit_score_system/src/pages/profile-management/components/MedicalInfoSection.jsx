import React, { useState } from 'react';
import { Stethoscope, Save } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import Button from '../../../components/ui/Button';

const MedicalInfoSection = ({ medicalData, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(medicalData || {
    medicalHistory: '',
    allergies: '',
    chronicConditions: ''
  });

  // Update formData when medicalData prop changes (e.g. from fetch)
  React.useEffect(() => {
    if (medicalData) {
      setFormData(medicalData);
    }
  }, [medicalData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4 md:p-6 lg:p-8 flex items-center justify-between border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 md:w-6 md:h-6 text-purple-500" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground">Medical Information</h2>
            <p className="text-sm text-muted-foreground">Manage your health history and conditions</p>
          </div>
        </div>
        <Button
          variant={isEditing ? 'outline' : 'default'}
          size="sm"
          onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
        >
          {isEditing ? 'Cancel' : 'Edit Info'}
        </Button>
      </div>

      <div className="p-4 md:p-6 lg:p-8 space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Medical History</label>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory || ''}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="List any past surgeries, hospitalizations, or major illnesses..."
              className="w-full h-24 px-4 py-3 bg-background border border-border rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Chronic Conditions</label>
              <textarea
                name="chronicConditions"
                value={formData.chronicConditions || ''}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="E.g., Asthma, Diabetes, Hypertension..."
                className="w-full h-20 px-4 py-3 bg-background border border-border rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Allergies</label>
              <textarea
                name="allergies"
                value={formData.allergies || ''}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="List any food or medication allergies..."
                className="w-full h-20 px-4 py-3 bg-background border border-border rounded-xl focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-none"
              />
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground italic">
            * Note: This information is securely shared with your authorized Healthcare Providers to ensure accurate treatment and billing logic. Updating your health profile increases your trust score.
          </p>
        </div>

        {isEditing && (
          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleSave}
            >
              <Save className="w-4 h-4" />
              Save Medical Info
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MedicalInfoSection;
