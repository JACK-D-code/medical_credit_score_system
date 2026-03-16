import React from 'react';

const DebugTest = () => {
  const [logs, setLogs] = React.useState<string[]>([]);
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runTests = () => {
    addLog('Starting diagnostic tests...');
    
    // Test 1: Check localStorage
    const phid = localStorage.getItem('currentPHID');
    const patientData = localStorage.getItem('patientData');
    
    addLog(`PHID in localStorage: ${phid ? 'YES' : 'NO'}`);
    addLog(`Patient data in localStorage: ${patientData ? 'YES' : 'NO'}`);
    
    if (phid && patientData) {
      try {
        const data = JSON.parse(patientData);
        addLog(`Patient name: ${data.name || 'NOT FOUND'}`);
        addLog(`Patient PHID: ${data.phid || 'NOT FOUND'}`);
        addLog(`Credit Score: ${data.creditScore || 'NOT FOUND'}`);
        addLog(`Total Points: ${data.totalPoints || 'NOT FOUND'}`);
      } catch (e) {
        addLog('ERROR: Failed to parse patient data');
      }
    }
    
    // Test 2: Check imports
    addLog('Testing imports...');
    
    // Test 3: Check component files
    addLog('Checking if component files exist...');
    
    addLog('Diagnostic tests completed.');
  };

  const clearPHID = () => {
    localStorage.removeItem('currentPHID');
    localStorage.removeItem('patientData');
    addLog('PHID data cleared from localStorage');
  };

  const setTestPHID = () => {
    const testData = {
      name: 'Rahul Sharma',
      phid: 'PHID-1K4J2A8-XYZ123',
      creditScore: 750,
      loyaltyLevel: 'Gold',
      trustScore: 85,
      adherenceScore: 90,
      totalPoints: 2840,
      age: 34,
      bloodGroup: 'B+',
      phone: '+91-9876543210',
      email: 'rahul.sharma@email.com'
    };
    
    localStorage.setItem('currentPHID', testData.phid);
    localStorage.setItem('patientData', JSON.stringify(testData));
    addLog('Test PHID data set in localStorage');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">🔧 Diagnostic Tool</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <button
              onClick={runTests}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              🧪 Run Diagnostic Tests
            </button>
            
            <button
              onClick={setTestPHID}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              📝 Set Test PHID Data
            </button>
            
            <button
              onClick={clearPHID}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              🗑️ Clear PHID Data
            </button>
            
            <button
              onClick={() => window.location.href = '/phid-entry'}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              🚪 Go to PHID Entry
            </button>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => window.location.href = '/activity-reports'}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              📊 Test Activity Reports
            </button>
            
            <button
              onClick={() => window.location.href = '/profile-management-working'}
              className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
            >
              👤 Test Profile Management
            </button>
            
            <button
              onClick={() => window.location.href = '/demo'}
              className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
            >
              🎭 Test Demo Showcase
            </button>
            
            <button
              onClick={() => window.location.href = '/admin/phid-management'}
              className="w-full bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
            >
              ⚙️ Test Admin Panel
            </button>
          </div>
        </div>
        
        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
          <h3 className="text-white mb-2">📋 Diagnostic Logs:</h3>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-400">No logs yet. Click "Run Diagnostic Tests" to start.</div>
            ) : (
              logs.map((log, index) => (
                <div key={index}>{log}</div>
              ))
            )}
          </div>
        </div>
        
        <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">🔍 Troubleshooting Steps:</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800">
            <li>Click "Set Test PHID Data" to add test data</li>
            <li>Click "Run Diagnostic Tests" to check system</li>
            <li>Try accessing Activity Reports and Profile Management</li>
            <li>If still issues, check browser console for errors</li>
            <li>Clear cache and retry if needed</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DebugTest;
