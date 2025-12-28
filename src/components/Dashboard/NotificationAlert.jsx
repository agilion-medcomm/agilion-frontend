import React, { useEffect, useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import './NotificationAlert.css';

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function NotificationAlert() {
  const { unreadCount, showAlert, dismissAlert } = useNotifications();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (showAlert && unreadCount > 0) {
      setVisible(true);

      const timer = setTimeout(() => {
        handleClose();
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [showAlert, unreadCount]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      dismissAlert();
    }, 300);
  };

  if (!showAlert || unreadCount === 0) return null;

  return (
    <div className={`notification-alert ${visible ? 'visible shake' : ''}`}>
      <div className="alert-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      </div>

      <div className="alert-content">
        <h3>You have new notifications</h3>
        <p>{unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}</p>
      </div>

      <button onClick={handleClose} className="alert-close-btn" title="Dismiss">
        <CloseIcon />
      </button>
    </div>
  );
}
