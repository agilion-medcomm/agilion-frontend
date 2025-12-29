import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import { useTheme } from '../../context/ThemeContext';
import { MEDICAL_SPECIALTIES } from '../../constants/medicalSpecialties';
import DoctorAvailabilityModal from './DoctorAvailabilityModal';
import './PersonnelPage.css';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";
const API_PREFIX = "/api/v1";
const BaseURL = `${API_BASE}${API_PREFIX}`;

// Scraped doctor photos from zeytinburnutipmerkezi.com.tr
const SEEDED_DOCTOR_PHOTOS = {
  "Turgay Karamustafa": "https://zeytinburnutipmerkezi.com.tr/wp-content/uploads/2024/10/Turgay-karamustafa.png",
  "Naci Onan": "https://zeytinburnutipmerkezi.com.tr/wp-content/uploads/2024/10/Naci-Onan.png",
  "Vagıf Ahmetoğlu": "https://zeytinburnutipmerkezi.com.tr/wp-content/uploads/2024/10/vagif-ahmedoglu.png",
  "İbrahim Süve": "https://zeytinburnutipmerkezi.com.tr/wp-content/uploads/2024/10/Ibrahim-suve.png",
  "Vildan Gür": "https://zeytinburnutipmerkezi.com.tr/wp-content/uploads/2024/10/Vildan-gur.png",
  "Şükran Tamtürk": "https://zeytinburnutipmerkezi.com.tr/wp-content/uploads/2024/10/Sukran-tamturk.png",
  "Tolga Aydemir": "https://zeytinburnutipmerkezi.com.tr/wp-content/uploads/2024/10/tolga-aydemir.png",
  "İsmail Vurgun": "https://zeytinburnutipmerkezi.com.tr/wp-content/uploads/2024/10/ismail-vurgun.png",
  "Elif Kuybet Çelik": "https://zeytinburnutipmerkezi.com.tr/wp-content/uploads/2024/10/Elif-kuybet-celik.png",
  "Hüseyin İpektel": "https://zeytinburnutipmerkezi.com.tr/wp-content/uploads/2024/10/huseyin-ipektel.png",
  "Çağdaş Aydın": "https://zeytinburnutipmerkezi.com.tr/wp-content/uploads/2024/10/cagdas-aydin.png",
  "Ayşe Reyhan Uzun": "https://zeytinburnutipmerkezi.com.tr/wp-content/uploads/2024/10/ayse-reyhan-uzun.png"
};

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

const CameraIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const ClockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

