import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
const BaseURL = `${API_BASE}/api/v1`;

export default function DoctorLabRequests() {
  const navigate = useNavigate();
  const { user, token } = usePersonnelAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'create'

  // List tab state
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all'); // all, PENDING, ASSIGNED, COMPLETED, CANCELED
  const [requestsMessage, setRequestsMessage] = useState({ type: '', text: '' });

  // Create tab state
  const [patientTckn, setPatientTckn] = useState('');
  const [foundPatient, setFoundPatient] = useState(null);
  const [fileTitle, setFileTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedLaborant, setSelectedLaborant] = useState('');
  const [laborants, setLaborants] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [createMessage, setCreateMessage] = useState({ type: '', text: '' });

  if (!user) {
    navigate('/personelLogin');
    return null;
  }

  // Fetch lab requests on component mount
  useEffect(() => {
    fetchRequests();
    fetchLaborants();
  }, []);

  // Fetch lab requests
  const fetchRequests = async () => {
    try {
      setRequestsLoading(true);
      const response = await axios.get(`${BaseURL}/lab-requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data.data || []);
      setRequestsMessage({ type: '', text: '' });
    } catch (error) {
      setRequestsMessage({
        type: 'error',
        text: error.response?.data?.message || 'Talepler yüklenemedi'
      });
      setRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  };

  // Fetch available laborants
  const fetchLaborants = async () => {
    try {
      const response = await axios.get(`${BaseURL}/personnel?role=LABORANT`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Laborants response:', response.data);
      setLaborants(response.data.data || []);
      console.log('Laborants set:', response.data.data || []);
    } catch (error) {
      console.error('Laborants fetch error:', error);
      console.error('Error response:', error.response?.data);
      setLaborants([]);
    }
  };

  // Search patient by TCKN
  const handleSearchPatient = async (e) => {
    e.preventDefault();
    try {
      setCreateLoading(true);
      const response = await axios.get(`${BaseURL}/patients/search`, {
        params: { tckn: patientTckn },
        headers: { Authorization: `Bearer ${token}` }
      });
      setFoundPatient(response.data.data);
      setCreateMessage({ type: 'success', text: 'Hasta bulundu!' });
    } catch (error) {
      setCreateMessage({
        type: 'error',
        text: error.response?.data?.message || 'Hasta bulunamadı'
      });
      setFoundPatient(null);
    } finally {
      setCreateLoading(false);
    }
  };

  // Create lab request
  const handleCreateRequest = async (e) => {
    e.preventDefault();

    if (!foundPatient || !fileTitle) {
      setCreateMessage({ type: 'error', text: 'Hasta ve talep başlığı zorunludur' });
      return;
    }

    setCreateLoading(true);
    setCreateMessage({ type: '', text: '' });

    try {
      const payload = {
        patientId: parseInt(foundPatient.patientId),
        fileTitle,
        notes: notes || null,
        assigneeLaborantId: selectedLaborant && selectedLaborant.trim() ? parseInt(selectedLaborant) : null
      };

      const response = await axios.post(`${BaseURL}/lab-requests`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCreateMessage({ type: 'success', text: 'Talep başarıyla oluşturuldu!' });

      // Reset form
      setTimeout(() => {
        setPatientTckn('');
        setFoundPatient(null);
        setFileTitle('');
        setNotes('');
        setSelectedLaborant('');
        setCreateMessage({ type: '', text: '' });
        setActiveTab('list');
        fetchRequests();
      }, 1500);
    } catch (error) {
      setCreateMessage({
        type: 'error',
        text: error.response?.data?.message || 'Talep oluşturulamadı'
      });
    } finally {
      setCreateLoading(false);
    }
  };

  // Assign request to laborant
  const handleAssignRequest = async (requestId, laborantId) => {
    try {
      setRequestsLoading(true);
      const response = await axios.put(
        `${BaseURL}/lab-requests/${requestId}/assign`,
        { assigneeLaborantId: parseInt(laborantId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequestsMessage({ type: 'success', text: 'Talep atandı!' });
      fetchRequests();
    } catch (error) {
      setRequestsMessage({
        type: 'error',
        text: error.response?.data?.message || 'Talep atanamadı'
      });
    } finally {
      setRequestsLoading(false);
    }
  };

  // Cancel request
  const handleCancelRequest = async (requestId) => {
    if (!confirm('Bu talebi iptal etmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setRequestsLoading(true);
      const response = await axios.post(
        `${BaseURL}/lab-requests/${requestId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRequestsMessage({ type: 'success', text: 'Talep iptal edildi!' });
      fetchRequests();
    } catch (error) {
      setRequestsMessage({
        type: 'error',
        text: error.response?.data?.message || 'Talep iptal edilemedi'
      });
    } finally {
      setRequestsLoading(false);
    }
  };

  // Filter requests based on status
  const filteredRequests = filterStatus === 'all'
    ? requests
    : requests.filter(r => r.status === filterStatus);

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': { bg: '#fef3c7', text: '#92400e', label: 'Beklemede' },
      'ASSIGNED': { bg: '#dbeafe', text: '#0c4a6e', label: 'Atanmış' },
      'COMPLETED': { bg: '#dcfce7', text: '#166534', label: 'Tamamlandı' },
      'CANCELED': { bg: '#fee2e2', text: '#991b1b', label: 'İptal Edildi' }
    };
    return colors[status] || colors['PENDING'];
  };

  return (
    <div style={{ padding: '20px', background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700 }}>📋 Laborant Talepleri</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>Tıbbi dosya talepleri oluşturun ve yönetin</p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('list')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'list' ? '#667eea' : '#e2e8f0',
            color: activeTab === 'list' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
        >
          📊 Talepler ({filteredRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('create')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'create' ? '#667eea' : '#e2e8f0',
            color: activeTab === 'create' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
        >
          ➕ Yeni Talep Oluştur
        </button>
      </div>

      {/* Main Content Container */}
      <div style={{ maxWidth: '900px' }}>
        {/* ============ LIST TAB ============ */}
        {activeTab === 'list' && (
          <div>
            {/* Messages */}
            {requestsMessage.text && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                backgroundColor: requestsMessage.type === 'error' ? '#fee2e2' : '#dcfce7',
                color: requestsMessage.type === 'error' ? '#991b1b' : '#166534',
                border: `1px solid ${requestsMessage.type === 'error' ? '#f87171' : '#86efac'}`
              }}>
                {requestsMessage.text}
              </div>
            )}

            {/* Status Filter */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '20px',
              flexWrap: 'wrap'
            }}>
              {['all', 'PENDING', 'ASSIGNED', 'COMPLETED', 'CANCELED'].map(status => {
                const statusLabel = {
                  'all': 'Tümü',
                  'PENDING': 'Beklemede',
                  'ASSIGNED': 'Atanmış',
                  'COMPLETED': 'Tamamlandı',
                  'CANCELED': 'İptal'
                }[status];

                return (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    style={{
                      padding: '8px 16px',
                      background: filterStatus === status ? '#667eea' : '#e2e8f0',
                      color: filterStatus === status ? 'white' : '#374151',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: '13px',
                      transition: 'all 0.2s'
                    }}
                  >
                    {statusLabel}
                  </button>
                );
              })}
            </div>

            {/* Loading State */}
            {requestsLoading && (
              <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <p style={{ color: '#666' }}>Talepler yükleniyor...</p>
              </div>
            )}

            {/* No Requests State */}
            {!requestsLoading && filteredRequests.length === 0 && (
              <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <p style={{ color: '#666', marginBottom: '16px' }}>📭 Şu anda talep yok</p>
                <button
                  onClick={() => setActiveTab('create')}
                  style={{
                    padding: '10px 20px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Yeni Talep Oluştur
                </button>
              </div>
            )}

            {/* Requests List */}
            {!requestsLoading && filteredRequests.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredRequests.map(req => {
                  const statusInfo = getStatusColor(req.status);
                  return (
                    <div
                      key={req.id}
                      style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: `2px solid ${statusInfo.bg}`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: '0 0 8px 0', fontWeight: 700, color: '#1e293b', fontSize: '16px' }}>
                            {req.fileTitle}
                          </p>
                          <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#666' }}>
                            👤 Hasta: {req.patient.firstName} {req.patient.lastName}
                          </p>
                          <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#666' }}>
                            📝 {req.notes || 'Not yok'}
                          </p>
                          {req.assigneeLaborant && (
                            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#059669', fontWeight: 600 }}>
                              ✓ Atanan: {req.assigneeLaborant.user.firstName} {req.assigneeLaborant.user.lastName}
                            </p>
                          )}
                          {req.medicalFile && (
                            <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#0369a1', fontWeight: 600 }}>
                              📄 Dosya: {req.medicalFile.testName} ({new Date(req.medicalFile.createdAt).toLocaleDateString('tr-TR')})
                            </p>
                          )}
                          <p style={{ margin: '0 0 0 0', fontSize: '12px', color: '#999' }}>
                            📅 {new Date(req.requestedAt).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                        <div style={{
                          background: statusInfo.bg,
                          color: statusInfo.text,
                          padding: '6px 14px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: 600,
                          whiteSpace: 'nowrap'
                        }}>
                          {statusInfo.label}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {req.status === 'PENDING' && !req.assigneeLaborantId && (
                          <>
                            <select
                              value={selectedLaborant}
                              onChange={(e) => setSelectedLaborant(e.target.value)}
                              style={{
                                padding: '8px 12px',
                                borderRadius: '6px',
                                border: '1px solid #d1d5db',
                                fontSize: '13px',
                                minWidth: '200px'
                              }}
                            >
                              <option value="">Laborant Seçin...</option>
                              {laborants.map(lab => (
                                <option key={lab.laborantId || lab.id} value={lab.laborantId || lab.id}>
                                  {lab.firstName} {lab.lastName}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => {
                                if (selectedLaborant) {
                                  handleAssignRequest(req.id, selectedLaborant);
                                  setSelectedLaborant('');
                                }
                              }}
                              style={{
                                padding: '8px 16px',
                                background: '#667eea',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 600,
                                fontSize: '13px'
                              }}
                            >
                              Ata
                            </button>
                          </>
                        )}

                        {req.status !== 'COMPLETED' && req.status !== 'CANCELED' && (
                          <button
                            onClick={() => handleCancelRequest(req.id)}
                            style={{
                              padding: '8px 16px',
                              background: '#f87171',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: 600,
                              fontSize: '13px'
                            }}
                          >
                            İptal Et
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============ CREATE TAB ============ */}
        {activeTab === 'create' && (
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <h2 style={{ marginTop: 0, color: '#1e293b', fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>
              Yeni Laborant Talebi Oluştur
            </h2>

            {createMessage.text && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '20px',
                backgroundColor: createMessage.type === 'error' ? '#fee2e2' : '#dcfce7',
                color: createMessage.type === 'error' ? '#991b1b' : '#166534',
                border: `1px solid ${createMessage.type === 'error' ? '#f87171' : '#86efac'}`
              }}>
                {createMessage.text}
              </div>
            )}

            {/* Step 1: Search Patient */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', color: '#374151', fontSize: '14px', fontWeight: 700 }}>
                Adım 1: Hastayı Seçin
              </h3>

              <form onSubmit={handleSearchPatient} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={patientTckn}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 11) {
                      setPatientTckn(value);
                    }
                  }}
                  placeholder="Hasta TCKN'sini girin"
                  maxLength={11}
                  disabled={!!foundPatient}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '14px',
                    background: foundPatient ? '#f3f4f6' : 'white'
                  }}
                />
                {!foundPatient && (
                  <button
                    type="submit"
                    disabled={createLoading}
                    style={{
                      padding: '12px 24px',
                      background: createLoading ? '#cbd5e1' : '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: createLoading ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      fontSize: '13px'
                    }}
                  >
                    {createLoading ? 'Aranıyor...' : 'Ara'}
                  </button>
                )}
              </form>

              {foundPatient && (
                <div style={{
                  background: '#f0f9ff',
                  padding: '12px',
                  borderRadius: '8px',
                  marginTop: '12px',
                  border: '1px solid #bfdbfe',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontWeight: 600, color: '#1e40af', fontSize: '14px' }}>
                      ✓ {foundPatient.firstName} {foundPatient.lastName}
                    </p>
                    <p style={{ margin: 0, color: '#1e40af', fontSize: '12px' }}>
                      {foundPatient.email}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFoundPatient(null);
                      setPatientTckn('');
                    }}
                    style={{
                      background: 'none',
                      border: '1px solid #93c5fd',
                      color: '#1e40af',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600
                    }}
                  >
                    Değiştir
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: Fill Request Details */}
            {foundPatient && (
              <form onSubmit={handleCreateRequest}>
                <h3 style={{ margin: '0 0 16px 0', color: '#374151', fontSize: '14px', fontWeight: 700 }}>
                  Adım 2: Talep Bilgilerini Girin
                </h3>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151', fontSize: '13px' }}>
                    Talep Başlığı *
                  </label>
                  <input
                    type="text"
                    value={fileTitle}
                    onChange={(e) => setFileTitle(e.target.value)}
                    placeholder="örn: Hemogram, Biokimya Paneli"
                    required
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151', fontSize: '13px' }}>
                    Notlar (İsteğe bağlı)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Talep hakkında ek bilgiler..."
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151', fontSize: '13px' }}>
                    Laborant Ata (İsteğe bağlı)
                  </label>
                  <select
                    value={selectedLaborant}
                    onChange={(e) => setSelectedLaborant(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Laborant Seçin (Daha sonra atayabilirsiniz)</option>
                    {laborants.map(lab => (
                      <option key={lab.laborantId || lab.id} value={lab.laborantId || lab.id}>
                        {lab.firstName} {lab.lastName}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={createLoading}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: createLoading ? '#cbd5e1' : '#16a34a',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: createLoading ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    fontSize: '14px'
                  }}
                >
                  {createLoading ? '✓ Oluşturuluyor...' : '✓ Talep Oluştur'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
