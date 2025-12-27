import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SharedDashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
const BaseURL = `${API_BASE}/api/v1`;

export default function ContactFormsPage() {
  const [contactIssues, setContactIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Reply Modal
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  useEffect(() => {
    fetchContactIssues();
  }, []);

  const fetchContactIssues = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('personnelToken');
      const response = await axios.get(`${BaseURL}/contact`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContactIssues(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error('İletişim formları alınamadı:', error);
      setContactIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const openReplyModal = (issue) => {
    setSelectedIssue(issue);
    setReplyText('');
    setReplyModalOpen(true);
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!selectedIssue || !replyText.trim()) return;

    setReplyLoading(true);
    try {
      const token = localStorage.getItem('personnelToken');
      console.log('Reply request:', {
        url: `${BaseURL}/contact/${selectedIssue.id}/reply`,
        token: token ? 'exists' : 'missing',
        body: { replyMessage: replyText }
      });

      const response = await axios.post(`${BaseURL}/contact/${selectedIssue.id}/reply`,
        { replyMessage: replyText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Reply response:', response.data);
      setMessage({ type: 'success', text: 'Yanıt başarıyla gönderildi!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      setReplyModalOpen(false);
      setSelectedIssue(null);
      setReplyText('');
      fetchContactIssues();
    } catch (error) {
      console.error('Reply error:', error.response?.data || error.message);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Yanıt gönderilemedi.' });
    } finally {
      setReplyLoading(false);
    }
  };

  const pendingCount = contactIssues.filter(i => i.status === 'PENDING').length;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">İletişim Formları</h1>
          <p className="page-subtitle">Ziyaretçilerden gelen mesajları yönetin</p>
        </div>
        <div style={{
          background: pendingCount > 0 ? '#fef3c7' : '#dcfce7',
          padding: '8px 16px',
          borderRadius: '8px',
          fontWeight: 600,
          color: pendingCount > 0 ? '#92400e' : '#166534'
        }}>
          {pendingCount > 0 ? `${pendingCount} Bekleyen Mesaj` : 'Tüm mesajlar yanıtlandı ✓'}
        </div>
      </div>

      {message.text && (
        <div style={{
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
          color: message.type === 'error' ? '#991b1b' : '#166534',
          border: `1px solid ${message.type === 'error' ? '#f87171' : '#86efac'}`,
          fontWeight: '500'
        }}>
          {message.text}
        </div>
      )}

      <div className="table-container">
        {loading ? (
          <p style={{ padding: '40px', textAlign: 'center' }}>Yükleniyor...</p>
        ) : contactIssues.length === 0 ? (
          <div className="no-data" style={{ padding: '60px 20px' }}>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>Henüz mesaj yok</p>
            <p style={{ color: '#94a3b8' }}>Ziyaretçilerden gelen iletişim formları burada görünecek.</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Ad Soyad</th>
                <th>E-posta</th>
                <th>Telefon</th>
                <th>Konu</th>
                <th>Mesaj</th>
                <th style={{ textAlign: 'center' }}>Durum</th>
                <th style={{ textAlign: 'center' }}>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {contactIssues.map((issue) => (
                <tr key={issue.id} style={{ opacity: issue.status === 'PENDING' ? 1 : 0.7 }}>
                  <td style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    {new Date(issue.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td style={{ fontWeight: 500 }}>{issue.name}</td>
                  <td>{issue.email}</td>
                  <td>{issue.phone}</td>
                  <td style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={issue.subject}>
                    {issue.subject}
                  </td>
                  <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={issue.message}>
                    {issue.message}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: issue.status === 'PENDING' ? '#fef3c7' : '#dcfce7',
                      color: issue.status === 'PENDING' ? '#92400e' : '#166534'
                    }}>
                      {issue.status === 'PENDING' ? 'Bekliyor' : 'Yanıtlandı'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {issue.status === 'PENDING' ? (
                      <button
                        onClick={() => openReplyModal(issue)}
                        style={{
                          background: '#2563eb',
                          color: 'white',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '0.85rem'
                        }}
                      >
                        Yanıtla
                      </button>
                    ) : (
                      <span style={{ color: '#16a34a', fontSize: '0.85rem' }}>✓ Yanıtlandı</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Reply Modal */}
      {replyModalOpen && selectedIssue && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }} onClick={() => setReplyModalOpen(false)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'slideUp 0.3s ease'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ margin: '0 0 4px 0', color: '#1e293b', fontSize: '22px', fontWeight: 700 }}>Mesaja Yanıt Ver</h2>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px' }}>Ziyaretçiye profesyonel bir yanıt gönderin</p>
              </div>
              <button
                onClick={() => setReplyModalOpen(false)}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#64748b',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#e2e8f0'}
                onMouseOut={(e) => e.target.style.background = '#f1f5f9'}
              >
                ✕
              </button>
            </div>

            {/* Original Message Info */}
            <div style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <p style={{ margin: '0 0 6px 0', color: '#64748b', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Gönderen</p>
                  <p style={{ margin: 0, color: '#1e293b', fontWeight: 600, fontSize: '16px' }}>{selectedIssue.name}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 6px 0', color: '#64748b', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>E-Posta</p>
                  <p style={{ margin: 0, color: '#1e293b', fontSize: '14px' }}>{selectedIssue.email}</p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <p style={{ margin: '0 0 6px 0', color: '#64748b', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Telefon</p>
                  <p style={{ margin: 0, color: '#1e293b', fontSize: '14px' }}>{selectedIssue.phone}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 6px 0', color: '#64748b', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Konu</p>
                  <p style={{ margin: 0, color: '#1e293b', fontWeight: 600, fontSize: '14px' }}>{selectedIssue.subject}</p>
                </div>
              </div>
            </div>

            {/* Original Message */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ margin: '0 0 12px 0', color: '#64748b', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' }}>Gelen Mesaj</p>
              <div style={{
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '10px',
                border: '2px solid #e2e8f0',
                borderLeft: '4px solid #3b82f6'
              }}>
                <p style={{
                  margin: 0,
                  color: '#334155',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {selectedIssue.message}
                </p>
              </div>
            </div>

            {/* Reply Form */}
            <form onSubmit={handleReplySubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '10px',
                  fontWeight: 700,
                  color: '#1e293b',
                  fontSize: '15px'
                }}>
                  Yanıtınız <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Ziyaretçiye profesyonel ve yardımcı bir yanıt yazın..."
                  rows="6"
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    fontSize: '14px',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                  required
                />
                <p style={{
                  margin: '8px 0 0 0',
                  color: '#94a3b8',
                  fontSize: '12px'
                }}>
                  {replyText.length} / 1000 karakter
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setReplyModalOpen(false)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0',
                    background: 'white',
                    cursor: 'pointer',
                    fontWeight: 600,
                    color: '#475569',
                    fontSize: '15px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#f1f5f9';
                    e.target.style.borderColor = '#cbd5e1';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'white';
                    e.target.style.borderColor = '#e2e8f0';
                  }}
                >
                  İptal Et
                </button>
                <button
                  type="submit"
                  disabled={replyLoading || !replyText.trim()}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '10px',
                    border: 'none',
                    background: replyLoading || !replyText.trim() ? '#cbd5e1' : '#3b82f6',
                    color: 'white',
                    cursor: replyLoading || !replyText.trim() ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: '15px',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onMouseOver={(e) => {
                    if (!replyLoading && replyText.trim()) {
                      e.target.style.background = '#2563eb';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!replyLoading && replyText.trim()) {
                      e.target.style.background = '#3b82f6';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }
                  }}
                >
                  {replyLoading ? (
                    <>
                      <span style={{ display: 'inline-block', animation: 'spin 0.8s linear infinite' }}>⟳</span>
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      ✓ Yanıt Gönder
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          <style>{`
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
