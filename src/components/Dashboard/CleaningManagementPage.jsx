import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import './SharedDashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
const BaseURL = `${API_BASE}/api/v1`;

const zones = ['Zone A - Lobby', 'Zone B - Rooms 101-110', 'Zone C - Rooms 111-120', 'Zone D - ICU', 'Zone E - Surgery', 'Zone F - Cafeteria', 'Zone G - Parking'];

export default function CleaningManagementPage() {
  const { user } = usePersonnelAuth();
  const [cleaningRecords, setCleaningRecords] = useState([]);
  const [cleaners, setCleaners] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zoneFilter, setZoneFilter] = useState('ALL');
  const [cleanerFilter, setCleanerFilter] = useState('ALL');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState({ cleanerId: '', zone: '', date: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('personnelToken');
    
    try {
      // Fetch personnel to get cleaners
      const personnelRes = await axios.get(`${BaseURL}/personnel`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allCleaners = (personnelRes.data?.data || []).filter(p => p.role === 'CLEANER');
      setCleaners(allCleaners);
      
      // Mock cleaning records - replace with actual API when available
      const mockRecords = [
        { id: 1, cleanerId: allCleaners[0]?.id, cleanerName: `${allCleaners[0]?.firstName} ${allCleaners[0]?.lastName}`, zone: 'Zone A - Lobby', date: '2025-11-29', time: '10:30', status: 'Completed', photoUrl: null },
        { id: 2, cleanerId: allCleaners[0]?.id, cleanerName: `${allCleaners[0]?.firstName} ${allCleaners[0]?.lastName}`, zone: 'Zone B - Rooms 101-110', date: '2025-11-29', time: '14:00', status: 'Completed', photoUrl: null },
      ];
      setCleaningRecords(mockRecords);
      
      // Mock assignments
      const mockAssignments = [
        { id: 1, cleanerId: allCleaners[0]?.id, cleanerName: `${allCleaners[0]?.firstName} ${allCleaners[0]?.lastName}`, zone: 'Zone A - Lobby', date: '2025-11-30', status: 'Pending' },
      ];
      setAssignments(mockAssignments);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    // Mock assignment - replace with actual API
    const cleaner = cleaners.find(c => c.id === parseInt(assignForm.cleanerId));
    const newAssignment = {
      id: assignments.length + 1,
      cleanerId: parseInt(assignForm.cleanerId),
      cleanerName: `${cleaner.firstName} ${cleaner.lastName}`,
      zone: assignForm.zone,
      date: assignForm.date,
      status: 'Pending'
    };
    setAssignments([...assignments, newAssignment]);
    setShowAssignModal(false);
    setAssignForm({ cleanerId: '', zone: '', date: '' });
    alert('Cleaner assigned successfully (Mock data - needs API implementation)');
  };

  const filteredRecords = cleaningRecords.filter(record => {
    if (zoneFilter !== 'ALL' && record.zone !== zoneFilter) return false;
    if (cleanerFilter !== 'ALL' && record.cleanerId !== parseInt(cleanerFilter)) return false;
    return true;
  });

  const filteredAssignments = assignments.filter(assignment => {
    if (zoneFilter !== 'ALL' && assignment.zone !== zoneFilter) return false;
    if (cleanerFilter !== 'ALL' && assignment.cleanerId !== parseInt(cleanerFilter)) return false;
    return true;
  });

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Loading...</p></div>;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Cleaning Management</h1>
          <p className="page-subtitle">Track cleaning procedures and assign zones</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn-primary" onClick={() => setShowAssignModal(true)}>
            + Assign Cleaner
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div style={{display: 'flex', gap: '16px', marginBottom: '16px'}}>
          <div className="form-group" style={{margin: 0, flex: 1}}>
            <label style={{display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600'}}>Filter by Zone</label>
            <select 
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              style={{width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px'}}
            >
              <option value="ALL">All Zones</option>
              {zones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
            </select>
          </div>
          <div className="form-group" style={{margin: 0, flex: 1}}>
            <label style={{display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600'}}>Filter by Cleaner</label>
            <select 
              value={cleanerFilter}
              onChange={(e) => setCleanerFilter(e.target.value)}
              style={{width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px'}}
            >
              <option value="ALL">All Cleaners</option>
              {cleaners.map(cleaner => (
                <option key={cleaner.id} value={cleaner.id}>
                  {cleaner.firstName} {cleaner.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assignments Table */}
      <div style={{marginBottom: '32px'}}>
        <h2 style={{fontSize: '20px', fontWeight: '700', marginBottom: '16px'}}>Current Assignments</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cleaner</th>
                <th>Zone</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssignments.length === 0 ? (
                <tr><td colSpan="4" className="no-data">No assignments</td></tr>
              ) : (
                filteredAssignments.map(assignment => (
                  <tr key={assignment.id}>
                    <td>{assignment.cleanerName}</td>
                    <td>{assignment.zone}</td>
                    <td>{new Date(assignment.date).toLocaleDateString('tr-TR')}</td>
                    <td><span className={`badge badge-${assignment.status.toLowerCase()}`}>{assignment.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cleaning Records Table */}
      <div>
        <h2 style={{fontSize: '20px', fontWeight: '700', marginBottom: '16px'}}>Cleaning History</h2>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Cleaner</th>
                <th>Zone</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Photo</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length === 0 ? (
                <tr><td colSpan="6" className="no-data">No cleaning records</td></tr>
              ) : (
                filteredRecords.map(record => (
                  <tr key={record.id}>
                    <td>{record.cleanerName}</td>
                    <td>{record.zone}</td>
                    <td>{new Date(record.date).toLocaleDateString('tr-TR')}</td>
                    <td>{record.time}</td>
                    <td><span className={`badge badge-${record.status.toLowerCase()}`}>{record.status}</span></td>
                    <td>
                      {record.photoUrl ? (
                        <button className="btn-sm" style={{background: '#3b82f6', color: 'white'}}>View Photo</button>
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

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assign Cleaner to Zone</h2>
              <button className="btn-close" onClick={() => setShowAssignModal(false)}>×</button>
            </div>
            <form onSubmit={handleAssign} className="modal-form">
              <div className="form-group">
                <label>Cleaner *</label>
                <select 
                  value={assignForm.cleanerId} 
                  onChange={e => setAssignForm({...assignForm, cleanerId: e.target.value})} 
                  required
                >
                  <option value="">Select cleaner</option>
                  {cleaners.map(cleaner => (
                    <option key={cleaner.id} value={cleaner.id}>
                      {cleaner.firstName} {cleaner.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Zone *</label>
                <select 
                  value={assignForm.zone} 
                  onChange={e => setAssignForm({...assignForm, zone: e.target.value})} 
                  required
                >
                  <option value="">Select zone</option>
                  {zones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input 
                  type="date" 
                  value={assignForm.date}
                  onChange={e => setAssignForm({...assignForm, date: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* API Notice */}
      <div style={{marginTop: '32px', padding: '20px', background: '#fef3c7', borderRadius: '12px', border: '1px solid #fbbf24'}}>
        <p style={{margin: 0, fontSize: '14px', color: '#92400e'}}>
          <strong>⚠️ Note:</strong> This page is using mock data. Backend API endpoints need to be implemented for full functionality.
          See IMPLEMENTATION_CHECKLIST.md for required endpoints.
        </p>
      </div>
    </div>
  );
}
