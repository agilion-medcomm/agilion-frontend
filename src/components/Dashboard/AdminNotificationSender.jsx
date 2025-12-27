import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { usePersonnelAuth } from '../../context/PersonnelAuthContext';
import './AdminNotificationSender.css';

const BaseURL = import.meta.env.VITE_API_BASE || 'http://localhost:5001';

export default function AdminNotificationSender() {
  const { user } = usePersonnelAuth();
  const [targetType, setTargetType] = useState('ALL'); // ALL, ROLE, SPECIFIC
  const [targetRole, setTargetRole] = useState('');
  const [targetUsers, setTargetUsers] = useState([]);
  const [personnelList, setPersonnelList] = useState([]);
  const [notification, setNotification] = useState({
    title: '',
    message: '',
    type: 'GENERAL'
  });
  const [sentNotifications, setSentNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPersonnel();
    fetchSentNotifications();
  }, []);

  const fetchPersonnel = async () => {
    try {
      // TODO: Replace with real API call
      // const response = await axios.get(`${BaseURL}/api/v1/personnel`, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });

      // Mock data
      const mockPersonnel = [
        { id: 1, firstName: 'John', lastName: 'Doe', role: 'DOCTOR' },
        { id: 2, firstName: 'Jane', lastName: 'Smith', role: 'CLEANER' },
        { id: 3, firstName: 'Mike', lastName: 'Johnson', role: 'CASHIER' },
        { id: 4, firstName: 'Sarah', lastName: 'Williams', role: 'LAB_TECH' },
      ];

      setPersonnelList(mockPersonnel);
    } catch (error) {
      console.error('Error fetching personnel:', error);
    }
  };

  const fetchSentNotifications = async () => {
    try {
      // TODO: Replace with real API call
      // const response = await axios.get(`${BaseURL}/api/v1/notifications/sent`, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });

      // Mock data
      const mockSent = [
        {
          id: 1,
          title: 'Reminder: Monthly Meeting',
          targetType: 'ALL',
          recipientCount: 24,
          sentAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 2,
          title: 'New Cleaning Protocol',
          targetType: 'ROLE',
          targetRole: 'CLEANER',
          recipientCount: 5,
          sentAt: new Date(Date.now() - 86400000).toISOString()
        },
      ];

      setSentNotifications(mockSent);
    } catch (error) {
      console.error('Error fetching sent notifications:', error);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...notification,
        targetType,
        ...(targetType === 'ROLE' && { targetRole }),
        ...(targetType === 'SPECIFIC' && { targetUserIds: targetUsers })
      };

      // TODO: Replace with real API call
      // await axios.post(`${BaseURL}/api/v1/notifications`, payload, {
      //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      // });

      alert('Notification sent successfully!');

      // Reset form
      setNotification({ title: '', message: '', type: 'GENERAL' });
      setTargetType('ALL');
      setTargetRole('');
      setTargetUsers([]);

      fetchSentNotifications();
    } catch (error) {
      alert('Error sending notification: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getRecipientCount = () => {
    if (targetType === 'ALL') return personnelList.length;
    if (targetType === 'ROLE') {
      return personnelList.filter(p => p.role === targetRole).length;
    }
    return targetUsers.length;
  };

  const handleUserToggle = (userId) => {
    setTargetUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Send Notifications</h1>
          <p>Broadcast messages to personnel</p>
        </div>
      </div>

      <div className="notification-sender-container">
        {/* Send Form */}
        <div className="sender-form-card">
          <h2>Bildirim Oluştur</h2>

          <form onSubmit={handleSendNotification}>
            {/* Target Selection */}
            <div className="form-group">
              <label>Şunlara Gönder:</label>
              <div className="target-type-selector">
                <button
                  type="button"
                  className={`target-btn ${targetType === 'ALL' ? 'active' : ''}`}
                  onClick={() => setTargetType('ALL')}
                >
                  Bütün Personel
                </button>
                <button
                  type="button"
                  className={`target-btn ${targetType === 'ROLE' ? 'active' : ''}`}
                  onClick={() => setTargetType('ROLE')}
                >
                  Belirli Rol
                </button>
                <button
                  type="button"
                  className={`target-btn ${targetType === 'SPECIFIC' ? 'active' : ''}`}
                  onClick={() => setTargetType('SPECIFIC')}
                >
                  Belirli Kişi
                </button>
              </div>
            </div>

            {/* Role Selection */}
            {targetType === 'ROLE' && (
              <div className="form-group">
                <label>Rol Seç:</label>
                <select
                  required
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                >
                  <option value="">Bir rol seç...</option>
                  <option value="DOCTOR">Doktor</option>
                  <option value="CLEANER">Temizlikçi</option>
                  <option value="CASHIER">Kasa</option>
                  <option value="LAB_TECH">Lab Teknikeri</option>
                </select>
              </div>
            )}

            {/* User Selection */}
            {targetType === 'SPECIFIC' && (
              <div className="form-group">
                <label>Personel Seç:</label>
                <div className="user-selector-list">
                  {personnelList.map((person) => (
                    <label key={person.id} className="user-checkbox">
                      <input
                        type="checkbox"
                        checked={targetUsers.includes(person.id)}
                        onChange={() => handleUserToggle(person.id)}
                      />
                      <span>{person.firstName} {person.lastName}</span>
                      <span className="user-role-badge">{person.role}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Recipient Count */}
            <div className="recipient-count-display">
              Şuna Gönderilecek: <strong>{getRecipientCount()}</strong> {getRecipientCount() === 1 ? 'person' : 'people'}
            </div>

            {/* Notification Type */}
            <div className="form-group">
              <label>Bildirim Türü:</label>
              <select
                required
                value={notification.type}
                onChange={(e) => setNotification({ ...notification, type: e.target.value })}
              >
                <option value="GENERAL">Genel</option>
                <option value="ADMIN_MESSAGE">Admin Mesajı</option>
                <option value="LEAVE_REQUEST">İzin Talebi</option>
                <option value="APPOINTMENT">Randevu</option>
                <option value="CLEANING">Temizlik</option>
              </select>
            </div>

            {/* Title */}
            <div className="form-group">
              <label>Bildirim Başlığı:</label>
              <input
                type="text"
                required
                maxLength="100"
                value={notification.title}
                onChange={(e) => setNotification({ ...notification, title: e.target.value })}
                placeholder="Bildirim başlığı..."
              />
            </div>

            {/* Message */}
            <div className="form-group">
              <label>Bildirim Mesajı:</label>
              <textarea
                required
                rows="5"
                maxLength="500"
                value={notification.message}
                onChange={(e) => setNotification({ ...notification, message: e.target.value })}
                placeholder="Bildirim mesajı..."
              />
              <small>{notification.message.length}/500 karakter</small>
            </div>

            {/* Preview */}
            <div className="notification-preview">
              <h4>Önizleme:</h4>
              <div className="preview-card">
                <strong>{notification.title || 'Title will appear here'}</strong>
                <p>{notification.message || 'Message will appear here'}</p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary btn-large"
              disabled={loading || getRecipientCount() === 0}
            >
              {loading ? 'Sending...' : 'Gönder'}
            </button>
          </form>
        </div>

        {/* Sent History */}
        <div className="sent-history-card">
          <h2>Gönderilen Bildirimler</h2>

          {sentNotifications.length === 0 ? (
            <p className="empty-message">Gönderilen bildirim yok</p>
          ) : (
            <div className="history-list">
              {sentNotifications.map((sent) => (
                <div key={sent.id} className="history-item">
                  <div className="history-header">
                    <h4>{sent.title}</h4>
                    <span className="recipient-badge">
                      {sent.recipientCount} alıcı
                    </span>
                  </div>
                  <div className="history-details">
                    <p>
                      <strong>Target:</strong> {sent.targetType}
                      {sent.targetRole && ` - ${sent.targetRole}`}
                    </p>
                    <p className="history-date">
                      {new Date(sent.sentAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* API Notice */}
      <div className="api-notice">
        <p><strong>⚠️ Backend API Required:</strong></p>
        <ul>
          <li>GET /api/v1/personnel - Fetch all personnel for selection</li>
          <li>POST /api/v1/notifications - Send notification to targets</li>
          <li>GET /api/v1/notifications/sent - Get admin's sent notification history</li>
        </ul>
        <p>See IMPLEMENTATION_CHECKLIST.md for details</p>
      </div>
    </div>
  );
}
