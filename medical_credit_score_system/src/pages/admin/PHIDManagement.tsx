import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/shadcn-button';
import { 
  Plus,
  Users,
  Search,
  Download,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';

const PHIDManagement = () => {
  const [phids, setPhids] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPHID, setSelectedPHID] = useState<any>(null);

  // Form data for creating new PHID
  const [formData, setFormData] = useState({
    patientId: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    bloodGroup: '',
    phone: '',
    address: '',
    emergencyContact: ''
  });

  // Load PHIDs
  useEffect(() => {
    loadPHIDs();
  }, []);

  const loadPHIDs = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/phid/all');
      const data = await response.json();
      
      if (data.success) {
        setPhids(data.phids);
      }
    } catch (error) {
      console.error('Error loading PHIDs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new PHID
  const createPHID = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/phid/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`PHID created successfully: ${data.phid}`);
        setShowCreateForm(false);
        setFormData({
          patientId: '',
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          bloodGroup: '',
          phone: '',
          address: '',
          emergencyContact: ''
        });
        loadPHIDs();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating PHID:', error);
      alert('Failed to create PHID');
    }
  };

  // Update PHID status
  const updatePHIDStatus = async (phid: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/phid/${phid}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`PHID ${isActive ? 'activated' : 'deactivated'} successfully`);
        loadPHIDs();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating PHID status:', error);
      alert('Failed to update PHID status');
    }
  };

  // Filter PHIDs
  const filteredPHIDs = phids.filter((phid: any) => {
    const matchesSearch = phid.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         phid.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         phid.phid?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                         (filterStatus === 'active' && phid.isActive) ||
                         (filterStatus === 'inactive' && !phid.isActive);
    
    return matchesSearch && matchesFilter;
  });

  // Export PHIDs
  const exportPHIDs = () => {
    const csvContent = [
      ['PHID', 'Patient Name', 'Age', 'Blood Group', 'Status', 'Issued Date', 'Expires Date'],
      ...filteredPHIDs.map((phid: any) => [
        phid.phid,
        `${phid.patient?.firstName} ${phid.patient?.lastName}`,
        phid.patient?.age || 'N/A',
        phid.patient?.bloodGroup || 'N/A',
        phid.isActive ? 'Active' : 'Inactive',
        new Date(phid.issuedAt).toLocaleDateString(),
        new Date(phid.expiresAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phids_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            PHID Management
          </h1>
          <p className="text-gray-600">
            Create and manage Patient Health IDs (PHIDs) for complete patient data access
          </p>
        </div>

        {/* Actions Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search PHIDs or patients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All PHIDs</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create PHID
                </Button>
                
                <Button
                  onClick={exportPHIDs}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create PHID Form */}
        {showCreateForm && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle>Create New PHID</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={createPHID} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Patient ID *
                    </label>
                    <input
                      type="text"
                      value={formData.patientId}
                      onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Group
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Blood Group</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    variant="outline"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Create PHID
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* PHIDs List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              PHIDs ({filteredPHIDs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading PHIDs...</p>
              </div>
            ) : filteredPHIDs.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No PHIDs found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">PHID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Patient Name</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Age</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Blood Group</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Issued Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Expires Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPHIDs.map((phid: any) => (
                      <tr key={phid.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-mono text-sm font-semibold">{phid.phid}</span>
                        </td>
                        <td className="py-3 px-4">
                          {phid.patient ? `${phid.patient.firstName} ${phid.patient.lastName}` : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          {phid.patient?.age || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          {phid.patient?.bloodGroup || 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={phid.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {phid.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(phid.issuedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          {new Date(phid.expiresAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedPHID(phid)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updatePHIDStatus(phid.phid, !phid.isActive)}
                              className={phid.isActive ? 'bg-red-100 hover:bg-red-200 text-red-800' : 'bg-green-100 hover:bg-green-200 text-green-800'}
                            >
                              {phid.isActive ? <XCircle className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PHID Details Modal */}
        {selectedPHID && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">PHID Details</h3>
                <Button
                  onClick={() => setSelectedPHID(null)}
                  variant="outline"
                  size="sm"
                >
                  ×
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">PHID Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">PHID:</span>
                      <span className="font-mono font-semibold">{selectedPHID.phid}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className={selectedPHID.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {selectedPHID.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Issued Date:</span>
                      <span>{new Date(selectedPHID.issuedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expires Date:</span>
                      <span>{new Date(selectedPHID.expiresAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Issued By:</span>
                      <span>{selectedPHID.issuedBy || 'System'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Patient Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span>{selectedPHID.patient ? `${selectedPHID.patient.firstName} ${selectedPHID.patient.lastName}` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span>{selectedPHID.patient?.dateOfBirth || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blood Group:</span>
                      <span>{selectedPHID.patient?.bloodGroup || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span>{selectedPHID.patient?.phone || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PHIDManagement;
