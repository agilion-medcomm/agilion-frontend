import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import './SharedDashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
const BaseURL = `${API_BASE}/api/v1`;

export default function AppointmentsPage() {
  const { user } = usePersonnelAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cancelModal, setCancelModal] = useState({ open: false, appointmentId: null, patientName: '' });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    const token = localStorage.getItem('personnelToken');
    
    try {
      const params = user?.role === 'DOCTOR' && user?.doctorId 
        ? { list: 'true', doctorId: user.doctorId }
        : { list: 'true' };
      
      const res = await axios.get(`${BaseURL}/appointments`, {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const token = localStorage.getItem('personnelToken');
    try {
      await axios.put(`${BaseURL}/appointments/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
      setCancelModal({ open: false, appointmentId: null, patientName: '' });
    } catch (error) {
      alert('Failed to update status: ' + (error.response?.data?.message || error.message));
    }
  };

  const openCancelModal = (appointmentId, patientName) => {
    setCancelModal({ open: true, appointmentId, patientName });
  };

  const closeCancelModal = () => {
    setCancelModal({ open: false, appointmentId: null, patientName: '' });
  };

  const confirmCancel = () => {
    if (cancelModal.appointmentId) {
      handleUpdateStatus(cancelModal.appointmentId, 'CANCELLED');
    }
  };

  const parseDateString = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('.');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const filteredAppointments = appointments.filter(app => {
    // Status filter
    if (statusFilter !== 'ALL' && app.status !== statusFilter) return false;
    
    // Date filter
    const appDate = parseDateString(app.date);
    if (appDate) {
      if (startDate) {
        const start = new Date(startDate);
        if (appDate < start) return false;
      }
      if (endDate) {
        const end = new Date(endDate);
        if (appDate > end) return false;
      }
    }
    
    return true;
  });

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Loading...</p></div>;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">{user?.role === 'DOCTOR' ? 'My Appointments' : 'All Appointments'}</h1>
          <p className="page-subtitle">Manage and view appointment schedules</p>
        </div>
      </div>

      <div className="filters-section">
        <div style={{marginBottom: '16px', display: 'flex', gap: '16px', alignItems: 'center'}}>
          <div className="form-group" style={{margin: 0, flex: 1}}>
            <label style={{display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600'}}>Start Date</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px'}}
            />
          </div>
          <div className="form-group" style={{margin: 0, flex: 1}}>
            <label style={{display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600'}}>End Date</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px'}}
            />
          </div>
          {(startDate || endDate) && (
            <button 
              onClick={() => { setStartDate(''); setEndDate(''); }}
              style={{
                padding: '10px 20px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                marginTop: '24px'
              }}
            >
              Clear Dates
            </button>
          )}
        </div>
        <div className="role-filters">
          {['ALL', 'PENDING', 'APPROVED', 'CANCELLED'].map(status => (
            <button
              key={status}
              className={`filter-chip ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Doctor</th>
              <th>Patient</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr><td colSpan="6" className="no-data">No appointments found</td></tr>
            ) : (
              filteredAppointments.map(app => (
                <tr key={app.id}>
                  <td>{app.date}</td>
                  <td>{app.time}</td>
                  <td>{app.doctorName}</td>
                  <td>{app.patientFirstName} {app.patientLastName}</td>
                  <td>
                    <span className={`badge badge-${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    {app.status !== 'CANCELLED' && (
                      <button
                        className="btn-sm btn-danger"
                        onClick={() => openCancelModal(app.id, `${app.patientFirstName} ${app.patientLastName}`)}
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModal.open && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="modal-content" style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <span style={{ fontSize: '28px' }}>⚠️</span>
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                Randevu İptali
              </h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                <strong>{cancelModal.patientName}</strong> adlı hastanın randevusunu iptal etmek istediğinize emin misiniz?
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={closeCancelModal}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Vazgeç
              </button>
              <button
                onClick={confirmCancel}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Evet, İptal Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
