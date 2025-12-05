import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import './PersonnelPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";
const API_PREFIX = "/api/v1";
const BaseURL = `${API_BASE}${API_PREFIX}`;

// Icons
const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function PersonnelPage() {
  const { user } = usePersonnelAuth();
  const [personnelList, setPersonnelList] = useState([]);
  const [filteredPersonnel, setFilteredPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  
  // Form state
  const [form, setForm] = useState({
    tckn: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    password: '',
    role: 'DOCTOR',
    specialization: ''
  });
  
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchPersonnel();
  }, []);

  useEffect(() => {
    filterPersonnel();
  }, [personnelList, searchQuery, roleFilter]);

  const fetchPersonnel = async () => {
    setLoading(true);
    const token = localStorage.getItem('personnelToken');
    
    if (!token) {
      showMessage('error', 'No authentication token found. Please login again.');
      setLoading(false);
      return;
    }
    
    try {
      const res = await axios.get(`${BaseURL}/personnel`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPersonnelList(res.data?.data || []);
    } catch (error) {
      if (error.response?.status === 401) {
        showMessage('error', 'Session expired. Please login again.');
      } else {
        showMessage('error', 'Failed to fetch personnel');
      }
      console.error('Error fetching personnel:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPersonnel = () => {
    let filtered = [...personnelList];
    
    // Role filter
    if (roleFilter !== 'ALL') {
      filtered = filtered.filter(p => p.role === roleFilter);
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.firstName?.toLowerCase().includes(query) ||
        p.lastName?.toLowerCase().includes(query) ||
        p.email?.toLowerCase().includes(query) ||
        p.tckn?.includes(query) ||
        p.phoneNumber?.includes(query)
      );
    }
    
    setFilteredPersonnel(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({
      tckn: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      dateOfBirth: '',
      password: '',
      role: 'DOCTOR',
      specialization: ''
    });
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5001);
  };

  const handleAddPersonnel = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('personnelToken');
    
    const dataToSend = { ...form };
    if (dataToSend.role !== 'DOCTOR') {
      dataToSend.specialization = '';
    }
    
    try {
      await axios.post(`${BaseURL}/personnel`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showMessage('success', 'Personnel added successfully');
      setShowAddModal(false);
      resetForm();
      fetchPersonnel();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to add personnel');
    }
  };

  const handleEditPersonnel = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('personnelToken');
    
    const updateData = {
      email: form.email,
      phoneNumber: form.phoneNumber,
      dateOfBirth: form.dateOfBirth,
    };
    
    if (form.role === 'DOCTOR' && form.specialization) {
      updateData.specialization = form.specialization;
    }
    
    if (form.password) {
      updateData.password = form.password;
    }
    
    try {
      await axios.put(`${BaseURL}/personnel/${selectedPersonnel.id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showMessage('success', 'Personnel updated successfully');
      setShowEditModal(false);
      resetForm();
      setSelectedPersonnel(null);
      fetchPersonnel();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update personnel');
    }
  };

  const handleDeletePersonnel = async () => {
    const token = localStorage.getItem('personnelToken');
    
    if (selectedPersonnel.id === user.id) {
      showMessage('error', 'You cannot delete your own account');
      return;
    }
    
    try {
      await axios.delete(`${BaseURL}/personnel/${selectedPersonnel.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showMessage('success', 'Personnel deleted successfully');
      setShowDeleteModal(false);
      setSelectedPersonnel(null);
      fetchPersonnel();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to delete personnel');
    }
  };

  const openEditModal = (personnel) => {
    setSelectedPersonnel(personnel);
    setForm({
      tckn: personnel.tckn,
      firstName: personnel.firstName,
      lastName: personnel.lastName,
      email: personnel.email || '',
      phoneNumber: personnel.phoneNumber || '',
      dateOfBirth: personnel.dateOfBirth || '',
      password: '',
      role: personnel.role,
      specialization: personnel.specialization || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (personnel) => {
    setSelectedPersonnel(personnel);
    setShowDeleteModal(true);
  };

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'DOCTOR': return 'badge-doctor';
      case 'ADMIN': return 'badge-admin';
      case 'LABORANT': return 'badge-lab';
      default: return 'badge-default';
    }
  };

  const getRoleLabel = (role) => {
    switch(role) {
      case 'LABORANT': return 'Lab Technician';
      case 'DOCTOR': return 'Doctor';
      case 'ADMIN': return 'Admin';
      case 'CASHIER': return 'Desk Staff';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Loading personnel...</p>
      </div>
    );
  }

  return (
    <div className="personnel-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Personnel Management</h1>
          <p className="page-subtitle">Manage hospital staff and their information</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <PlusIcon />
            <span>Add Personnel</span>
          </button>
        )}
      </div>

      {/* Message */}
      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search by name, email, TCKN, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="role-filters">
          {['ALL', 'DOCTOR', 'ADMIN', 'LABORANT'].map(role => (
            <button
              key={role}
              className={`filter-chip ${roleFilter === role ? 'active' : ''}`}
              onClick={() => setRoleFilter(role)}
            >
              {role === 'ALL' ? 'All' : getRoleLabel(role)}
            </button>
          ))}
        </div>
      </div>

      {/* Personnel Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>TCKN</th>
              <th>Role</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Date of Birth</th>
              {user?.role === 'ADMIN' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredPersonnel.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No personnel found
                </td>
              </tr>
            ) : (
              filteredPersonnel.map(personnel => (
                <tr key={personnel.id}>
                  <td>
                    <div className="name-cell">
                      <div className="avatar">
                        {personnel.firstName?.charAt(0)}{personnel.lastName?.charAt(0)}
                      </div>
                      <span>{personnel.firstName} {personnel.lastName}</span>
                    </div>
                  </td>
                  <td>{personnel.tckn}</td>
                  <td>
                    <span className={`badge ${getRoleBadgeClass(personnel.role)}`}>
                      {getRoleLabel(personnel.role)}
                    </span>
                  </td>
                  <td>{personnel.email || '-'}</td>
                  <td>{personnel.phoneNumber || '-'}</td>
                  <td>{personnel.dateOfBirth ? new Date(personnel.dateOfBirth).toLocaleDateString('tr-TR') : '-'}</td>
                  {user?.role === 'ADMIN' && (
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => openEditModal(personnel)}
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => openDeleteModal(personnel)}
                          title="Delete"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Personnel Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Personnel</h2>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>
                <XIcon />
              </button>
            </div>
            <form onSubmit={handleAddPersonnel} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>TCKN *</label>
                  <input
                    type="text"
                    name="tckn"
                    value={form.tckn}
                    onChange={handleInputChange}
                    maxLength={11}
                    minLength={11}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Role *</label>
                  <select name="role" value={form.role} onChange={handleInputChange} required>
                    <option value="DOCTOR">Doctor</option>
                    <option value="ADMIN">Admin</option>
                    <option value="LABORANT">Lab Technician</option>
                    <option value="CASHIER">Desk Staff</option>
                  </select>
                </div>
              </div>

              {form.role === 'DOCTOR' && (
                <div className="form-group">
                  <label>Specialization</label>
                  <select name="specialization" value={form.specialization} onChange={handleInputChange} required>
                    <option value="">Select Specialization</option>
                    <option value="Acil 7/24">Acil 7/24</option>
                    <option value="Ağız ve Diş">Ağız ve Diş</option>
                    <option value="Beslenme Diyet">Beslenme Diyet</option>
                    <option value="Dermatoloji">Dermatoloji</option>
                    <option value="Genel Cerrahi">Genel Cerrahi</option>
                    <option value="Göz Sağlığı">Göz Sağlığı</option>
                    <option value="İç Hastalıklar">İç Hastalıklar</option>
                    <option value="Kadın & Doğum">Kadın & Doğum</option>
                  </select>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    minLength={8}
                    required
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Add Personnel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Personnel Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Personnel</h2>
              <button className="btn-close" onClick={() => setShowEditModal(false)}>
                <XIcon />
              </button>
            </div>
            <form onSubmit={handleEditPersonnel} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name (Read-only)</label>
                  <input type="text" value={form.firstName} disabled />
                </div>
                <div className="form-group">
                  <label>Last Name (Read-only)</label>
                  <input type="text" value={form.lastName} disabled />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>TCKN (Read-only)</label>
                  <input type="text" value={form.tckn} disabled />
                </div>
                <div className="form-group">
                  <label>Role (Read-only)</label>
                  <input type="text" value={getRoleLabel(form.role)} disabled />
                </div>
              </div>

              {form.role === 'DOCTOR' && (
                <div className="form-group">
                  <label>Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={form.specialization}
                    onChange={handleInputChange}
                  />
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>New Password (Leave empty to keep current)</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleInputChange}
                    minLength={8}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Personnel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedPersonnel && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="btn-close" onClick={() => setShowDeleteModal(false)}>
                <XIcon />
              </button>
            </div>3
            <div className="modal-body">
              <p>Are you sure you want to delete this personnel?</p>
              <div className="delete-info">
                <p><strong>Name:</strong> {selectedPersonnel.firstName} {selectedPersonnel.lastName}</p>
                <p><strong>Role:</strong> {getRoleLabel(selectedPersonnel.role)}</p>
                <p><strong>TCKN:</strong> {selectedPersonnel.tckn}</p>
              </div>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDeletePersonnel}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
