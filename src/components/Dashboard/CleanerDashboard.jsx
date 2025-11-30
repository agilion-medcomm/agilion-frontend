import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import './SharedDashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
const BaseURL = `${API_BASE}/api/v1`;

export default function CleanerDashboard() {
  const { user } = usePersonnelAuth();
  const [myAssignments, setMyAssignments] = useState([]);
  const [myHistory, setMyHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [uploadForm, setUploadForm] = useState({ photo: null, notes: '' });

  useEffect(() => {
    fetchMyData();
  }, []);

  const fetchMyData = async () => {
    setLoading(true);
    // Mock data - replace with actual API
    const mockAssignments = [
      { id: 1, zone: 'Zone A - Lobby', date: '2025-11-30', status: 'Pending' },
      { id: 2, zone: 'Zone C - Rooms 111-120', date: '2025-11-30', status: 'Pending' },
    ];
    
    const mockHistory = [
      { id: 1, zone: 'Zone A - Lobby', date: '2025-11-29', time: '10:30', status: 'Completed', photoUploaded: true },
      { id: 2, zone: 'Zone B - Rooms 101-110', date: '2025-11-29', time: '14:00', status: 'Completed', photoUploaded: true },
    ];
    
    setMyAssignments(mockAssignments);
    setMyHistory(mockHistory);
    setLoading(false);
  };

  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm({...uploadForm, photo: e.target.files[0]});
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    // Mock upload - replace with actual API
    alert(`Photo uploaded for ${selectedAssignment.zone} (Mock - needs API implementation)`);
    
    // Update assignment status
    setMyAssignments(myAssignments.map(a => 
      a.id === selectedAssignment.id ? {...a, status: 'Completed'} : a
    ));
    
    // Add to history
    setMyHistory([{
      id: myHistory.length + 1,
      zone: selectedAssignment.zone,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute: '2-digit'}),
      status: 'Completed',
      photoUploaded: true
    }, ...myHistory]);
    
    setShowUploadModal(false);
    setSelectedAssignment(null);
    setUploadForm({ photo: null, notes: '' });
  };

  const openUploadModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowUploadModal(true);
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Loading...</p></div>;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">My Cleaning Tasks</h1>
          <p className="page-subtitle">Welcome, {user?.firstName} {user?.lastName}</p>
        </div>
      </div>

      {/* Today's Assignments */}
      <div style={{marginBottom: '32px'}}>
        <h2 style={{fontSize: '20px', fontWeight: '700', marginBottom: '16px', color: '#ef4444'}}>
          📋 Today's Assignments ({myAssignments.length})
        </h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Zone</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {myAssignments.length === 0 ? (
                <tr><td colSpan="4" className="no-data">No assignments for today</td></tr>
              ) : (
                myAssignments.map(assignment => (
                  <tr key={assignment.id}>
                    <td><strong>{assignment.zone}</strong></td>
                    <td>{new Date(assignment.date).toLocaleDateString('tr-TR')}</td>
                    <td><span className={`badge badge-${assignment.status.toLowerCase()}`}>{assignment.status}</span></td>
                    <td>
                      {assignment.status === 'Pending' && (
                        <button 
                          className="btn-sm btn-success"
                          onClick={() => openUploadModal(assignment)}
                        >
                          Upload Photo
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cleaning History */}
      <div>
        <h2 style={{fontSize: '20px', fontWeight: '700', marginBottom: '16px'}}>✅ Completed Tasks</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Zone</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Photo</th>
              </tr>
            </thead>
            <tbody>
              {myHistory.length === 0 ? (
                <tr><td colSpan="5" className="no-data">No completed tasks yet</td></tr>
              ) : (
                myHistory.map(record => (
                  <tr key={record.id}>
                    <td>{record.zone}</td>
                    <td>{new Date(record.date).toLocaleDateString('tr-TR')}</td>
                    <td>{record.time}</td>
                    <td><span className={`badge badge-completed`}>{record.status}</span></td>
                    <td>
                      {record.photoUploaded ? (
                        <span style={{color: '#22c55e', fontWeight: '600'}}>✓ Uploaded</span>
                      ) : (
                        <span style={{color: '#94a3b8'}}>No photo</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && selectedAssignment && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload Cleaning Photo</h2>
              <button className="btn-close" onClick={() => setShowUploadModal(false)}>×</button>
            </div>
            <form onSubmit={handleUpload} className="modal-form">
              <div style={{padding: '16px', background: '#f8fafc', borderRadius: '8px', marginBottom: '20px'}}>
                <p style={{margin: 0, fontSize: '14px', color: '#334155'}}>
                  <strong>Zone:</strong> {selectedAssignment.zone}<br/>
                  <strong>Date:</strong> {new Date(selectedAssignment.date).toLocaleDateString('tr-TR')}
                </p>
              </div>
              <div className="form-group">
                <label>Upload Photo *</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handlePhotoChange}
                  required
                  style={{padding: '10px', border: '2px dashed #e2e8f0', borderRadius: '8px', background: '#f8fafc'}}
                />
                {uploadForm.photo && (
                  <p style={{marginTop: '8px', fontSize: '13px', color: '#22c55e'}}>
                    ✓ Selected: {uploadForm.photo.name}
                  </p>
                )}
              </div>
              <div className="form-group">
                <label>Notes (Optional)</label>
                <textarea 
                  rows="3" 
                  value={uploadForm.notes}
                  onChange={e => setUploadForm({...uploadForm, notes: e.target.value})}
                  placeholder="Any additional notes about the cleaning..."
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowUploadModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Upload & Complete</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* API Notice */}
      <div style={{marginTop: '32px', padding: '20px', background: '#fef3c7', borderRadius: '12px', border: '1px solid #fbbf24'}}>
        <p style={{margin: 0, fontSize: '14px', color: '#92400e'}}>
          <strong>⚠️ Note:</strong> This page is using mock data. Backend API endpoints need to be implemented for full functionality.
          Photo uploads require multipart/form-data handling on the backend.
        </p>
      </div>
    </div>
  );
}
