import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SharedDashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
const BaseURL = `${API_BASE}/api/v1`;

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [expandedTab, setExpandedTab] = useState(null); // 'appointments' or 'labResults'
  const [appointments, setAppointments] = useState({});
  const [loadingAppointments, setLoadingAppointments] = useState({});
  const token = localStorage.getItem('personnelToken');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    
    try {
      const res = await axios.get(`${BaseURL}/patients`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPatients(res.data?.users || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async (patientId) => {
    if (appointments[patientId]) {
      return;
    }

    setLoadingAppointments(prev => ({ ...prev, [patientId]: true }));
    try {
      const res = await axios.get(`${BaseURL}/appointments?list=true&patientId=${patientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(prev => ({ ...prev, [patientId]: res.data?.data || [] }));
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments(prev => ({ ...prev, [patientId]: [] }));
    } finally {
      setLoadingAppointments(prev => ({ ...prev, [patientId]: false }));
    }
  };

  const handleExpandRow = (patientId, tab) => {
    if (expandedPatient === patientId && expandedTab === tab) {
      setExpandedPatient(null);
      setExpandedTab(null);
    } else {
      setExpandedPatient(patientId);
      setExpandedTab(tab);
      if (tab === 'appointments') {
        fetchAppointments(patientId);
      }
    }
  };

  const filteredPatients = patients.filter(p =>
    !searchQuery || 
    p.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tckn?.includes(searchQuery) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="page-loading"><div className="spinner"></div><p>Loading...</p></div>;

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Patients</h1>
          <p className="page-subtitle">View all registered patients</p>
        </div>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search patients by name, TCKN, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>TCKN</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date of Birth</th>
              <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length === 0 ? (
              <tr><td colSpan="6" className="no-data">No patients found</td></tr>
            ) : (
              filteredPatients.map(patient => (
                <React.Fragment key={patient.id}>
                  <tr>
                    <td>
                      <div className="name-cell">
                        <div className="avatar">{patient.firstName?.charAt(0)}{patient.lastName?.charAt(0)}</div>
                        <span>{patient.firstName} {patient.lastName}</span>
                      </div>
                    </td>
                    <td>{patient.tckn}</td>
                    <td>{patient.email || '-'}</td>
                    <td>{patient.phoneNumber || '-'}</td>
                    <td>{patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('tr-TR') : '-'}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                        <button
                          className="expand-btn"
                          onClick={() => handleExpandRow(patient.id, 'appointments')}
                          title="Show past appointments"
                          style={{
                            background: expandedPatient === patient.id && expandedTab === 'appointments' ? '#4CAF50' : '#2196F3',
                            color: 'white',
                            border: 'none',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          ▼
                        </button>
                        <button
                          className="expand-btn"
                          onClick={() => handleExpandRow(patient.id, 'labResults')}
                          title="Show lab results"
                          style={{
                            background: expandedPatient === patient.id && expandedTab === 'labResults' ? '#FF9800' : '#9C27B0',
                            color: 'white',
                            border: 'none',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          ▼
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Appointments Row */}
                  {expandedPatient === patient.id && expandedTab === 'appointments' && (
                    <tr className="expanded-row">
                      <td colSpan="6" style={{ padding: '20px' }}>
                        <div className="expanded-content">
                          <h3>Past Appointments</h3>
                          {loadingAppointments[patient.id] ? (
                            <p>Loading appointments...</p>
                          ) : appointments[patient.id]?.length === 0 ? (
                            <p>No appointments found</p>
                          ) : (
                            <table className="nested-table">
                              <thead>
                                <tr>
                                  <th>Doctor</th>
                                  <th>Department</th>
                                  <th>Date</th>
                                  <th>Time</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {appointments[patient.id]?.map(apt => (
                                  <tr key={apt.id}>
                                    <td>{apt.doctorName}</td>
                                    <td>{apt.department || '-'}</td>
                                    <td>{apt.date}</td>
                                    <td>{apt.time}</td>
                                    <td>
                                      <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        background: apt.status === 'APPROVED' ? '#4CAF50' : 
                                                  apt.status === 'CANCELLED' ? '#f44336' : '#FFC107',
                                        color: 'white'
                                      }}>
                                        {apt.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* Expanded Lab Results Row */}
                  {expandedPatient === patient.id && expandedTab === 'labResults' && (
                    <tr className="expanded-row">
                      <td colSpan="6" style={{ padding: '20px' }}>
                        <div className="expanded-content">
                          <h3>Lab Results</h3>
                          <p style={{ color: '#999' }}>Lab results feature coming soon...</p>
                          <div style={{ marginTop: '15px' }}>
                            <button 
                              style={{
                                padding: '8px 16px',
                                background: '#FF9800',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              View Lab Results
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
