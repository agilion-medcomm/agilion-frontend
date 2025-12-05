import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';
const BaseURL = `${API_BASE}/api/v1`;

export default function LaborantDashboard() {
  const navigate = useNavigate();
  const { user, token } = usePersonnelAuth();
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

  // TCNO ile hasta ara
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
    <div style={{ padding: '20px' }}>
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

      {/* Main Content */}
      <div style={{ maxWidth: '600px' }}>
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
                onChange={(e) => setPatientTckn(e.target.value)}
                placeholder="Hasta TCKN'sini girin"
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
                  fontSize: '13px'
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
    </div>
  );
}
