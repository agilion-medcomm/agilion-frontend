import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import './SharedDashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";
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
        return;
      }

      // Get all doctors and find current user by matching userId
      const res = await axios.get(`${BaseURL}/doctors`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const doctors = res.data?.data || [];
      console.log('Looking for doctor with userId:', user?.id, 'in doctors:', doctors);

      // Find doctor by userId match - backend returns Doctor.id and userId
      const currentDoctor = doctors.find(d => {
        // Check both d.userId (direct) and d.user.id (nested)
        const doctorUserId = d.userId || d.user?.id;
        return doctorUserId === user?.id;
      });

      if (currentDoctor) {
        console.log('Found doctor profile:', currentDoctor);
        setDoctorProfile(currentDoctor);
        // Store Doctor.id (not User.id!) - this is what backend needs for leave requests
        localStorage.setItem('doctorId', currentDoctor.id.toString());
      } else {
        console.error('Could not find doctor profile for user ID:', user?.id);
        alert('Doktor profili bulunamadı. Lütfen yöneticiye başvurun.');
      }
    } catch (error) {
      // Ignore message port errors from browser extensions
      if (error.message && error.message.includes('message port closed')) {
        console.log('Extension message port closed (ignored)');
        return;
      }
      console.error('Error fetching doctor profile:', error);
      alert('Doktor profili alınamadı: ' + (error.response?.data?.message || error.message));
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
      alert('İzin talebi onaylandı');
    } catch (error) {
      alert('Onaylama başarısız: ' + (error.response?.data?.message || error.message));
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
      alert('İzin talebi reddedildi');
    } catch (error) {
      alert('Reddetme başarısız: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('personnelToken');

    // Get doctor ID from profile or cache
    let doctorId = doctorProfile?.id;

    if (!doctorId) {
      const cachedId = localStorage.getItem('doctorId');
      doctorId = cachedId ? parseInt(cachedId) : null;
    }

    // Validate doctor ID exists
    if (!doctorId) {
      alert('Doktor profili bulunamadı. Lütfen sayfayı yenileyip tekrar deneyin.');
      return;
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
      alert('İzin talebi başarıyla oluşturuldu');
    } catch (error) {
      alert('Oluşturma başarısız: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Yükleniyor...</p></div>;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">İzin Talepleri</h1>
          <p className="page-subtitle">İzin taleplerini ve izinleri yönetin</p>
        </div>
        {user?.role === 'DOCTOR' && (
          <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
            + Talep Oluştur
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Personel</th>
              <th>Rol</th>
              <th>Başlangıç Tarihi & Saati</th>
              <th>Bitiş Tarihi & Saati</th>
              <th>Neden</th>
              <th>Durum</th>
              {user?.role === 'ADMIN' && <th>İşlemler</th>}
            </tr>
          </thead>
          <tbody>
            {leaveRequests.length === 0 ? (
              <tr><td colSpan="7" className="no-data">İzin talebi bulunmuyor</td></tr>
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
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn-sm btn-success" onClick={() => handleApprove(req.id)}>
                            Onayla
                          </button>
                          <button
                            className="btn-sm"
                            onClick={() => handleReject(req.id)}
                            style={{ background: '#ef4444', color: 'white' }}
                          >
                            Reddet
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
              <h2>İzin Talebi Oluştur</h2>
              <button className="btn-close" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateRequest} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Başlangıç Tarihi</label>
                  <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Başlangıç Saati</label>
                  <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Bitiş Tarihi</label>
                  <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Bitiş Saati</label>
                  <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Neden</label>
                <textarea rows="3" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>İptal</button>
                <button type="submit" className="btn-primary">Gönder</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
