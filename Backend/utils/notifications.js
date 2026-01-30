import { connect } from '../db.js';
import Notification from '../models/Notification.js';

/**
 * Create a notification for a user
 * @param {number} userId - The user ID to notify
 * @param {string} type - Type of notification (order_status, booking_approved, booking_rejected, booking_pending, payment_confirmed)
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {number} relatedId - ID of related order or booking
 * @param {string} relatedType - Type of related entity (order or booking)
 */
export async function createNotification(userId, type, title, message, relatedId, relatedType) {
    try {
        await connect();
        await Notification.create({
            user_id: userId,
            type,
            title,
            message,
            read: false,
            related_id: relatedId,
            related_type: relatedType,
            created_at: new Date()
        });
    } catch (error) {
        console.error('Error creating notification:', error.message);
    }
}

/**
 * Create order status update notification
 */
export async function notifyOrderStatusUpdate(userId, orderId, newStatus, orderNumber) {
    const statusMessages = {
        'pending': 'Your order is being processed',
        'confirmed': 'Your order has been confirmed',
        'shipped': 'Your order has been shipped! 📦',
        'delivered': 'Your order has been delivered! 🎉',
        'cancelled': 'Your order has been cancelled',
        'payment_pending': 'Payment is pending for your order'
    };

    const message = statusMessages[newStatus] || `Your order status has been updated to ${newStatus}`;
    
    await createNotification(
        userId,
        'order_status',
        `Order ${orderNumber} - Status Update`,
        message,
        orderId,
        'order'
    );
}

/**
 * Create booking status notification
 */
export async function notifyBookingStatusUpdate(userId, bookingId, status, serviceTitle) {
    let type, title, message;

    if (status === 'approved') {
        type = 'booking_approved';
        title = `Booking Approved - ${serviceTitle}`;
        message = `Great! Your booking for ${serviceTitle} has been approved. ✅`;
    } else if (status === 'rejected') {
        type = 'booking_rejected';
        title = `Booking Rejected - ${serviceTitle}`;
        message = `Unfortunately, your booking for ${serviceTitle} has been rejected. ❌`;
    } else if (status === 'pending') {
        type = 'booking_pending';
        title = `Booking Pending - ${serviceTitle}`;
        message = `Your booking for ${serviceTitle} is pending approval.`;
    } else {
        return; // Don't create notification for other statuses
    }

    await createNotification(userId, type, title, message, bookingId, 'booking');
}

export default { createNotification, notifyOrderStatusUpdate, notifyBookingStatusUpdate };
