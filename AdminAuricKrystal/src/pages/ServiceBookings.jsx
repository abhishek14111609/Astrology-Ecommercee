import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VITE_API_BASE_URL from '../config/api';
import { Calendar, Clock, User, Mail, Phone, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const ServiceBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${VITE_API_BASE_URL}/api/admin/service-bookings`, {
                withCredentials: true
            });
            setBookings(response.data);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
            setError(error.response?.data?.message || 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (bookingId, status, adminNotes = '') => {
        try {
            await axios.put(`${VITE_API_BASE_URL}/api/admin/service-bookings/update-status/${bookingId}`, {
                status,
                admin_notes: adminNotes
            }, { withCredentials: true });
            fetchBookings(); // Refresh list
            alert(`Booking ${status} successfully!`);
        } catch (error) {
            alert('Failed to update booking status');
        }
    };

    const filteredBookings = bookings.filter(booking => {
        if (filter === 'all') return true;
        return booking.status === filter;
    });

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-700',
            approved: 'bg-green-100 text-green-700',
            rejected: 'bg-red-100 text-red-700'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${styles[status]}`}>
                {status}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-auric-gold" size={48} />
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-auric-rose mb-2">Service Bookings</h1>
                <p className="text-gray-600">Manage customer booking requests</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-200">
                {['all', 'pending', 'approved', 'rejected'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-6 py-3 font-medium capitalize transition-colors ${
                            filter === status 
                                ? 'text-auric-gold border-b-2 border-auric-gold' 
                                : 'text-gray-500 hover:text-auric-rose'
                        }`}
                    >
                        {status} ({bookings.filter(b => status === 'all' || b.status === status).length})
                    </button>
                ))}
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                </div>
            )}

            {/* Bookings List */}
            <div className="space-y-4">
                {filteredBookings.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                        <p className="text-gray-500">No bookings found</p>
                    </div>
                ) : (
                    filteredBookings.map(booking => (
                        <div key={booking.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-auric-rose mb-1">
                                        {booking.service_title}
                                    </h3>
                                    <p className="text-sm text-gray-500 uppercase tracking-wider">{booking.service_subtitle}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xl font-bold text-auric-gold">{booking.service_price}</span>
                                    {getStatusBadge(booking.status)}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 text-sm">
                                    <User size={16} className="text-auric-gold" />
                                    <span className="font-medium">{booking.user_name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail size={16} className="text-auric-gold" />
                                    <span>{booking.user_email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Phone size={16} className="text-auric-gold" />
                                    <span>{booking.user_phone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar size={16} className="text-auric-gold" />
                                    <span>{new Date(booking.preferred_date).toLocaleDateString()}</span>
                                    <Clock size={16} className="text-auric-gold ml-2" />
                                    <span>{booking.preferred_time}</span>
                                </div>
                            </div>

                            {booking.message && (
                                <div className="mb-4 p-4 bg-auric-blush/20 rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Customer Message:</p>
                                    <p className="text-sm text-gray-600">{booking.message}</p>
                                </div>
                            )}

                            {booking.admin_notes && (
                                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Admin Notes:</p>
                                    <p className="text-sm text-gray-600">{booking.admin_notes}</p>
                                </div>
                            )}

                            {booking.status === 'pending' && (
                                <div className="flex gap-3 mt-4">
                                    <button
                                        onClick={() => handleUpdateStatus(booking.id, 'approved')}
                                        className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        <CheckCircle size={18} />
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => {
                                            const notes = prompt('Reason for rejection (optional):');
                                            handleUpdateStatus(booking.id, 'rejected', notes || '');
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        <XCircle size={18} />
                                        Reject
                                    </button>
                                </div>
                            )}

                            <div className="text-xs text-gray-400 mt-4">
                                Submitted: {new Date(booking.created_at).toLocaleString()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ServiceBookings;
