import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, Settings, LogOut, ChevronRight, Loader2, Calendar, Clock } from 'lucide-react';
import Button from '../components/UI/Button';
import SectionHeading from '../components/UI/SectionHeading';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import VITE_API_BASE_URL from '../config/api';

const Profile = () => {
    const navigate = useNavigate();
    const { user, logout, loading: authLoading } = useAuth();

    // State for orders
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
            return; // Important: exit early
        }

        const fetchOrders = async () => {
            if (!user) return;
            setLoading(true);
            try {
                const res = await axios.get(`${VITE_API_BASE_URL}/api/orders/myorders`);
                setOrders(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error('Failed to fetch orders', err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        const fetchBookings = async () => {
            if (!user) return;
            setBookingLoading(true);
            try {
                const res = await axios.get(`${VITE_API_BASE_URL}/api/service-bookings/my-bookings`);
                setBookings(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error('Failed to fetch bookings', err);
                setBookings([]);
            } finally {
                setBookingLoading(false);
            }
        };

        if (user) {
            fetchOrders();
            fetchBookings();
        }

    }, [user, authLoading, navigate]);

    if (authLoading || !user) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-auric-gold" /></div>;

    const displayUser = {
        name: user.name || "Seeker",
        email: user.email || "",
        joined: "January 2026",
        zodiac: user.zodiac_sign || "",
        avatar: null
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const confirmLogout = () => {
        setShowLogoutModal(true);
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };

    const menuItems = [
        { icon: <Package size={20} />, label: "My Orders", desc: "Track, return or buy again" },
        { icon: <MapPin size={20} />, label: "Saved Addresses", desc: "Manage your delivery locations" },
        { icon: <Settings size={20} />, label: "Account Settings", desc: "Update your profile and preferences" }
    ];

    const getBookingStatusClass = (status) => {
        if (status === 'approved') return 'bg-green-100 text-green-700';
        if (status === 'rejected') return 'bg-red-100 text-red-700';
        return 'bg-yellow-100 text-yellow-700';
    };

    return (
        <div className="bg-auric-blush min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-5xl">
                <SectionHeading title="Your Inner Sanctuary" subtitle="MY ACCOUNT" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">

                    {/* Sidebar / User Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                            <div className="w-24 h-24 bg-auric-blush rounded-full mx-auto flex items-center justify-center text-auric-rose mb-4 border-2 border-auric-gold/20">
                                <User size={48} />
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-auric-rose">{displayUser.name}</h3>
                            <p className="text-gray-500 text-sm mb-6">{displayUser.email}</p>
                            <div className="pt-6 border-t border-gray-50 flex flex-col gap-2">
                                <span className="text-[0.6rem] uppercase tracking-widest text-gray-400">Seeking since {displayUser.joined}</span>
                                {displayUser.zodiac && <span className="text-auric-gold text-xs font-bold uppercase tracking-widest">Sign: {displayUser.zodiac}</span>}
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {menuItems.map((item, idx) => (
                                <button key={idx} className="w-full flex items-center justify-between p-5 hover:bg-auric-blush/30 transition-colors border-b border-gray-50 last:border-0 group">
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="text-auric-gold">{item.icon}</div>
                                        <div>
                                            <div className="text-sm font-bold text-auric-rose">{item.label}</div>
                                            <div className="text-[0.7rem] text-gray-400">{item.desc}</div>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-auric-gold transition-colors" />
                                </button>
                            ))}
                            <button onClick={confirmLogout} className="w-full flex items-center gap-4 p-5 text-red-400 hover:bg-red-50 transition-colors">
                                <LogOut size={20} />
                                <span className="text-sm font-bold">Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content / Recent Activity */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-serif text-xl font-bold text-auric-rose mb-6 flex items-center gap-2">
                                <Package className="text-auric-gold" size={20} /> Recent Orders
                            </h3>

                            {loading ? (
                                <div className="flex justify-center py-10">
                                    <Loader2 className="animate-spin text-auric-gold" />
                                </div>
                            ) : orders.length > 0 ? (
                                <div className="space-y-4">
                                    {orders.map((order) => (
                                        <div key={order.order_number} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border border-gray-100 hover:border-auric-gold/30 transition-colors bg-gray-50/50">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-auric-gold mb-1">{order.order_number}</span>
                                                <span className="text-sm font-medium text-auric-rose">{new Date(order.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-4 md:mt-0 gap-8">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[0.6rem] uppercase tracking-widest text-gray-400">Total</span>
                                                    <span className="text-sm font-bold text-auric-rose">₹{order.total_amount}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className={`px-3 py-1 text-[0.6rem] font-bold rounded-full uppercase tracking-widest ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {order.status}
                                                    </span>
                                                    <Button
                                                        variant="outline"
                                                        className="text-[0.6rem] py-1 px-3 border-auric-gold text-auric-gold"
                                                        onClick={() => navigate(`/order-details/${order.order_number}`)}
                                                    >
                                                        View Details
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-6">No orders found.</p>
                            )}

                            {orders.length > 5 && (
                                <button className="w-full text-center mt-6 text-sm font-bold text-auric-gold hover:underline">View All Orders</button>
                            )}
                        </div>

                        {/* Service Bookings */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-serif text-xl font-bold text-auric-rose mb-6 flex items-center gap-2">
                                <Calendar className="text-auric-gold" size={20} /> Service Bookings
                            </h3>

                            {bookingLoading ? (
                                <div className="flex justify-center py-10">
                                    <Loader2 className="animate-spin text-auric-gold" />
                                </div>
                            ) : bookings.length > 0 ? (
                                <div className="space-y-4">
                                    {bookings.map((booking) => (
                                        <div key={booking.id} className="p-5 rounded-xl border border-gray-100 bg-gray-50/50">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <div className="text-xs uppercase tracking-widest text-auric-gold mb-1">
                                                        {booking.service_subtitle || 'Service Booking'}
                                                    </div>
                                                    <div className="text-sm font-bold text-auric-rose">
                                                        {booking.service_title}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {booking.service_price}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Calendar size={14} className="text-auric-gold" />
                                                        {booking.preferred_date ? new Date(booking.preferred_date).toLocaleDateString() : 'N/A'}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                                        <Clock size={14} className="text-auric-gold" />
                                                        {booking.preferred_time || 'N/A'}
                                                    </div>
                                                    <span className={`px-3 py-1 text-[0.6rem] font-bold rounded-full uppercase tracking-widest ${getBookingStatusClass(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                            </div>
                                            {booking.message && (
                                                <p className="text-xs text-gray-500 mt-3">Message: {booking.message}</p>
                                            )}
                                            {booking.admin_notes && (
                                                <p className="text-xs text-gray-500 mt-2">Admin Notes: {booking.admin_notes}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-6">No service bookings found.</p>
                            )}
                        </div>

                        {/* Recommendation Banner */}
                        {/* <div className="bg-auric-rose rounded-2xl p-8 text-white relative overflow-hidden">
                            <div className="relative z-10 max-w-md">
                                <h3 className="font-serif text-2xl font-bold mb-4">Complete Your Aura</h3>
                                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                                    Based on your recent journey, we suggest exploring our collection for spiritual harmony.
                                </p>
                                <Button variant="primary" className="text-xs py-2 px-6">Explore Recommendations</Button>
                            </div>
                            <div className="absolute -top-10 -right-10 w-48 h-48 bg-auric-gold/10 rounded-full blur-3xl"></div>
                            <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 opacity-20 rotate-12">
                                <User size={160} />
                            </div>
                        </div> */}
                    </div>

                </div>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full mx-auto flex items-center justify-center mb-4">
                                <LogOut className="text-red-500" size={32} />
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-auric-rose mb-3">
                                Confirm Logout
                            </h3>
                            <p className="text-gray-600 mb-8">
                                Are you sure you want to log out? You'll need to sign in again to access your account.
                            </p>
                            <div className="flex gap-4">
                                <Button
                                    onClick={cancelLogout}
                                    variant="secondary"
                                    className="flex-1 py-3"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleLogout}
                                    className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white"
                                >
                                    Log Out
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