// Avatar component with photo or initials
const PersonnelAvatar = ({ img, firstName, lastName, initials, size = 'medium', onClick }) => {
  const displayInitials = initials || `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;

  // Generate consistent color from name
  const getAvatarColor = (name) => {
    const colors = [
      '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
      '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
    ];
    const hash = (name || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const sizeClasses = {
    small: 'avatar-small',
    medium: 'avatar-medium',
    large: 'avatar-large'
  };

  return (
    <div
      className={`personnel-avatar ${sizeClasses[size]} ${onClick ? 'clickable' : ''}`}
      onClick={onClick}
      style={!img ? { backgroundColor: getAvatarColor(firstName + lastName) } : {}}
    >
      {img ? (
        <img src={img.startsWith('http') ? img : `${API_BASE}${img}`} alt={`${firstName} ${lastName}`} />
      ) : (
        <span className="avatar-initials">{displayInitials.toUpperCase()}</span>
      )}
      {onClick && (
        <div className="avatar-overlay">
          <CameraIcon />
        </div>
      )}
    </div>
  );
};

export default function PersonnelPage() {
  const { user, refreshUser } = usePersonnelAuth();
  const { theme } = useTheme();
  const [personnelList, setPersonnelList] = useState([]);
  const [filteredPersonnel, setFilteredPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [selectedDoctorForAvailability, setSelectedDoctorForAvailability] = useState(null);

  // Photo upload state
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

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
    specialization: '',
    bio: '',
    expertise: '',
    education: '',
    principles: ''
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
      const personnelData = res.data?.data || [];

      // Add scraped photos for seeded doctors
      const mergedPersonnel = personnelData.map(person => {
        if (person.role === 'DOCTOR') {
          // Try to match by full name (firstName + lastName)
          const fullName = `${person.firstName} ${person.lastName}`;
          const photoUrl = SEEDED_DOCTOR_PHOTOS[fullName];
          
          if (photoUrl) {
            return { ...person, photoUrl };
          }
        }
        return person;
      });

      setPersonnelList(mergedPersonnel);
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
      specialization: '',
      bio: '',
      expertise: '',
      education: '',
      principles: ''
    });
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5001);
  };

  const handleAddPersonnel = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('personnelToken');

    // Prepare data for personnel creation (without doctor-specific bio fields)
    const dataToSend = {
      tckn: form.tckn,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phoneNumber: form.phoneNumber,
      dateOfBirth: form.dateOfBirth,
      password: form.password,
      role: form.role,
    };

    // Add specialization for doctors
    if (form.role === 'DOCTOR' && form.specialization) {
      dataToSend.specialization = form.specialization;
    }

    try {
      const response = await axios.post(`${BaseURL}/personnel`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const createdPersonnelId = response.data?.data?.id;

      // If photo was selected, upload it after personnel is created
      if (photoFile && createdPersonnelId) {
        const formData = new FormData();
        formData.append('photo', photoFile);
        try {
          await axios.post(`${BaseURL}/personnel/${createdPersonnelId}/photo`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          });
        } catch (photoError) {
          console.error('Photo upload failed:', photoError);
          // Personnel was created, just photo failed
        }
      }

      // If doctor, also create doctor-specific profile information
      if (form.role === 'DOCTOR' && createdPersonnelId) {
        const doctorProfileData = {};
        if (form.bio) doctorProfileData.biography = form.bio;
        if (form.expertise) doctorProfileData.expertiseAreas = form.expertise;
        if (form.education) doctorProfileData.educationAndAchievements = form.education;
        if (form.principles) doctorProfileData.workPrinciples = form.principles;

        // Only call doctor profile endpoint if there's doctor-specific data to add
        if (Object.keys(doctorProfileData).length > 0) {
          try {
            await axios.put(`${BaseURL}/doctors/${createdPersonnelId}/profile`, doctorProfileData, {
              headers: { Authorization: `Bearer ${token}` }
            });
          } catch (profileError) {
            console.error('Doctor profile update failed:', profileError);
            // Personnel was created, profile update failed
          }
        }
      }

      showMessage('success', 'Personnel added successfully');
      setShowAddModal(false);
      resetForm();
      setPhotoFile(null);
      setPhotoPreview(null);
      fetchPersonnel();
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to add personnel');
    }
  };

  const handleEditPersonnel = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('personnelToken');

    const updateData = {
      firstName: form.firstName,
      lastName: form.lastName,
      tckn: form.tckn,
      email: form.email,
      phoneNumber: form.phoneNumber,
      dateOfBirth: form.dateOfBirth,
    };

    // Add specialization to general personnel data if it's a doctor
    if (form.role === 'DOCTOR' && form.specialization) {
      updateData.specialization = form.specialization;
    }

    if (form.password) {
      updateData.password = form.password;
    }

    try {
      // Update general personnel information
      await axios.put(`${BaseURL}/personnel/${selectedPersonnel.id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // If doctor, also update doctor-specific profile information
      if (form.role === 'DOCTOR') {
        const doctorProfileData = {};
        if (form.bio !== undefined) doctorProfileData.biography = form.bio;
        if (form.expertise !== undefined) doctorProfileData.expertiseAreas = form.expertise;
        if (form.education !== undefined) doctorProfileData.educationAndAchievements = form.education;
        if (form.principles !== undefined) doctorProfileData.workPrinciples = form.principles;

        // Only call doctor profile endpoint if there's doctor-specific data to update
        if (Object.keys(doctorProfileData).length > 0) {
          await axios.put(`${BaseURL}/doctors/${selectedPersonnel.id}/profile`, doctorProfileData, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
      }

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
      specialization: personnel.specialization || '',
      bio: personnel.bio || '',
      expertise: personnel.expertise || '',
      education: personnel.education || '',
      principles: personnel.principles || ''
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (personnel) => {
    setSelectedPersonnel(personnel);
    setShowDeleteModal(true);
  };

  // Photo handlers
  const openPhotoModal = (personnel) => {
    setSelectedPersonnel(personnel);
    setPhotoFile(null);
    // Check if photoUrl is external (starts with http) or internal path
    const photoUrl = personnel.photoUrl 
      ? (personnel.photoUrl.startsWith('http') ? personnel.photoUrl : `${API_BASE}${personnel.photoUrl}`)
      : null;
    setPhotoPreview(photoUrl);
    setShowPhotoModal(true);
  };

  const openAvailabilityModal = (doctor) => {
    setSelectedDoctorForAvailability(doctor);
    setShowAvailabilityModal(true);
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showMessage('error', 'File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        showMessage('error', 'Only image files are allowed');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile || !selectedPersonnel) return;

    const token = localStorage.getItem('personnelToken');
    const formData = new FormData();
    formData.append('photo', photoFile);

    setUploadingPhoto(true);
    try {
      await axios.post(`${BaseURL}/personnel/${selectedPersonnel.id}/photo`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      showMessage('success', 'Photo uploaded successfully');
      setShowPhotoModal(false);
      setPhotoFile(null);
      setPhotoPreview(null);
      fetchPersonnel();

      // Refresh current user if they updated their own photo
      if (selectedPersonnel.id === user?.id || selectedPersonnel.userId === user?.id) {
        await refreshUser();
      }
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handlePhotoDelete = async () => {
    if (!selectedPersonnel) return;

    const token = localStorage.getItem('personnelToken');

    setUploadingPhoto(true);
    try {
      await axios.delete(`${BaseURL}/personnel/${selectedPersonnel.id}/photo`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      showMessage('success', 'Fotoğraf başarıyla silindi');
      setPhotoPreview(null);
      setPhotoFile(null);
      fetchPersonnel();

      // Refresh current user if they deleted their own photo
      if (selectedPersonnel.id === user?.id || selectedPersonnel.userId === user?.id) {
        await refreshUser();
      }
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Fotoğraf silinemedi');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'DOCTOR': return 'badge-doctor';
      case 'ADMIN': return 'badge-admin';
      case 'LABORANT': return 'badge-lab';
      case 'CLEANER': return 'badge-cleaner';
      case 'CASHIER': return 'badge-cashier';
      default: return 'badge-default';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'LABORANT': return 'Laborant';
      case 'DOCTOR': return 'Doktor';
      case 'ADMIN': return 'Yönetici';
      case 'CASHIER': return 'Vezne';
      case 'CLEANER': return 'Temizlikçi';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner"></div>
        <p>Personel yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="personnel-page">
      {/* Header */}
      <div className="page-header">
        <div className="page-title-section">
          <h1 className="page-title">Personel Yönetimi</h1>
          <p className="page-subtitle">Hastane personelini ve bilgilerini yönetin</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button className="btn-primary" onClick={() => setShowAddModal(true)}>
            <PlusIcon />
            <span>Personel Ekle</span>
          </button>
        )}
      </div>

      {/* Message */}
      {message.text && (
        <div 
          className={`alert alert-${message.type}`}
          style={{
            padding: '14px 18px',
            borderRadius: '8px',
            marginBottom: '20px',
            backgroundColor: message.type === 'error' 
              ? (theme === 'dark' ? '#7f1d1d' : '#fef2f2')
              : (theme === 'dark' ? '#065f46' : '#f0fdf4'),
            color: message.type === 'error' 
              ? (theme === 'dark' ? '#fecaca' : '#991b1b')
              : (theme === 'dark' ? '#d1fae5' : '#166534'),
            border: `1.5px solid ${message.type === 'error' 
              ? (theme === 'dark' ? '#991b1b' : '#fca5a5')
              : (theme === 'dark' ? '#047857' : '#86efac')}`,
            fontWeight: '600',
            fontSize: '15px',
            boxShadow: theme === 'dark' 
              ? '0 2px 8px rgba(0, 0, 0, 0.4)' 
              : '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}
        >
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <SearchIcon />
          <input
            type="text"
            placeholder="İsim, e-posta, TC veya telefon ile ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="role-filters">
          {['ALL', 'DOCTOR', 'ADMIN', 'CASHIER', 'LABORANT', 'CLEANER'].map(role => (
            <button
              key={role}
              className={`filter-chip ${roleFilter === role ? 'active' : ''}`}
              onClick={() => setRoleFilter(role)}
            >
              {role === 'ALL' ? 'Tümü' : getRoleLabel(role)}
            </button>
          ))}
        </div>
      </div>

      {/* Personnel Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>İsim</th>
              <th>TC Kimlik</th>
              <th>Rol</th>
              <th>E-posta</th>
              <th>Telefon</th>
              <th>Doğum Tarihi</th>
              {user?.role === 'ADMIN' && <th>İşlemler</th>}
            </tr>
          </thead>
          <tbody>
            {filteredPersonnel.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  Personel bulunamadı
                </td>
              </tr>
            ) : (
              filteredPersonnel.map(personnel => (
                <tr key={personnel.id}>
                  <td>
                    <div className="name-cell">
                      <PersonnelAvatar
                        img={personnel.photoUrl}
                        firstName={personnel.firstName}
                        lastName={personnel.lastName}
                        initials={personnel.initials}
                        size="small"
                        onClick={(user?.role === 'ADMIN' || user?.id === personnel.id) ? () => openPhotoModal(personnel) : undefined}
                      />
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
                        {personnel.role === 'DOCTOR' && (
                          <button
                            className="btn-icon btn-availability"
                            onClick={() => openAvailabilityModal(personnel)}
                            title="Çalışma Saatlerini Düzenle"
                            style={{ marginRight: '8px' }}
                          >
                            <ClockIcon />
                          </button>
                        )}
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => openEditModal(personnel)}
                          title="Düzenle"
                        >
                          <img src="/editor.svg" alt="Düzenle" width="30" height="30" />
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => openDeleteModal(personnel)}
                          title="Sil"
                        >
                          <img src="/delete.svg" alt="Sil" width="26" height="26" />
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

      {/* Doctor Availability Modal */}
      {showAvailabilityModal && selectedDoctorForAvailability && (
        <DoctorAvailabilityModal
          doctor={selectedDoctorForAvailability}
          onClose={() => {
            setShowAvailabilityModal(false);
            setSelectedDoctorForAvailability(null);
          }}
          refreshData={fetchPersonnel}
        />
      )}

      {/* Add Personnel Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Yeni Personel Ekle</h2>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>
                <XIcon />
              </button>
            </div>
            <form onSubmit={handleAddPersonnel} className="modal-form">
              {/* Photo Upload Section */}
              <div className="form-photo-section">
                <div className="photo-upload-preview">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Önizleme" className="preview-image" />
                  ) : (
                    <div className="photo-placeholder">
                      <CameraIcon />
                      <span>Fotoğraf Ekle</span>
                    </div>
                  )}
                </div>
                <div className="photo-upload-controls">
                  <input
                    type="file"
                    id="add-photo-upload"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="add-photo-upload" className="btn-secondary btn-small">
                    {photoPreview ? 'Fotoğrafı Değiştir' : 'Fotoğraf Seç'}
                  </label>
                  {photoPreview && (
                    <button type="button" className="btn-text" onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}>
                      Kaldır
                    </button>
                  )}
                  <p className="upload-hint">İsteğe bağlı - Max 5MB</p>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Ad *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Soyad *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>TC Kimlik No *</label>
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
                <label>Rol *</label>
                <select name="role" value={form.role} onChange={handleInputChange} required>
                  <option value="DOCTOR">Doktor</option>
                  <option value="ADMIN">Yönetici</option>
                  <option value="LABORANT">Laborant</option>
                  <option value="CASHIER">Vezne</option>
                  <option value="CLEANER">Temizlikçi</option>
                </select>
              </div>

              {form.role === 'DOCTOR' && (
                <>
                  <div className="form-group">
                    <label>Uzmanlık Alanı</label>
                    <select name="specialization" value={form.specialization} onChange={handleInputChange} required>
                      <option value="">Uzmanlık Seçiniz</option>
                      {Object.entries(MEDICAL_SPECIALTIES).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Biyografi</label>
                    <textarea name="bio" value={form.bio} onChange={handleInputChange} rows="3" placeholder="Doktorun geçmişi ve özeti..."></textarea>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Uzmanlık Alanları (her satıra bir tane)</label>
                      <textarea name="expertise" value={form.expertise} onChange={handleInputChange} rows="3" placeholder="örn: Kronik Hastalık Yönetimi"></textarea>
                    </div>
                    <div className="form-group">
                      <label>Eğitim & Başarılar (her satıra bir tane)</label>
                      <textarea name="education" value={form.education} onChange={handleInputChange} rows="3" placeholder="örn: Tıp Bilimleri Doktorası"></textarea>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Çalışma Prensipleri</label>
                    <textarea name="principles" value={form.principles} onChange={handleInputChange} rows="2" placeholder="Doktorun hastalara yaklaşımı..."></textarea>
                  </div>
                </>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>E-posta</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Telefon</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleInputChange}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    minLength={10}
                    title="Telefon numarası 10 haneli olmalıdır."
                    placeholder="5XX XXX XX XX"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Doğum Tarihi</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Şifre *</label>
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
                  İptal
                </button>
                <button type="submit" className="btn-primary">
                  Personel Ekle
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
              <h2>Personeli Düzenle</h2>
              <button className="btn-close" onClick={() => setShowEditModal(false)}>
                <XIcon />
              </button>
            </div>
            <form onSubmit={handleEditPersonnel} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Ad *</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={form.firstName} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Soyad *</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={form.lastName} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

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
                <label>Rol (Yalnızca Okunur)</label>
                <input type="text" value={getRoleLabel(form.role)} disabled />
              </div>

              {form.role === 'DOCTOR' && (
                <>
                  <div className="form-group">
                    <label>Uzmanlık Alanı</label>
                    <select name="specialization" value={form.specialization} onChange={handleInputChange}>
                      <option value="">Uzmanlık Seçiniz</option>
                      {Object.entries(MEDICAL_SPECIALTIES).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Biyografi</label>
                    <textarea name="bio" value={form.bio} onChange={handleInputChange} rows="3" placeholder="Doktorun özgeçmişi..."></textarea>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Uzmanlık Alanı (her satırda bir)</label>
                      <textarea name="expertise" value={form.expertise} onChange={handleInputChange} rows="3" placeholder="Kulak, burun ve boğaz vb."></textarea>
                    </div>
                    <div className="form-group">
                      <label>Eğitim & Kazanımlar (her satırda bir)</label>
                      <textarea name="education" value={form.education} onChange={handleInputChange} rows="3" placeholder="Medikal Bilimlerde Master vb."></textarea>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Çalışma Prensipleri</label>
                    <textarea name="principles" value={form.principles} onChange={handleInputChange} rows="2" placeholder="Doktorun hastaya yaklaşımları..."></textarea>
                  </div>
                </>
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
                  <label>Telefon</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleInputChange}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    minLength={10}
                    title="Telefon numarası 10 haneli olmalıdır."
                    placeholder="5XX XXX XX XX"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Doğum Tarihi</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Yeni Şifre (Mevcut için boş bırakın.)</label>
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
                  İptal
                </button>
                <button type="submit" className="btn-primary">
                  Personeli Güncelle
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
            </div>
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

      {/* Photo Upload Modal */}
      {showPhotoModal && selectedPersonnel && (
        <div className="modal-overlay" onClick={() => setShowPhotoModal(false)}>
          <div className="modal-content modal-photo" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Update Profile Photo</h2>
              <button className="btn-close" onClick={() => setShowPhotoModal(false)}>
                <XIcon />
              </button>
            </div>
            <div className="modal-body photo-modal-body">
              <div className="photo-preview-section">
                {photoPreview ? (
                  <div className="personnel-avatar avatar-large">
                    <img src={photoPreview} alt={`${selectedPersonnel.firstName} ${selectedPersonnel.lastName}`} />
                  </div>
                ) : (
                  <PersonnelAvatar
                    img={null}
                    firstName={selectedPersonnel.firstName}
                    lastName={selectedPersonnel.lastName}
                    size="large"
                  />
                )}
              </div>

              <div className="photo-info">
                <p><strong>{selectedPersonnel.firstName} {selectedPersonnel.lastName}</strong></p>
                <p className="text-muted">{getRoleLabel(selectedPersonnel.role)}</p>
              </div>

              <div className="photo-upload-section">
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  style={{ display: 'none' }}
                />
                <label htmlFor="photo-upload" className="btn-secondary upload-label">
                  <CameraIcon />
                  <span>Select Photo</span>
                </label>
                <p className="upload-hint">Max 5MB, JPG/PNG/GIF</p>
              </div>
            </div>
            <div className="modal-actions">
              {selectedPersonnel.photoUrl && !photoFile && (
                <button
                  className="btn-danger"
                  onClick={handlePhotoDelete}
                  disabled={uploadingPhoto}
                >
                  {uploadingPhoto ? 'Deleting...' : 'Remove Photo'}
                </button>
              )}
              <button className="btn-secondary" onClick={() => setShowPhotoModal(false)}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handlePhotoUpload}
                disabled={!photoFile || uploadingPhoto}
              >
                {uploadingPhoto ? 'Uploading...' : 'Save Photo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
