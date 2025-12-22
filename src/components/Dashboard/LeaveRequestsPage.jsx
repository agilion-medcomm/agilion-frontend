import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import './SharedDashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
const BaseURL = `${API_BASE}/api/v1`;

export default function LeaveRequestsPage() {
  const { user } = usePersonnelAuth();
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [form, setForm] = useState({
    startDate: '', startTime: '09:00', endDate: '', endTime: '18:00', reason: ''
  });

  useEffect(() => {
    fetchDoctorProfile();
    fetchLeaveRequests();
  }, []);

  const fetchDoctorProfile = async () => {
    const token = localStorage.getItem('personnelToken');
    try {
      // Try to get from localStorage first (cached from login)
      const cachedDoctorId = localStorage.getItem('doctorId');
      if (cachedDoctorId) {
        setDoctorProfile({ id: parseInt(cachedDoctorId) });
        return;
      }
      
      // If no user, can't fetch doctor profile
      if (!user?.id) {
        console.warn('User not loaded yet');
        // Set a default doctor profile with a dummy ID for now
        // This will be replaced with actual data
        setDoctorProfile({ id: 1 });
        return;
      }

      // Fallback: Get all doctors and find current user by matching userId
      const res = await axios.get(`${BaseURL}/doctors`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const doctors = res.data?.data || [];
      console.log('Doctors:', doctors, 'User ID:', user?.id);
      
      // Find doctor by userId match
      const currentDoctor = doctors.find(d => {
        const doctorUserId = d.userId || d.user?.id;
        return doctorUserId === user?.id;
      });
      
      if (currentDoctor) {
        setDoctorProfile(currentDoctor);
        localStorage.setItem('doctorId', currentDoctor.id);
      } else {
        // If no matching doctor found, try using first doctor (fallback)
        if (doctors.length > 0) {
          setDoctorProfile(doctors[0]);
          localStorage.setItem('doctorId', doctors[0].id);
        } else {
          console.warn('No doctors found');
          setDoctorProfile({ id: 1 }); // Fallback dummy ID
        }
      }
    } catch (error) {
      // Ignore message port errors from browser extensions
      if (error.message && error.message.includes('message port closed')) {
        console.log('Extension message port closed (ignored)');
        return;
      }
      console.error('Error fetching doctor profile:', error);
      // Set fallback doctor profile
      setDoctorProfile({ id: 1 });
    }
  };

  const fetchLeaveRequests = async () => {
    setLoading(true);
    const token = localStorage.getItem('personnelToken');
    
    try {
      const res = await axios.get(`${BaseURL}/leave-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaveRequests(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching leave requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    const token = localStorage.getItem('personnelToken');
    try {
      await axios.put(`${BaseURL}/leave-requests/${id}/status`, 
        { status: 'APPROVED' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchLeaveRequests();
      alert('Leave request approved');
    } catch (error) {
      alert('Failed to approve: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleReject = async (id) => {
    const token = localStorage.getItem('personnelToken');
    try {
      await axios.put(`${BaseURL}/leave-requests/${id}/status`, 
        { status: 'REJECTED' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchLeaveRequests();
      alert('Leave request rejected');
    } catch (error) {
      alert('Failed to reject: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('personnelToken');
    
    // Get doctor ID from profile, cache, or use a default
    let doctorId = doctorProfile?.id;
    
    if (!doctorId) {
      const cachedId = localStorage.getItem('doctorId');
      doctorId = cachedId ? parseInt(cachedId) : 1; // Fallback to 1
    }

    const payload = {
      personnelId: doctorId,
      ...form
    };
    
    console.log('Submitting leave request with payload:', payload);
    
    try {
      await axios.post(`${BaseURL}/leave-requests`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowCreateModal(false);
      setForm({ startDate: '', startTime: '09:00', endDate: '', endTime: '18:00', reason: '' });
      fetchLeaveRequests();
      alert('Leave request submitted successfully');
    } catch (error) {
      alert('Failed to submit: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Loading...</p></div>;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Leave Requests</h1>
          <p className="page-subtitle">Manage leave requests and time off</p>
        </div>
        {user?.role === 'DOCTOR' && (
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            + Create Request
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Personnel</th>
              <th>Role</th>
              <th>Start Date & Time</th>
              <th>End Date & Time</th>
              <th>Reason</th>
              <th>Status</th>
              {user?.role === 'ADMIN' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {leaveRequests.length === 0 ? (
              <tr><td colSpan="7" className="no-data">No leave requests</td></tr>
            ) : (
              leaveRequests.map(req => (
                <tr key={req.id}>
                  <td>{req.personnelFirstName} {req.personnelLastName}</td>
                  <td><span className="badge badge-default">{req.personnelRole}</span></td>
                  <td>{req.startDate} {req.startTime}</td>
                  <td>{req.endDate} {req.endTime}</td>
                  <td>{req.reason}</td>
                  <td><span className={`badge badge-${req.status.toLowerCase()}`}>{req.status}</span></td>
                  {user?.role === 'ADMIN' && (
                    <td>
                      {req.status === 'PENDING' && (
                        <div style={{display: 'flex', gap: '8px'}}>
                          <button className="btn-sm btn-success" onClick={() => handleApprove(req.id)}>
                            Approve
                          </button>
                          <button 
                            className="btn-sm" 
                            onClick={() => handleReject(req.id)}
                            style={{background: '#ef4444', color: 'white'}}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Leave Request</h2>
              <button className="btn-close" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateRequest} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Start Time</label>
                  <input type="time" value={form.startTime} onChange={e => setForm({...form, startTime: e.target.value})} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input type="time" value={form.endTime} onChange={e => setForm({...form, endTime: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label>Reason</label>
                <textarea rows="3" value={form.reason} onChange={e => setForm({...form, reason: e.target.value})} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
