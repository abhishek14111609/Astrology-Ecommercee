import React, { useState, useEffect } from 'react';
import SectionHeading from '../components/UI/SectionHeading';
import Button from '../components/UI/Button';
import { Package, Calendar, IndianRupee, CheckCircle2, AlertCircle, Clock, Loader2, ArrowLeft, XCircle } from 'lucide-react';
import API_BASE_URL from '../config/api';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TrackOrder = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!orderId) {
            setError('Order ID not found');
            return;
        }

        const fetchOrder = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.get(`${API_BASE_URL}/api/orders/${orderId}`);
                setOrder(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch order details');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const orderStatusMeta = {
        'pending': { cls: 'bg-yellow-50 border-yellow-200 text-yellow-700', icon: <Clock className="text-yellow-500" size={20} /> },
        'processed': { cls: 'bg-blue-50 border-blue-200 text-blue-700', icon: <CheckCircle2 className="text-blue-500" size={20} /> },
        'shipped': { cls: 'bg-purple-50 border-purple-200 text-purple-700', icon: <Package className="text-purple-500" size={20} /> },
        'delivered': { cls: 'bg-green-50 border-green-200 text-green-700', icon: <CheckCircle2 className="text-green-500" size={20} /> },
        'confirmed': { cls: 'bg-green-50 border-green-200 text-green-700', icon: <CheckCircle2 className="text-green-500" size={20} /> },
        'payment_rejected': { cls: 'bg-red-50 border-red-200 text-red-700', icon: <XCircle className="text-red-500" size={20} /> },
    };

    const paymentStatusMeta = {
        'pending': { cls: 'bg-yellow-50 border-yellow-200 text-yellow-700', icon: <Clock className="text-yellow-500" size={20} />, label: 'Pending' },
        'pending_approval': { cls: 'bg-blue-50 border-blue-200 text-blue-700', icon: <Loader2 className="text-blue-500 animate-spin" size={20} />, label: 'Pending Approval' },
        'approved': { cls: 'bg-green-50 border-green-200 text-green-700', icon: <CheckCircle2 className="text-green-500" size={20} />, label: 'Approved' },
        'verified': { cls: 'bg-green-50 border-green-200 text-green-700', icon: <CheckCircle2 className="text-green-500" size={20} />, label: 'Verified' },
        'completed': { cls: 'bg-green-50 border-green-200 text-green-700', icon: <CheckCircle2 className="text-green-500" size={20} />, label: 'Completed' },
        'rejected': { cls: 'bg-red-50 border-red-200 text-red-700', icon: <XCircle className="text-red-500" size={20} />, label: 'Rejected' },
    };

    const getOrderStatusMeta = (status) => orderStatusMeta[status?.toLowerCase()] || { cls: 'bg-gray-50 border-gray-200 text-gray-700', icon: <AlertCircle className="text-gray-500" size={20} /> };

    const getPaymentStatusMeta = (status) => paymentStatusMeta[status?.toLowerCase()] || { cls: 'bg-gray-50 border-gray-200 text-gray-700', icon: <AlertCircle className="text-gray-500" size={20} />, label: status || 'Pending' };

    if (loading) {
        return (
            <div className="bg-auric-blush min-h-screen py-16 flex items-center justify-center">
                <Loader2 className="animate-spin text-auric-gold" size={40} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-auric-blush min-h-screen py-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-auric-rose mb-8 hover:text-auric-gold transition">
                        <ArrowLeft size={20} /> Back
                    </button>
                    <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center">
                        <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="bg-auric-blush min-h-screen py-16">
                <div className="container mx-auto px-4 max-w-3xl">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-auric-rose mb-8 hover:text-auric-gold transition">
                        <ArrowLeft size={20} /> Back
                    </button>
                    <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center">
                        <p className="text-gray-500">Order not found</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-auric-blush min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-auric-rose mb-8 hover:text-auric-gold transition">
                    <ArrowLeft size={20} /> Back to Orders
                </button>

                <SectionHeading title="Order Details" subtitle={order.order_number} />

                {order.payment_status === 'rejected' && (
                    <div className="mt-8 bg-red-50 border border-red-300 rounded-2xl p-6 flex items-start gap-4">
                        <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
                        <div className="flex-1">
                            <h4 className="font-bold text-red-700 text-lg mb-3">Payment Rejected</h4>
                            {order.rejection_reason && (
                                <div className="bg-white border border-red-200 rounded-lg p-4 mb-4">
                                    <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-2">Admin's Reason:</p>
                                    <p className="text-red-700 text-sm">{order.rejection_reason}</p>
                                </div>
                            )}
                            <p className="text-red-600 text-sm mb-4">Please review the reason above and submit a new payment screenshot with the required details.</p>
                            <button onClick={() => navigate('/contact')} className="text-red-700 font-semibold text-sm hover:underline">
                                Contact Support for Help →
                            </button>
                        </div>
                    </div>
                )}

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Order Info Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-serif text-lg font-bold text-auric-rose mb-6 flex items-center gap-2">
                            <Package className="text-auric-gold" size={20} /> Order Information
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Order Number</span>
                                <span className="font-bold text-auric-rose">{order.order_number}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Date Placed</span>
                                <span className="font-medium text-auric-rose">{new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Total Items</span>
                                <span className="font-bold text-lg text-auric-gold">{order.items?.length || 0}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Subtotal</span>
                                <span className="font-medium text-auric-rose">₹{(order.subtotal || order.total_amount).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                                <span className="text-sm text-gray-600">Shipping</span>
                                <span className="font-medium text-auric-rose">₹{(order.shipping_cost || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-700">Total Amount</span>
                                <span className="font-bold text-xl text-auric-gold">₹{order.total_amount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-serif text-lg font-bold text-auric-rose mb-6">Status</h3>
                        <div className="space-y-6">
                            {/* Order Status */}
                            <div>
                                <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Order Status</span>
                                {(() => {
                                    const meta = getOrderStatusMeta(order.status);
                                    return (
                                        <div className={`mt-2 px-4 py-3 rounded-lg border flex items-center gap-3 ${meta.cls}`}>
                                            {meta.icon}
                                            <span className="font-bold capitalize">{order.status}</span>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Payment Status */}
                            <div>
                                <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Payment Status</span>
                                {(() => {
                                    const meta = getPaymentStatusMeta(order.payment_status);
                                    return (
                                        <div className={`mt-2 px-4 py-3 rounded-lg border flex items-center gap-3 ${meta.cls}`}>
                                            {meta.icon}
                                            <span className="font-bold capitalize">{meta.label || order.payment_status || 'Pending'}</span>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Payment Method */}
                            <div>
                                <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">Payment Method</span>
                                <div className="mt-2 px-4 py-3 rounded-lg border border-gray-200 bg-gray-50">
                                    <span className="font-medium text-auric-rose capitalize">{order.payment_method || 'Not specified'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Items Section */}
                {order.items && order.items.length > 0 && (
                    <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-serif text-lg font-bold text-auric-rose mb-6">Order Items</h3>
                        <div className="space-y-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-auric-gold/30 transition-colors bg-gray-50/50">
                                    <div className="flex-1">
                                        <p className="font-medium text-auric-rose">{item.product_name || item.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-auric-gold">₹{(item.price * item.quantity).toFixed(2)}</p>
                                        <p className="text-xs text-gray-500">₹{item.price.toFixed(2)} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Shipping Address */}
                {order.shipping_address && (
                    <div className="mt-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-serif text-lg font-bold text-auric-rose mb-6">Shipping Address</h3>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="font-medium text-auric-rose">{order.shipping_address.name}</p>
                            <p className="text-sm text-gray-700 mt-2">{order.shipping_address.address}</p>
                            <p className="text-sm text-gray-700">{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip_code}</p>
                            <p className="text-sm text-gray-700">{order.shipping_address.country}</p>
                            <p className="text-sm text-gray-700 mt-2">Phone: {order.shipping_address.phone}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
