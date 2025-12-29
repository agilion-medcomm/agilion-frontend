import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import './DashboardHome.css';

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";
const API_PREFIX = "/api/v1";
const BaseURL = `${API_BASE}${API_PREFIX}`;

// Icons
const EyeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const ActivityIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const LungsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 11a3 3 0 1 0 6 0"></path>
    <path d="M12 2v7"></path>
    <path d="M12 18a5 5 0 0 0 5-5V9h-2a3 3 0 0 0-3 3 3 3 0 0 0-3-3H7v4a5 5 0 0 0 5 5z"></path>
  </svg>
);

const WalkIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="5" r="1"></circle>
    <path d="M10 22v-6l1-4-3-2 1-5 3 1 3-1"></path>
    <path d="M10 14l4-2 2 3"></path>
  </svg>
);

const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const PeopleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
  </svg>
);

const BedIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 4v16"></path>
    <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
    <path d="M2 17h20"></path>
    <path d="M6 8V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"></path>
  </svg>
);

const UserXIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="18" y1="8" x2="23" y2="13"></line>
    <line x1="23" y1="8" x2="18" y2="13"></line>
  </svg>
);

const DollarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

export default function DashboardHome() {
  const { user } = usePersonnelAuth();
  const navigate = useNavigate();

  // Redirect CLEANER, LABORANT, and CASHIER to their specific panels
  useEffect(() => {
    if (user?.role === 'CLEANER') {
      navigate('/dashboard/cleaner', { replace: true });
    } else if (user?.role === 'LABORANT') {
      navigate('/dashboard/laborant', { replace: true });
    } else if (user?.role === 'CASHIER') {
      navigate('/dashboard/payments', { replace: true });
    }
  }, [user, navigate]);

  const [stats, setStats] = useState({
    patients: 0,
    surgeries: 0,
    discharges: 0,
    newPatients: 0,
    opdPatients: 0,
    labTests: 0,
    totalEarnings: 0,
    appointments: 0,
    doctors: 0,
    staff: 0,
    operations: 0,
    admitted: 0,
    discharged: 0,
  });
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('today');

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [timeFilter, user]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    const token = localStorage.getItem('personnelToken');

    try {
      const [appointmentsRes, patientsRes] = await Promise.all([
        axios.get(`${BaseURL}/appointments`, {
          params: { list: 'true' },
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${BaseURL}/patients`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const appointments = appointmentsRes.data?.data || [];
      const patients = patientsRes.data?.data?.users || [];

      // Try to fetch personnel data (only admins can access this)
      let personnel = [];
      let pendingLeavesCount = 0;
      let pendingContactsCount = 0;
      let pendingHomeHealthCount = 0;

      if (user?.role === 'ADMIN') {
        try {
          const [personnelRes, contactRes, leaveRes, homeHealthRes] = await Promise.all([
            axios.get(`${BaseURL}/personnel`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`${BaseURL}/contact`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`${BaseURL}/leave-requests`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`${BaseURL}/home-health/stats`, { headers: { Authorization: `Bearer ${token}` } })
          ]);
          personnel = personnelRes.data?.data || [];

          const contacts = contactRes.data?.data || [];
          pendingContactsCount = contacts.filter(c => c.status === 'PENDING').length;

          const leaves = leaveRes.data?.data || [];
          pendingLeavesCount = leaves.filter(l => l.status === 'PENDING').length;

          const homeHealthStats = homeHealthRes.data?.data || {};
          pendingHomeHealthCount = homeHealthStats.pending || 0;


        } catch (adminError) {
          console.error('Error fetching admin data:', adminError);
          // Non-admin users will get 403, which is expected
        }
      }
      // Non-admin users: personnel list remains empty (doctors/staff counts will show 0)

      // Filter data based on time period
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const filteredAppointments = appointments.filter(app => {
        const appDate = parseDateString(app.date);
        if (!appDate) return false;

        switch (timeFilter) {
          case 'today':
            return appDate.getTime() === today.getTime();
          case '7d':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return appDate >= weekAgo;
          case '2w':
            const twoWeeksAgo = new Date(today);
            twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
            return appDate >= twoWeeksAgo;
          case '1m':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            return appDate >= monthAgo;
          case '3m':
            const threeMonthsAgo = new Date(today);
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            return appDate >= threeMonthsAgo;
          case '6m':
            const sixMonthsAgo = new Date(today);
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            return appDate >= sixMonthsAgo;
          case '1y':
            const yearAgo = new Date(today);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            return appDate >= yearAgo;
          default:
            return true;
        }
      });

      const doctors = personnel.filter(p => p.role === 'DOCTOR');
      const approvedAppointments = filteredAppointments.filter(a => a.status === 'APPROVED');
      const completedAppointments = filteredAppointments.filter(a => a.status === 'DONE');

      // Calculate mock statistics (you can replace with real data)
      setStats({
        patients: patients.length, // Use real patient count
        surgeries: Math.floor(approvedAppointments.length * 0.08),
        discharges: completedAppointments.length, // Use completed appointments count
        newPatients: Math.floor(patients.length * 0.35),
        opdPatients: Math.floor(approvedAppointments.length * 0.75),
        labTests: Math.floor(approvedAppointments.length * 2.1),
        totalEarnings: approvedAppointments.length * 350,
        appointments: filteredAppointments.length,
        doctors: doctors.length,
        staff: personnel.length,
        operations: Math.floor(approvedAppointments.length * 0.12),
        admitted: Math.floor(approvedAppointments.length * 0.95),
        discharged: completedAppointments.length,
        pendingLeaves: pendingLeavesCount,

        pendingContacts: pendingContactsCount,
        pendingHomeHealth: pendingHomeHealthCount || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const parseDateString = (dateStr) => {
    // Parse DD.MM.YYYY format
    if (!dateStr) return null;
    const parts = dateStr.split('.');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Günaydın';
    if (hour < 18) return 'İyi Günler';
    return 'İyi Akşamlar';
  };

  const getTimeLabel = () => {
    switch (timeFilter) {
      case 'today': return 'bugün';
      case '7d': return 'bu hafta';
      case '2w': return 'son 2 hafta';
      case '1m': return 'bu ay';
      case '3m': return 'son 3 ay';
      case '6m': return 'son 6 ay';
      case '1y': return 'bu yıl';
      default: return 'bugün';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      {/* Header with Time Filters */}
      <div className="dashboard-header">
        <div className="time-filters">
          {['today', '7d', '2w', '1m', '3m', '6m', '1y'].map((filter) => (
            <button
              key={filter}
              className={`time-filter-btn ${timeFilter === filter ? 'active' : ''}`}
              onClick={() => setTimeFilter(filter)}
            >
              {filter === 'today' ? 'Bugün' : filter === '7d' ? '7g' : filter === '2w' ? '2h' : filter === '1m' ? '1a' : filter === '3m' ? '3a' : filter === '6m' ? '6a' : '1y'}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <p className="hero-greeting">{getGreeting()},</p>
            <h1 className="hero-name">{user?.role === 'DOCTOR' ? 'Dr.' : 'Sayın'} {user?.firstName} {user?.lastName}</h1>
            <p className="hero-schedule">{getTimeLabel()} için programınız.</p>
          </div>

          <div className="hero-stats">
            <div className="hero-stat-card hero-stat-patients">
              <div className="hero-stat-icon">
                <EyeIcon />
              </div>
              <div className="hero-stat-info">
                <h3>{stats.patients}</h3>
                <p>Hastalar</p>
              </div>
            </div>



            <div className="hero-stat-card hero-stat-discharges">
              <div className="hero-stat-icon">
                <WalkIcon />
              </div>
              <div className="hero-stat-info">
                <h3>{stats.discharges}</h3>
                <p>Tamamlanan Randevular</p>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-illustration">
          <img src="/doctor-illustration.svg" alt="Medical Staff" />
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-new-patients">
          <div className="stat-card-header">
            <div className="stat-icon">
              <EyeIcon />
            </div>
          </div>
          <div className="stat-card-body">
            {user?.role === 'ADMIN' ? (
              <>
                <h2 className="stat-number">{stats.pendingLeaves}</h2>
                <p className="stat-label">Bekleyen İzinler</p>
                <div className="stat-footer">
                  <span className="stat-period">Aktif Talepler</span>
                  <button className="stat-view-all" onClick={() => navigate('/dashboard/leave-requests')}>Git →</button>
                </div>
              </>
            ) : (
              <>
                <h2 className="stat-number">{stats.newPatients}</h2>
                <p className="stat-label">Yeni Hastalar</p>
                <div className="stat-footer">
                  <span className="stat-period">{getTimeLabel()}</span>
                  <button className="stat-view-all" onClick={() => navigate('/dashboard/patients')}>Tümünü Gör →</button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="stat-card stat-opd-patients">
          <div className="stat-card-header">
            <div className="stat-icon">
              <LungsIcon />
            </div>
          </div>
          <div className="stat-card-body">
            {user?.role === 'ADMIN' ? (
              <>
                <h2 className="stat-number">{stats.pendingContacts}</h2>
                <p className="stat-label">Bekleyen Mesajlar</p>
                <div className="stat-footer">
                  <span className="stat-period">Okunmamış</span>
                  <button className="stat-view-all" onClick={() => navigate('/dashboard/contact-forms')}>Git →</button>
                </div>
              </>
            ) : (
              <>
                <h2 className="stat-number">{stats.opdPatients}</h2>
                <p className="stat-label">{user?.role === 'ADMIN' ? 'Randevulu Hastalar' : 'Poliklinik Hastaları'}</p>
                <div className="stat-footer">
                  <span className="stat-period">{getTimeLabel()}</span>
                  <button className="stat-view-all" onClick={() => navigate('/dashboard/patients')}>Tümünü Gör →</button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="stat-card stat-lab-tests">
          <div className="stat-card-header">
            <div className="stat-icon">
              <ActivityIcon />
            </div>
          </div>
          <div className="stat-card-body">
            {user?.role === 'ADMIN' ? (
              <>
                <h2 className="stat-number">{stats.pendingHomeHealth}</h2>
                <p className="stat-label">Bekleyen Evde Sağlık</p>
                <div className="stat-footer">
                  <span className="stat-period">Aktif Talepler</span>
                  <button className="stat-view-all" onClick={() => navigate('/dashboard/home-health')}>Git →</button>
                </div>
              </>
            ) : (
              <>
                <h2 className="stat-number">{stats.labTests}</h2>
                <p className="stat-label">Lab Testleri</p>
                <div className="stat-footer">
                  {/* <span className="stat-change positive">+60%</span> */}
                  <span className="stat-period">{getTimeLabel()}</span>
                  <button className="stat-view-all" onClick={() => navigate('/dashboard/lab-results')}>Tümünü Gör →</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Statistics */}
      <div className="bottom-stats">
        <div className="bottom-stat-card">
          <div className="bottom-stat-icon">
            <CalendarIcon />
          </div>
          <div className="bottom-stat-info">
            <p className="bottom-stat-label">Randevular</p>
            <h3 className="bottom-stat-number">{stats.appointments}</h3>
          </div>
        </div>

        {user?.role === 'ADMIN' && (
          <>
            <div className="bottom-stat-card">
              <div className="bottom-stat-icon">
                <UsersIcon />
              </div>
              <div className="bottom-stat-info">
                <p className="bottom-stat-label">Doktorlar</p>
                <h3 className="bottom-stat-number">{stats.doctors}</h3>
              </div>
            </div>

            <div className="bottom-stat-card">
              <div className="bottom-stat-icon">
                <PeopleIcon />
              </div>
              <div className="bottom-stat-info">
                <p className="bottom-stat-label">Personel</p>
                <h3 className="bottom-stat-number">{stats.staff}</h3>
              </div>
            </div>
          </>
        )}



        <div className="bottom-stat-card">
          <div className="bottom-stat-icon">
            <UserXIcon />
          </div>
          <div className="bottom-stat-info">
            <p className="bottom-stat-label">Tamamlanan</p>
            <h3 className="bottom-stat-number">{stats.discharged}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
