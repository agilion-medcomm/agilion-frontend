import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
const BaseURL = `${API_BASE}/api/v1`;

export default function LaborantDashboard() {
  const navigate = useNavigate();
  const { user, token } = usePersonnelAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState('requests'); // 'requests', 'direct', or 'my-uploads'

  // Lab Requests tab state
  const [labRequests, setLabRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [requestsMessage, setRequestsMessage] = useState({ type: '', text: '' });
  const [claimingId, setClaimingId] = useState(null);

  // My Uploads tab state
  const [myUploads, setMyUploads] = useState([]);
  const [uploadsLoading, setUploadsLoading] = useState(false);
  const [uploadsMessage, setUploadsMessage] = useState({ type: '', text: '' });

  // Direct Upload tab state
  const [patientTckn, setPatientTckn] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [testName, setTestName] = useState('');
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [foundPatient, setFoundPatient] = useState(null);

  if (!user) {
    navigate('/personelLogin');
    return null;
  }

  // Fetch lab requests on component mount
  useEffect(() => {
    fetchLabRequests();
  }, []);

  // Fetch uploads when tab changes
  useEffect(() => {
    if (activeTab === 'my-uploads') {
      fetchMyUploads();
    }
  }, [activeTab]);

  // Fetch lab requests for this laborant
  const fetchLabRequests = async () => {
    try {
      setRequestsLoading(true);
      const response = await axios.get(`${BaseURL}/lab-requests`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          status: 'PENDING,ASSIGNED'
        }
      });
      setLabRequests(response.data.data || []);
      setRequestsMessage({ type: '', text: '' });
    } catch (error) {
      setRequestsMessage({
        type: 'error',
        text: error.response?.data?.message || 'Talepler yüklenemedi'
      });
      setLabRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  };

  // Fetch my uploads
  const fetchMyUploads = async () => {
    try {
      setUploadsLoading(true);
      const response = await axios.get(`${BaseURL}/medical-files/my-uploads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyUploads(response.data.data || []);
      setUploadsMessage({ type: '', text: '' });
    } catch (error) {
      setUploadsMessage({
        type: 'error',
        text: error.response?.data?.message || 'Dosyalar yüklenemedi'
      });
      setMyUploads([]);
    } finally {
      setUploadsLoading(false);
    }
  };

  // Claim lab request
  const handleClaimRequest = async (requestId) => {
    try {
      setClaimingId(requestId);
      const response = await axios.put(
        `${BaseURL}/lab-requests/${requestId}/claim`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update request status
      setLabRequests(labRequests.map(req =>
        req.id === requestId ? { ...req, status: 'ASSIGNED', assigneeLaborantId: user.laborantId } : req
      ));
      setRequestsMessage({ type: 'success', text: 'Talep başarıyla alındı!' });

      // Auto-select for upload
      setSelectedRequest(labRequests.find(r => r.id === requestId));
    } catch (error) {
      setRequestsMessage({
        type: 'error',
        text: error.response?.data?.message || 'Talep alınamadı'
      });
    } finally {
      setClaimingId(null);
    }
  };

  // Upload file for lab request
  const handleUploadForRequest = async (e) => {
    e.preventDefault();

    if (!selectedFile || !selectedRequest) {
      setRequestsMessage({ type: 'error', text: 'Dosya seçimi zorunludur' });
      return;
    }

    setRequestsLoading(true);
    setRequestsMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('patientId', selectedRequest.patient.id);
      formData.append('testName', selectedRequest.fileTitle);
      formData.append('testDate', new Date().toISOString().split('T')[0]);
      formData.append('description', selectedRequest.notes || '');
      formData.append('requestId', selectedRequest.id);

      const response = await axios.post(`${BaseURL}/medical-files`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setRequestsMessage({ type: 'success', text: 'Dosya başarıyla yüklendi ve talep tamamlandı!' });
      setSelectedFile(null);
      setSelectedRequest(null);

      // Refresh requests
      setTimeout(() => fetchLabRequests(), 1500);
    } catch (error) {
      setRequestsMessage({
        type: 'error',
        text: error.response?.data?.message || 'Dosya yüklenemedi'
      });
    } finally {
      setRequestsLoading(false);
    }
  };

  // TCNO ile hasta ara (Direct Upload)
  const handleSearchPatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.get(`${BaseURL}/patients/search`, {
        params: { tckn: patientTckn },
        headers: { Authorization: `Bearer ${token}` }
      });

      setFoundPatient(response.data.data);
      setMessage({ type: 'success', text: 'Hasta bulundu!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Hasta bulunamadı' });
      setFoundPatient(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFile = async (e) => {
    e.preventDefault();

    if (!selectedFile || !testName || !foundPatient) {
      setMessage({ type: 'error', text: 'Tüm alanlar zorunludur' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('patientId', foundPatient.patientId);
      formData.append('testName', testName);
      formData.append('testDate', testDate);
      formData.append('description', description);
      // NOT including requestId for direct upload

      const response = await axios.post(`${BaseURL}/medical-files`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setMessage({ type: 'success', text: 'Dosya başarıyla yüklendi!' });
      setSelectedFile(null);
      setTestName('');
      setDescription('');

      setTimeout(() => {
        setFoundPatient(null);
        setPatientTckn('');
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Dosya yüklenemedi' });
    } finally {
      setLoading(false);
    }
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
        <h1 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700 }}>🧪 Laborant Paneli</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>Hoş geldiniz, {user.firstName} {user.lastName}</p>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '30px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={() => setActiveTab('requests')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'requests' ? '#667eea' : '#e2e8f0',
            color: activeTab === 'requests' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
        >
          📋 Doktor Talepleri ({labRequests.filter(r => r.status === 'PENDING').length})
        </button>
        <button
          onClick={() => setActiveTab('direct')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'direct' ? '#667eea' : '#e2e8f0',
            color: activeTab === 'direct' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
        >
          📤 Doğrudan Yükle
        </button>
        <button
          onClick={() => setActiveTab('my-uploads')}
          style={{
            padding: '12px 24px',
            background: activeTab === 'my-uploads' ? '#667eea' : '#e2e8f0',
            color: activeTab === 'my-uploads' ? 'white' : '#374151',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
            transition: 'all 0.2s'
          }}
        >
          📁 Yüklediğim Dosyalar ({myUploads.length})
        </button>
      </div>

      {/* Main Content Container */}
      <div style={{ maxWidth: '700px' }}>
        {/* ============ LAB REQUESTS TAB ============ */}
        {activeTab === 'requests' && (
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
            {!requestsLoading && labRequests.length === 0 && (
              <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <p style={{ color: '#666', margin: '0 0 16px 0' }}>📭 Şu anda size atanan talep yok</p>
                <button
                  onClick={fetchLabRequests}
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
                  Yenile
                </button>
              </div>
            )}

            {/* Requests List */}
            {!requestsLoading && labRequests.length > 0 && !selectedRequest && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {labRequests.map(req => (
                  <div
                    key={req.id}
                    style={{
                      background: 'white',
                      padding: '16px',
                      borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      border: `2px solid ${req.status === 'PENDING' ? '#fbbf24' : '#60a5fa'}`
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: '0 0 4px 0', fontWeight: 700, color: '#1e293b' }}>
                          {req.fileTitle}
                        </p>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#666' }}>
                          👤 {req.patient.firstName} {req.patient.lastName}
                        </p>
                        <p style={{ margin: '0 0 4px 0', fontSize: '13px', color: '#666' }}>
                          📝 {req.notes || 'Not yok'}
                        </p>
                        {req.assigneeLaborantId && (
                          <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#059669', fontWeight: 600 }}>
                            ✓ Size atanmış
                          </p>
                        )}
                      </div>
                      <div style={{
                        background: req.status === 'PENDING' ? '#fef3c7' : '#dbeafe',
                        color: req.status === 'PENDING' ? '#92400e' : '#0c4a6e',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: 600,
                        whiteSpace: 'nowrap'
                      }}>
                        {req.status === 'PENDING' ? 'Beklemede' : 'Atanmış'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {req.status === 'PENDING' && !req.assigneeLaborantId && (
                        <button
                          onClick={() => handleClaimRequest(req.id)}
                          disabled={claimingId === req.id}
                          style={{
                            flex: 1,
                            padding: '10px',
                            background: claimingId === req.id ? '#cbd5e1' : '#fbbf24',
                            color: '#78350f',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: claimingId === req.id ? 'not-allowed' : 'pointer',
                            fontWeight: 600,
                            fontSize: '13px'
                          }}
                        >
                          {claimingId === req.id ? 'Alınıyor...' : 'Talep Al'}
                        </button>
                      )}
                      {(req.status === 'ASSIGNED' || (req.status === 'PENDING' && req.assigneeLaborantId)) && (
                        <button
                          onClick={() => setSelectedRequest(req)}
                          style={{
                            flex: 1,
                            padding: '10px',
                            background: '#667eea',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: 600,
                            fontSize: '13px'
                          }}
                        >
                          Dosya Yükle
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* File Upload for Selected Request */}
            {selectedRequest && (
              <div style={{
                background: 'white',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '2px solid #667eea'
              }}>
                <button
                  onClick={() => setSelectedRequest(null)}
                  style={{
                    marginBottom: '16px',
                    background: 'none',
                    border: 'none',
                    color: '#667eea',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '13px'
                  }}
                >
                  ← Geri Dön
                </button>

                <h3 style={{ margin: '0 0 8px 0', color: '#1e293b', fontSize: '16px' }}>
                  {selectedRequest.fileTitle}
                </h3>
                <p style={{ margin: '0 0 16px 0', color: '#666', fontSize: '13px' }}>
                  Hasta: {selectedRequest.patient.firstName} {selectedRequest.patient.lastName}
                </p>

                <form onSubmit={handleUploadForRequest}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151', fontSize: '13px' }}>
                      Dosya Seçin (PDF, JPG, PNG)
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      accept=".pdf,.jpg,.jpeg,.png"
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
                    {selectedFile && (
                      <p style={{ margin: '8px 0 0 0', color: '#16a34a', fontSize: '13px' }}>
                        ✓ {selectedFile.name}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={requestsLoading || !selectedFile}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: requestsLoading || !selectedFile ? '#cbd5e1' : '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: requestsLoading || !selectedFile ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      fontSize: '14px'
                    }}
                  >
                    {requestsLoading ? '✓ Yükleniyor...' : '✓ Dosyayı Yükle ve Talebi Tamamla'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ============ DIRECT UPLOAD TAB ============ */}
        {activeTab === 'direct' && (
          <div>
            {message.text && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '30px',
                backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
                color: message.type === 'error' ? '#991b1b' : '#166534',
                border: `1px solid ${message.type === 'error' ? '#f87171' : '#86efac'}`
              }}>
                {message.text}
              </div>
            )}

            {/* Step 1: Search Patient */}
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              marginBottom: '30px'
            }}>
              <h2 style={{ marginTop: 0, color: '#1e293b', fontSize: '18px', fontWeight: 700 }}>
                Adım 1: Hastayı Ara
              </h2>

              <form onSubmit={handleSearchPatient}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                    Hasta TC Kimlik No
                  </label>
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
                    required
                    disabled={!!foundPatient}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      background: foundPatient ? '#f3f4f6' : 'white'
                    }}
                  />
                </div>

                {!foundPatient && (
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: loading ? '#cbd5e1' : '#667eea',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.3s'
                    }}
                  >
                    {loading ? 'Aranıyor...' : 'Hastayı Ara'}
                  </button>
                )}
              </form>

              {foundPatient && (
                <div style={{
                  background: '#f0f9ff',
                  padding: '16px',
                  borderRadius: '8px',
                  marginTop: '16px',
                  border: '1px solid #bfdbfe'
                }}>
                  <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#1e40af' }}>
                    ✓ Hasta bulundu: {foundPatient.firstName} {foundPatient.lastName}
                  </p>
                  <p style={{ margin: 0, color: '#1e40af', fontSize: '14px' }}>
                    Email: {foundPatient.email}
                  </p>
                  <button
                    onClick={() => {
                      setFoundPatient(null);
                      setPatientTckn('');
                    }}
                    style={{
                      marginTop: '12px',
                      background: 'none',
                      border: '1px solid #93c5fd',
                      color: '#1e40af',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: 600
                    }}
                  >
                    Farklı hasta ara
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: Upload File */}
            {foundPatient && (
              <div style={{
                background: 'white',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h2 style={{ marginTop: 0, color: '#1e293b', fontSize: '18px', fontWeight: 700 }}>
                  Adım 2: Tıbbi Dosya Yükle
                </h2>

                <form onSubmit={handleUploadFile}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                      Test Adı
                    </label>
                    <input
                      type="text"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
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
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                      Test Tarihi
                    </label>
                    <input
                      type="date"
                      value={testDate}
                      onChange={(e) => setTestDate(e.target.value)}
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
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                      Dosya (PDF, JPG, PNG)
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                      accept=".pdf,.jpg,.jpeg,.png"
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
                    {selectedFile && (
                      <p style={{ margin: '8px 0 0 0', color: '#16a34a', fontSize: '13px' }}>
                        ✓ Seçilen dosya: {selectedFile.name}
                      </p>
                    )}
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
                      Açıklamalar (İsteğe bağlı)
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Test hakkında ek bilgiler..."
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

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: loading ? '#cbd5e1' : '#16a34a',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: 600,
                      fontSize: '15px',
                      transition: 'all 0.3s'
                    }}
                  >
                    {loading ? 'Yükleniyor...' : '✓ Dosyayı Yükle'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* MY UPLOADS TAB */}
        {activeTab === 'my-uploads' && (
          <div>
            {uploadsMessage.text && (
              <div style={{
                padding: '12px 16px',
                marginBottom: '24px',
                borderRadius: '8px',
                background: uploadsMessage.type === 'error' ? '#fee2e2' : '#dcfce7',
                color: uploadsMessage.type === 'error' ? '#991b1b' : '#166534',
                border: `1px solid ${uploadsMessage.type === 'error' ? '#fecaca' : '#86efac'}`
              }}>
                {uploadsMessage.text}
              </div>
            )}

            {uploadsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <p>Yükleniyor...</p>
              </div>
            ) : myUploads.length === 0 ? (
              <div style={{
                background: 'white',
                padding: '60px 20px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <p style={{ fontSize: '16px', marginBottom: '8px', color: '#1f2937' }}>
                  📭 Dosya Yok
                </p>
                <p style={{ color: '#94a3b8' }}>
                  Henüz dosya yüklemediğiniz
                </p>
              </div>
            ) : (
              <div style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  padding: '16px 24px',
                  background: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#1f2937' }}>
                    📁 Yüklediğim Dosyalar ({myUploads.length})
                  </h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>
                        Test Adı
                      </th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>
                        Hasta
                      </th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>
                        Talep Eden Doktor
                      </th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>
                        Yükleme Tarihi
                      </th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>
                        Durum
                      </th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#374151' }}>
                        İşlem
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {myUploads.map((file) => (
                      <tr key={file.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: '16px', color: '#1f2937', fontWeight: 600 }}>
                          {file.testName}
                        </td>
                        <td style={{ padding: '16px', color: '#374151' }}>
                          {file.medicalFileRequest?.patient?.user?.firstName} {file.medicalFileRequest?.patient?.user?.lastName}
                        </td>
                        <td style={{ padding: '16px', color: '#374151' }}>
                          Dr. {file.medicalFileRequest?.createdByUser?.firstName} {file.medicalFileRequest?.createdByUser?.lastName}
                        </td>
                        <td style={{ padding: '16px', color: '#374151' }}>
                          {new Date(file.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <span style={{
                            background: '#dcfce7',
                            color: '#166534',
                            padding: '4px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600
                          }}>
                            ✓ Tamamlandı
                          </span>
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <button
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = `${BaseURL}/medical-files/${file.id}/download`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            style={{
                              padding: '6px 12px',
                              background: '#10b981',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 600
                            }}
                          >
                            📥 İndir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
