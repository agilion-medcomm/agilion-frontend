import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5001";
  const BaseURL = `${API_BASE}/api/v1`;

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem('personnelToken');
    if (!token) return;

    try {

      const mockNotifications = [];

      const newUnreadCount = mockNotifications.filter(n => !n.read).length;
      const hadUnread = unreadCount === 0 && newUnreadCount > 0;

      setNotifications(mockNotifications);
      setUnreadCount(newUnreadCount);

      if (hadUnread && !sessionStorage.getItem('notificationAlertShown')) {
        setShowAlert(true);
        sessionStorage.setItem('notificationAlertShown', 'true');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const dismissAlert = () => {
    setShowAlert(false);
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      showAlert,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      dismissAlert
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
