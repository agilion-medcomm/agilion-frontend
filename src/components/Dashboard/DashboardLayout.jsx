const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4"></circle>
    <path d="M4 20v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"></path>
  </svg>
);
import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import './DashboardLayout.css';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001';

// Icons
const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const PeopleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ClipboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="23" y1="21" x2="23" y2="15"></line>
    <line x1="20" y1="18" x2="26" y2="18"></line>
  </svg>
);

const FileTextIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const ActivityIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const BroomIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 3l-6.5 6.5" />
    <path d="M9.5 11l-3 3" />
    <path d="M6.5 14L2 22h8l-3.5-8" />
    <path d="M14 11l-3-3" />
    <path d="M11 14l-3-3" />
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const LogOutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const DisplayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

import { useTheme } from '../../context/ThemeContext'; // Import useTheme

// ... imports remain the same

export default function DashboardLayout() {
  const { user, logoutPersonnel } = usePersonnelAuth();
  const { theme } = useTheme(); // Get theme if needed, but don't toggle
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth <= 1024);

  useEffect(() => {
    if (window.innerWidth <= 1024) {
      setSidebarCollapsed(true);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logoutPersonnel();
    // Replace history and force page reload to clear all cached state
    window.location.href = '/personelLogin';
  };

  // Define navigation based on role
  const getNavigation = () => {
    const isAdmin = user?.role === 'ADMIN';
    const isDoctor = user?.role === 'DOCTOR';

    const baseNav = [
      { path: '/dashboard', icon: <HomeIcon />, label: 'Ana Sayfa' },
    ];

    if (isAdmin) {
      return [
        ...baseNav,
        { path: '/dashboard/personnel', icon: <PeopleIcon />, label: 'Personel' },
        { path: '/dashboard/appointments', icon: <CalendarIcon />, label: 'Randevular' },
        { path: '/dashboard/patients', icon: <UsersIcon />, label: 'Hastalar' },
        { path: '/dashboard/lab-results', icon: <ActivityIcon />, label: 'Lab Sonuçları' },
        { path: '/dashboard/leave-requests', icon: <ClipboardIcon />, label: 'İzin Talepleri' },
        { path: '/dashboard/contact-forms', icon: <MailIcon />, label: 'İletişim Formları' },
        { path: '/dashboard/home-health', icon: <ActivityIcon />, label: 'Evde Sağlık' },
        { path: '/dashboard/cleaning', icon: <BroomIcon />, label: 'Temizlik' },
        { path: '/dashboard/profile', icon: <UserIcon />, label: 'Profil' },
      ];
    }

    if (isDoctor) {
      return [
        ...baseNav,
        { path: '/dashboard/appointments', icon: <CalendarIcon />, label: 'Randevular' },
        { path: '/dashboard/lab-results', icon: <ActivityIcon />, label: 'Lab Sonuçları' },
        { path: '/dashboard/lab-requests', icon: <PlusIcon />, label: 'Lab Talepleri' },
        { path: '/dashboard/leave-requests', icon: <ClipboardIcon />, label: 'İzin Talepleri' },
        { path: '/dashboard/profile', icon: <UserIcon />, label: 'Profil' },
        { path: '/doctor-display', icon: <DisplayIcon />, label: 'Randevuları Yansıt', openInNewTab: true },
      ];
    }

    // Laborant role
    if (user?.role === 'LABORANT') {
      return [
        { path: '/dashboard/laborant', icon: <HomeIcon />, label: 'Dosya Yükle' },
        { path: '/dashboard/profile', icon: <UserIcon />, label: 'Profil' },
      ];
    }

    // Cleaner role
    if (user?.role === 'CLEANER') {
      return [
        { path: '/dashboard/cleaner', icon: <HomeIcon />, label: 'Temizlik Paneli' },
        { path: '/dashboard/profile', icon: <UserIcon />, label: 'Profil' },
      ];
    }

    // Cashier role
    if (user?.role === 'CASHIER') {
      return [
        { path: '/dashboard/payments', icon: <HomeIcon />, label: 'Randevu Oluştur' },
        { path: '/dashboard/home-health', icon: <ActivityIcon />, label: 'Evde Sağlık' },
        { path: '/dashboard/profile', icon: <UserIcon />, label: 'Profil' },
      ];
    }

    // Lab Tech role
    if (user?.role === 'LAB_TECH') {
      return [
        ...baseNav,
        { path: '/dashboard/lab-tests', icon: <ActivityIcon />, label: 'Lab Testleri' },
        { path: '/dashboard/profile', icon: <UserIcon />, label: 'Profil' },
      ];
    }

    // Patient role
    if (user?.role === 'PATIENT') {
      return [
        ...baseNav,
        { path: '/dashboard/my-appointments', icon: <CalendarIcon />, label: 'Randevularım' },
        { path: '/dashboard/lab-results', icon: <ActivityIcon />, label: 'Lab Sonuçları' },
        { path: '/dashboard/profile', icon: <UserIcon />, label: 'Profil' },
      ];
    }

    return baseNav;
  };

  const navigation = getNavigation();

  if (!user) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className={`dashboard-container ${sidebarCollapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`} data-theme={theme}>
      {/* Backdrop for mobile */}
      {!sidebarCollapsed && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarCollapsed(true)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          {sidebarCollapsed ? (
            <button
              className="sidebar-toggle collapsed-toggle"
              onClick={() => setSidebarCollapsed(false)}
              title="Expand sidebar"
            >
              <MenuIcon />
            </button>
          ) : (
            <>
              <div className="logo-section">
                <span className="logo-text">Zeytinburnu Cerrahi Tıp Paneli</span>
              </div>
              <button
                className="sidebar-toggle"
                onClick={() => setSidebarCollapsed(true)}
                title="Collapse sidebar"
              >
                <MenuIcon />
              </button>
            </>
          )}
        </div>

        <div className="sidebar-user">
          <div className="user-avatar" style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard/profile')} title="Profilim">
            {user.photoUrl ? (
              <img src={user.photoUrl.startsWith('http') ? user.photoUrl : `${API_BASE}${user.photoUrl}`} alt={user.firstName} />
            ) : (
              <span>{user.firstName?.charAt(0)}{user.lastName?.charAt(0)}</span>
            )}
          </div>
          {!sidebarCollapsed && (
            <div className="user-info">
              <p className="user-name">{user.firstName} {user.lastName}</p>
              <p className="user-role">{user.role === 'ADMIN' ? 'Yönetici' : user.role === 'DOCTOR' ? 'Doktor' : user.role === 'CLEANER' ? 'Temizlikçi' : user.role === 'CASHIER' ? 'Vezne' : user.role === 'LABORANT' ? 'Laborant' : user.role === 'LAB_TECH' ? 'Lab Teknisyeni' : user.role === 'PATIENT' ? 'Hasta' : user.role}</p>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {navigation.map((item) => (
            item.openInNewTab ? (
              <a
                key={item.path}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  // Yeni sekmede açılmadan önce bir flag koyalım
                  localStorage.setItem('doctorDisplaySession', 'true');
                  window.open(item.path, '_blank');
                }}
                className="nav-item"
                title={sidebarCollapsed ? item.label : ''}
                style={{ textDecoration: 'none' }}
              >
                <span className="nav-icon">{item.icon}</span>
                {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
              </a>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                title={sidebarCollapsed ? item.label : ''}
                end={item.path === '/dashboard'}
                onClick={() => {
                  if (window.innerWidth <= 1024) {
                    setSidebarCollapsed(true);
                  }
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                {!sidebarCollapsed && <span className="nav-label">{item.label}</span>}
              </NavLink>
            )
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-button" onClick={handleLogout}>
            <span className="nav-icon"><LogOutIcon /></span>
            {!sidebarCollapsed && <span className="nav-label">Çıkış</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <Outlet />
      </main>
    </div>
  );
}
