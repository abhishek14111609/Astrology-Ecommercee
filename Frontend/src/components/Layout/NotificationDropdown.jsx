import React, { useState, useRef, useEffect } from 'react';
import { X, Trash2, Check, Bell, Loader2 } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

const NotificationDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { notifications, unreadCount, deletingIds, markAsRead, markAllAsRead, deleteNotification } = useNotification();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'order_status':
                return '📦';
            case 'booking_approved':
                return '✅';
            case 'booking_rejected':
                return '❌';
            case 'booking_pending':
                return '⏳';
            case 'payment_confirmed':
                return '💳';
            default:
                return '🔔';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'order_status':
                return 'border-l-blue-500';
            case 'booking_approved':
                return 'border-l-green-500';
            case 'booking_rejected':
                return 'border-l-red-500';
            case 'booking_pending':
                return 'border-l-yellow-500';
            case 'payment_confirmed':
                return 'border-l-auric-gold';
            default:
                return 'border-l-gray-400';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-gray-700 hover:text-auric-gold transition-colors focus:outline-none p-1"
                title="Notifications"
            >
                <Bell size={20} strokeWidth={2} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                        <h3 className="font-semibold text-gray-800">Notifications</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        markAllAsRead();
                                    }}
                                    className="text-xs text-auric-gold hover:text-auric-rose transition-colors"
                                    title="Mark all as read"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto flex-1">
                        {notifications.length === 0 ? (
                            <div className="px-4 py-8 text-center text-gray-400">
                                <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification._id || notification.id}
                                    className={`px-4 py-3 border-l-4 ${getNotificationColor(notification.type)} ${
                                        !notification.read ? 'bg-blue-50' : 'bg-white'
                                    } hover:bg-gray-50 transition-colors cursor-pointer border-b`}
                                    onClick={() => {
                                        if (!notification.read) {
                                            markAsRead(notification._id || notification.id);
                                        }
                                    }}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-start gap-2 flex-1">
                                            <span className="text-lg mt-0.5">
                                                {getNotificationIcon(notification.type)}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-800 text-sm leading-snug">
                                                    {notification.title}
                                                </h4>
                                                <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-gray-400 text-xs mt-2">
                                                    {new Date(notification.created_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {!notification.read && (
                                                <div className="w-2 h-2 rounded-full bg-auric-gold flex-shrink-0"></div>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNotification(notification._id || notification.id);
                                                }}
                                                className={`text-gray-400 hover:text-red-500 transition-colors p-1 ${deletingIds.has(notification._id || notification.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                title="Delete notification"
                                                disabled={deletingIds.has(notification._id || notification.id)}
                                            >
                                                {deletingIds.has(notification._id || notification.id) ? (
                                                    <Loader2 size={14} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={14} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-center">
                            <p className="text-xs text-gray-500">
                                Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
