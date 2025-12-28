import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';
import './NotificationsPage.css';

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);

    switch (notification.type) {
      case 'LEAVE_REQUEST':
        navigate('/dashboard/leave-requests');
        break;
      case 'APPOINTMENT':
        navigate('/dashboard/appointments');
        break;
      case 'CLEANING':
        navigate('/dashboard/cleaning');
        break;
      default:
        break;
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1>Notifications</h1>
          <p>Stay updated with all your alerts</p>
        </div>
        {unreadNotifications.length > 0 && (
          <button className="btn-secondary" onClick={markAllAsRead}>
            Mark All as Read
          </button>
        )}
      </div>

      {unreadNotifications.length > 0 && (
        <div className="notifications-section">
          <h2 className="section-title">Unread ({unreadNotifications.length})</h2>
          <div className="notifications-list">
            {unreadNotifications.map((notification) => (
              <div
                key={notification.id}
                className="notification-card unread"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-indicator"></div>
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-body">
                  <h3>{notification.title}</h3>
                  <p>{notification.message}</p>
                  <span className="notification-timestamp">
                    {formatTimestamp(notification.createdAt)}
                  </span>
                </div>
                <span className={`notification-type-badge badge-${notification.type.toLowerCase()}`}>
                  {notification.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {readNotifications.length > 0 && (
        <div className="notifications-section">
          <h2 className="section-title">Earlier</h2>
          <div className="notifications-list">
            {readNotifications.map((notification) => (
              <div
                key={notification.id}
                className="notification-card read"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-body">
                  <h3>{notification.title}</h3>
                  <p>{notification.message}</p>
                  <span className="notification-timestamp">
                    {formatTimestamp(notification.createdAt)}
                  </span>
                </div>
                <span className={`notification-type-badge badge-${notification.type.toLowerCase()}`}>
                  {notification.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {notifications.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔔</div>
          <h3>No notifications</h3>
          <p>You're all caught up!</p>
        </div>
      )}
    </div>
  );
}

function getNotificationIcon(type) {
  switch (type) {
    case 'LEAVE_REQUEST':
      return '📅';
    case 'APPOINTMENT':
      return '🏥';
    case 'CLEANING':
      return '🧹';
    case 'GENERAL':
      return '📢';
    case 'ADMIN_MESSAGE':
      return '👤';
    default:
      return '🔔';
  }
}

function formatTimestamp(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString();
}
