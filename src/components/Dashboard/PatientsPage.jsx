import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SharedDashboard.css';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";
const BaseURL = `${API_BASE}/api/v1`;

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    const token = localStorage.getItem('personnelToken');
    
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
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length === 0 ? (
              <tr><td colSpan="5" className="no-data">No patients found</td></tr>
            ) : (
              filteredPatients.map(patient => (
                <tr key={patient.id}>
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
