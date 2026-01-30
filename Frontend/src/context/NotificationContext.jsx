import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [deletingIds, setDeletingIds] = useState(() => new Set());
    const { user } = useAuth();

    // Fetch notifications from backend
    const fetchNotifications = useCallback(async () => {
        if (!user) return;
        try {
            const res = await axios.get(`${API_BASE_URL}/api/notifications/my-notifications`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setNotifications(res.data);
            const unread = res.data.filter(n => !n.read).length;
            setUnreadCount(unread);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    }, [user]);

    // Fetch notifications on user change
    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll for new notifications every 30 seconds
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user, fetchNotifications]);

    // Add a new notification (used when triggered by events)
    const addNotification = useCallback((notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
    }, []);

    // Mark notification as read
    const markAsRead = useCallback(async (notificationId) => {
        try {
            await axios.put(
                `${API_BASE_URL}/api/notifications/${notificationId}/read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setNotifications(prev =>
                prev.map(n =>
                    n.id === notificationId ? { ...n, read: true } : n
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    }, []);

    // Mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        try {
            await axios.put(
                `${API_BASE_URL}/api/notifications/mark-all-read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setNotifications(prev =>
                prev.map(n => ({ ...n, read: true }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    }, []);

    // Delete a notification
    const deleteNotification = useCallback(async (notificationId) => {
        if (deletingIds.has(notificationId)) return;
        setDeletingIds(prev => new Set(prev).add(notificationId));

        let removedNotification = null;
        setNotifications(prev => {
            removedNotification = prev.find(n => n.id === notificationId || n._id === notificationId);
            const newNotifications = prev.filter(n => n.id !== notificationId && n._id !== notificationId);
            if (removedNotification && !removedNotification.read) {
                setUnreadCount(prevCount => Math.max(0, prevCount - 1));
            }
            return newNotifications;
        });

        try {
            await axios.delete(
                `${API_BASE_URL}/api/notifications/${notificationId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
        } catch (error) {
            console.error('Failed to delete notification:', error);
            // Re-sync from server if delete fails
            fetchNotifications();
        } finally {
            setDeletingIds(prev => {
                const next = new Set(prev);
                next.delete(notificationId);
                return next;
            });
        }
    }, [deletingIds, fetchNotifications]);

    const value = {
        notifications,
        unreadCount,
        deletingIds,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        fetchNotifications
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};
