import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import './HomeHealthRequestsPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
const BaseURL = `${API_BASE}/api/v1`;

// Status badge renkleri ve Türkçe karşılıkları
const STATUS_CONFIG = {
  PENDING: { label: 'Beklemede', color: '#f39c12', bgColor: '#fef9e7' },
  APPROVED: { label: 'Onaylandı', color: '#27ae60', bgColor: '#e9f7ef' },
  REJECTED: { label: 'Reddedildi', color: '#e74c3c', bgColor: '#fdedec' },
};

export default function HomeHealthRequestsPage() {
  const { user, token } = usePersonnelAuth();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionNote, setActionNote] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const isAdmin = user?.role === 'ADMIN';
  const isCashier = user?.role === 'CASHIER';
  const canApprove = isAdmin || isCashier;

  // Talepleri getir
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const params = filterStatus ? { status: filterStatus } : {};
      const response = await axios.get(`${BaseURL}/home-health`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });
      setRequests(response.data.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Talepler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // İstatistikleri getir
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${BaseURL}/home-health/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchRequests();
      fetchStats();
    }
  }, [token, filterStatus]);

  // Onay
  const handleApprove = async () => {
    if (!selectedRequest) return;
    setActionLoading(true);
    try {
      await axios.patch(
        `${BaseURL}/home-health/${selectedRequest.id}/approve`,
        { note: actionNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedRequest(null);
      setActionNote('');
      fetchRequests();
      fetchStats();
    } catch (err) {
      alert('Onaylama sırasında hata oluştu: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  // Red
  const handleReject = async () => {
    if (!selectedRequest) return;
    setActionLoading(true);
    try {
      await axios.patch(
        `${BaseURL}/home-health/${selectedRequest.id}/reject`,
        { note: actionNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelectedRequest(null);
      setActionNote('');
      fetchRequests();
      fetchStats();
    } catch (err) {
      alert('Reddetme sırasında hata oluştu: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  // Yetki kontrolü
  if (!user || (user.role !== 'ADMIN' && user.role !== 'CASHIER')) {
    return (
      <div className="unauthorized-message">
        ⛔ Bu sayfayı görüntüleme yetkiniz yok.
      </div>
    );
  }

  // Tarih formatla
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="home-health-page">
      <div className="page-header">
        <h1>🏠 Evde Sağlık Talepleri</h1>
        <p>Hastaların evde sağlık hizmeti taleplerini görüntüleyin ve yönetin.</p>
      </div>

      {/* İstatistikler */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card pending">
            <div className="stat-number">{stats.pending || 0}</div>
            <div className="stat-label">Beklemede</div>
          </div>
          <div className="stat-card completed">
            <div className="stat-number">{stats.approved || 0}</div>
            <div className="stat-label">Onaylandı</div>
          </div>
          <div className="stat-card rejected">
            <div className="stat-number">{stats.rejected || 0}</div>
            <div className="stat-label">Reddedildi</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.total || 0}</div>
            <div className="stat-label">Toplam</div>
          </div>
        </div>
      )}

      {/* Filtreler */}
      <div className="filters-section">
        <label htmlFor="statusFilter">Durum Filtresi:</label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Tümü</option>
          <option value="PENDING">Beklemede</option>
          <option value="APPROVED">Onaylandı</option>
          <option value="REJECTED">Reddedildi</option>
        </select>
        <button className="refresh-btn" onClick={fetchRequests}>
          🔄 Yenile
        </button>
      </div>

      {/* Yükleniyor */}
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Talepler yükleniyor...</p>
        </div>
      )}

      {/* Hata */}
      {error && <div className="error-message">{error}</div>}

      {/* Talepler Tablosu */}
      {!loading && !error && (
        <div className="requests-table-container">
          {requests.length === 0 ? (
            <div className="no-requests">
              <p>📋 Henüz talep bulunmuyor.</p>
            </div>
          ) : (
            <table className="requests-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ad Soyad</th>
                  <th>Telefon</th>
                  <th>Hizmet Türü</th>
                  <th>Tarih</th>
                  <th>Durum</th>
                  <th>Başvuru Tarihi</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => {
                  const statusConfig = STATUS_CONFIG[req.status] || { label: req.status, color: '#666', bgColor: '#f5f5f5' };
                  return (
                    <tr key={req.id}>
                      <td>#{req.id}</td>
                      <td>{req.fullName}</td>
                      <td>{req.phoneNumber}</td>
                      <td>{req.serviceType}</td>
                      <td>{req.preferredDate || '-'}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ color: statusConfig.color, backgroundColor: statusConfig.bgColor }}
                        >
                          {statusConfig.label}
                        </span>
                      </td>
                      <td>{formatDate(req.createdAt)}</td>
                      <td>
                        <button 
                          className="view-btn"
                          onClick={() => setSelectedRequest(req)}
                        >
                          👁️ Görüntüle
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Detay Modal */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Talep Detayı #{selectedRequest.id}</h2>
              <button className="modal-close" onClick={() => setSelectedRequest(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Ad Soyad:</label>
                  <span>{selectedRequest.fullName}</span>
                </div>
                <div className="detail-item">
                  <label>TC Kimlik No:</label>
                  <span>{selectedRequest.tckn}</span>
                </div>
                <div className="detail-item">
                  <label>Telefon:</label>
                  <span>{selectedRequest.phoneNumber}</span>
                </div>
                <div className="detail-item">
                  <label>E-posta:</label>
                  <span>{selectedRequest.email || '-'}</span>
                </div>
                <div className="detail-item full-width">
                  <label>Adres:</label>
                  <span>{selectedRequest.address}</span>
                </div>
                <div className="detail-item">
                  <label>Hizmet Türü:</label>
                  <span>{selectedRequest.serviceType}</span>
                </div>
                <div className="detail-item">
                  <label>Tercih Edilen Tarih:</label>
                  <span>{selectedRequest.preferredDate || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Tercih Edilen Saat:</label>
                  <span>{selectedRequest.preferredTime || '-'}</span>
                </div>
                <div className="detail-item">
                  <label>Durum:</label>
                  <span 
                    className="status-badge"
                    style={{ 
                      color: STATUS_CONFIG[selectedRequest.status]?.color, 
                      backgroundColor: STATUS_CONFIG[selectedRequest.status]?.bgColor 
                    }}
                  >
                    {STATUS_CONFIG[selectedRequest.status]?.label || selectedRequest.status}
                  </span>
                </div>
                {selectedRequest.notes && (
                  <div className="detail-item full-width">
                    <label>Hasta Notları:</label>
                    <span>{selectedRequest.notes}</span>
                  </div>
                )}
                {selectedRequest.approvalNote && (
                  <div className="detail-item full-width">
                    <label>Onay/Red Notu:</label>
                    <span>{selectedRequest.approvalNote}</span>
                  </div>
                )}
              </div>

              {/* Onay işlemleri - sadece PENDING durumunda Admin veya Cashier için */}
              {canApprove && selectedRequest.status === 'PENDING' && (
                <div className="action-section">
                  <h3>İşlemler</h3>
                  <textarea
                    placeholder="Not ekle (opsiyonel)"
                    value={actionNote}
                    onChange={(e) => setActionNote(e.target.value)}
                    rows={3}
                  />
                  <div className="action-buttons">
                    <button 
                      className="approve-btn"
                      onClick={handleApprove}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'İşleniyor...' : '✓ Onayla'}
                    </button>
                    <button 
                      className="reject-btn"
                      onClick={handleReject}
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'İşleniyor...' : '✕ Reddet'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
