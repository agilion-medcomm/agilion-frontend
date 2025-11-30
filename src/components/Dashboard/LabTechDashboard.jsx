import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import './SharedDashboard.css';

const BaseURL = import.meta.env.VITE_API_BASE || 'http://localhost:3000';

export default function LabTechDashboard() {
  const { user } = usePersonnelAuth();
  const [tests, setTests] = useState([]);
  const [filter, setFilter] = useState('pending'); // pending, all
  const [loading, setLoading] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [resultData, setResultData] = useState({
    results: '',
    notes: '',
    resultFile: null
  });

  useEffect(() => {
    fetchTests();
  }, [filter]);

  const fetchTests = async () => {
    setLoading(true);
    try {
      // TODO: Replace with real API call
      // const response = await axios.get(`${BaseURL}/api/v1/lab-tests`, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      //   params: { status: filter === 'pending' ? 'PENDING,IN_PROGRESS' : undefined }
      // });
      
      // Mock data
      const mockTests = [
        {
          id: 1,
          patientName: 'John Doe',
          patientId: 101,
          testType: 'Complete Blood Count (CBC)',
          status: 'PENDING',
          orderedBy: 'Dr. Smith',
          orderedAt: new Date().toISOString(),
          priority: 'NORMAL'
        },
        {
          id: 2,
          patientName: 'Jane Smith',
          patientId: 102,
          testType: 'Lipid Panel',
          status: 'IN_PROGRESS',
          orderedBy: 'Dr. Johnson',
          orderedAt: new Date(Date.now() - 3600000).toISOString(),
          priority: 'URGENT'
        },
        {
          id: 3,
          patientName: 'Mike Johnson',
          patientId: 103,
          testType: 'Thyroid Function Test',
          status: 'COMPLETED',
          orderedBy: 'Dr. Williams',
          orderedAt: new Date(Date.now() - 86400000).toISOString(),
          completedAt: new Date(Date.now() - 7200000).toISOString(),
          priority: 'NORMAL'
        },
      ];

      setTests(filter === 'pending' 
        ? mockTests.filter(t => t.status === 'PENDING' || t.status === 'IN_PROGRESS')
        : mockTests
      );
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = async (testId) => {
    try {
      // TODO: Replace with real API call
      // await axios.put(`${BaseURL}/api/v1/lab-tests/${testId}/start`, {}, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });
      
      alert('Test started!');
      fetchTests();
    } catch (error) {
      alert('Error starting test: ' + error.message);
    }
  };

  const handleUploadResults = (test) => {
    setSelectedTest(test);
    setShowResultModal(true);
  };

  const handleSubmitResults = async (e) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append('results', resultData.results);
      formData.append('notes', resultData.notes);
      if (resultData.resultFile) {
        formData.append('resultFile', resultData.resultFile);
      }

      // TODO: Replace with real API call
      // await axios.put(`${BaseURL}/api/v1/lab-tests/${selectedTest.id}/results`, formData, {
      //   headers: { 
      //     Authorization: `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });
      
      alert('Results uploaded successfully!');
      setShowResultModal(false);
      setSelectedTest(null);
      setResultData({ results: '', notes: '', resultFile: null });
      fetchTests();
    } catch (error) {
      alert('Error uploading results: ' + error.message);
    }
  };

  const pendingCount = tests.filter(t => t.status === 'PENDING').length;
  const inProgressCount = tests.filter(t => t.status === 'IN_PROGRESS').length;
  const completedToday = tests.filter(t => 
    t.status === 'COMPLETED' && 
    new Date(t.completedAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Lab Technician Dashboard</h1>
          <p>Manage laboratory tests and results</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)' }}>
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <h3>Pending Tests</h3>
            <p className="stat-value">{pendingCount}</p>
          </div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #feca57 0%, #ff9ff3 100%)' }}>
          <div className="stat-icon">🔬</div>
          <div className="stat-info">
            <h3>In Progress</h3>
            <p className="stat-value">{inProgressCount}</p>
          </div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #48dbfb 0%, #0abde3 100%)' }}>
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Completed Today</h3>
            <p className="stat-value">{completedToday}</p>
          </div>
        </div>

        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #1dd1a1 0%, #10ac84 100%)' }}>
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <h3>Total Tests</h3>
            <p className="stat-value">{tests.length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="filter-group">
          <label>View:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="pending">Pending & In Progress</option>
            <option value="all">All Tests</option>
          </select>
        </div>
      </div>

      {/* Tests Table */}
      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Test Type</th>
              <th>Ordered By</th>
              <th>Ordered At</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>Loading...</td>
              </tr>
            ) : tests.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>No tests found</td>
              </tr>
            ) : (
              tests.map((test) => (
                <tr key={test.id}>
                  <td>
                    <strong>{test.patientName}</strong>
                    <br />
                    <small>ID: {test.patientId}</small>
                  </td>
                  <td>{test.testType}</td>
                  <td>{test.orderedBy}</td>
                  <td>{new Date(test.orderedAt).toLocaleString()}</td>
                  <td>
                    <span className={`badge badge-${test.priority.toLowerCase()}`}>
                      {test.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${test.status.toLowerCase().replace('_', '-')}`}>
                      {test.status}
                    </span>
                  </td>
                  <td>
                    {test.status === 'PENDING' && (
                      <button 
                        className="btn-small btn-primary"
                        onClick={() => handleStartTest(test.id)}
                      >
                        Start Test
                      </button>
                    )}
                    {test.status === 'IN_PROGRESS' && (
                      <button 
                        className="btn-small btn-success"
                        onClick={() => handleUploadResults(test)}
                      >
                        Upload Results
                      </button>
                    )}
                    {test.status === 'COMPLETED' && (
                      <button 
                        className="btn-small btn-secondary"
                        onClick={() => alert('View results')}
                      >
                        View Results
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Upload Results Modal */}
      {showResultModal && (
        <div className="modal-overlay" onClick={() => setShowResultModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload Test Results</h2>
              <button className="modal-close" onClick={() => setShowResultModal(false)}>×</button>
            </div>

            <div className="test-info">
              <p><strong>Patient:</strong> {selectedTest?.patientName}</p>
              <p><strong>Test:</strong> {selectedTest?.testType}</p>
            </div>

            <form onSubmit={handleSubmitResults}>
              <div className="form-group">
                <label>Results (JSON format)</label>
                <textarea
                  required
                  value={resultData.results}
                  onChange={(e) => setResultData({...resultData, results: e.target.value})}
                  placeholder='{"hemoglobin": "14.2", "wbc": "7500", ...}'
                  rows="6"
                />
                <small>Enter test results in JSON format</small>
              </div>

              <div className="form-group">
                <label>Upload Result File (PDF)</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  onChange={(e) => setResultData({...resultData, resultFile: e.target.files[0]})}
                />
                <small>Optional: Upload detailed report (PDF, Image)</small>
              </div>

              <div className="form-group">
                <label>Technician Notes</label>
                <textarea
                  value={resultData.notes}
                  onChange={(e) => setResultData({...resultData, notes: e.target.value})}
                  placeholder="Additional notes or observations..."
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowResultModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Upload Results
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* API Notice */}
      <div className="api-notice">
        <p><strong>⚠️ Backend API Required:</strong></p>
        <ul>
          <li>GET /api/v1/lab-tests - Fetch lab tests with filtering</li>
          <li>PUT /api/v1/lab-tests/:id/start - Start a test</li>
          <li>PUT /api/v1/lab-tests/:id/results - Upload results</li>
          <li>GET /api/v1/lab-tests/:id/results - View results</li>
        </ul>
        <p>See IMPLEMENTATION_CHECKLIST.md for database schema and details</p>
      </div>
    </div>
  );
}
