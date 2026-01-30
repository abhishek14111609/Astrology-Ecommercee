import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, XCircle, Loader2, Eye, MessageSquare } from 'lucide-react';
import VITE_API_BASE_URL from '../config/api';

const PaymentManagement = () => {
    const { user } = useAuth();
    const [pendingPayments, setPendingPayments] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [approvalNotes, setApprovalNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        Promise.all([fetchPendingPayments(), fetchHistory()]).finally(() => setLoading(false));
    }, []);

    // Normalize base URL to avoid double /api
    const getBase = () => VITE_API_BASE_URL?.replace(/\/$/, '').replace(/\/api$/, '');

    // Build API URL without double /api
    const apiUrl = (path) => `${getBase()}/api${path}`;

    // Normalize image URLs to avoid /api prefix or missing host
    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const cleanPath = path.replace(/^\//, '');
        return `${getBase()}/${cleanPath}`;
    };

    const fetchPendingPayments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                apiUrl('/admin/payments/pending-payments'),
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPendingPayments(response.data);
         } catch (error) {
             console.error('Error fetching pending payments:', error);
         }
     };

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                apiUrl('/admin/payments/history'),
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setHistory(response.data || []);
        } catch (error) {
            console.error('Error fetching payment history:', error);
        }
    };

    const handleApprove = async () => {
        if (!selectedOrder) return;
        setProcessing(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                apiUrl(`/admin/payments/approve-payment/${selectedOrder.id}`),
                { adminNotes: approvalNotes },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setPendingPayments(pendingPayments.filter(p => p.id !== selectedOrder.id));
            setSelectedOrder(null);
            setApprovalNotes('');
            alert('Payment approved successfully!');
        } catch (error) {
            console.error('Error approving payment:', error);
            alert('Error approving payment');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!selectedOrder || !rejectionReason) {
            alert('Please provide a rejection reason');
            return;
        }
        setProcessing(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                apiUrl(`/admin/payments/reject-payment/${selectedOrder.id}`),
                { rejectionReason: rejectionReason },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setPendingPayments(pendingPayments.filter(p => p.id !== selectedOrder.id));
            setSelectedOrder(null);
            setRejectionReason('');
            alert('Payment rejected');
        } catch (error) {
            console.error('Error rejecting payment:', error);
            alert('Error rejecting payment');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin text-auric-gold" size={48} />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="font-serif text-3xl font-bold text-auric-rose mb-2">Payment Verification</h1>
                <p className="text-gray-600">Manage and verify UPI payment screenshots</p>
            </div>

            {pendingPayments.length === 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                    <CheckCircle2 className="mx-auto text-green-600 mb-3" size={48} />
                    <p className="text-green-800 font-semibold">All payments have been verified!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Payment List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg border border-gray-200">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50">
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pendingPayments.map((payment) => (
                                            <tr key={payment.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm font-medium text-auric-rose">
                                                    {payment.order_number}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {payment.customer_name}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-semibold">
                                                    ₹{payment.total_amount.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-sm">
                                                    <button
                                                        onClick={() => setSelectedOrder(payment)}
                                                        className="px-4 py-2 bg-auric-rose text-white rounded-lg hover:bg-auric-rose/90 flex items-center gap-2"
                                                    >
                                                        <Eye size={16} />
                                                        Review
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Details Panel */}
                    {selectedOrder && (
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
                                <h3 className="font-bold text-lg text-auric-rose mb-4">
                                    {selectedOrder.order_number}
                                </h3>

                                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Customer</p>
                                        <p className="text-sm font-semibold">{selectedOrder.customer_name}</p>
                                        <p className="text-xs text-gray-500">{selectedOrder.customer_email}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Amount</p>
                                        <p className="text-xl font-bold text-auric-rose">₹{selectedOrder.total_amount.toLocaleString()}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-2">Items</p>
                                        <div className="space-y-1">
                                            {selectedOrder.items.map((item, idx) => (
                                                <p key={idx} className="text-xs text-gray-700">
                                                    {item.product_name} x{item.quantity}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Screenshot */}
                                {selectedOrder.payment_screenshot && (
                                    <div className="mb-6">
                                        <p className="text-xs text-gray-500 font-medium mb-2">Screenshot</p>
                                        <img
                                            src={getImageUrl(selectedOrder.payment_screenshot)}
                                            alt="Payment Screenshot"
                                            className="w-full rounded-lg border border-gray-200 mb-3"
                                        />
                                        <a
                                            href={getImageUrl(selectedOrder.payment_screenshot)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-auric-rose hover:underline"
                                        >
                                            View Full Image
                                        </a>
                                    </div>
                                )}

                                {/* Approval Notes */}
                                <div className="mb-4">
                                    <label className="text-xs text-gray-500 font-medium mb-2 block">Approval Notes (Optional)</label>
                                    <textarea
                                        value={approvalNotes}
                                        onChange={(e) => setApprovalNotes(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                                        rows="3"
                                        placeholder="Add notes about this payment..."
                                    />
                                </div>

                                {/* Rejection Reason */}
                                <div className="mb-6">
                                    <label className="text-xs text-gray-500 font-medium mb-2 block">Rejection Reason (If Rejecting)</label>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                                        rows="2"
                                        placeholder="Why is this payment being rejected?"
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleApprove}
                                        disabled={processing}
                                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 font-semibold"
                                    >
                                        {processing ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
                                        Approve
                                    </button>

                                    <button
                                        onClick={handleReject}
                                        disabled={processing}
                                        className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2 font-semibold"
                                    >
                                        {processing ? <Loader2 className="animate-spin" size={16} /> : <XCircle size={16} />}
                                        Reject
                                    </button>

                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Verification History */}
            <div className="mt-10 bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="font-bold text-lg text-auric-rose">Payment Verification History</h2>
                        <p className="text-sm text-gray-600">Recent approved or rejected payments</p>
                    </div>
                </div>
                {history.length === 0 ? (
                    <p className="text-sm text-gray-500">No history yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                    <th className="px-4 py-3 text-left text-gray-700">Order</th>
                                    <th className="px-4 py-3 text-left text-gray-700">Customer</th>
                                    <th className="px-4 py-3 text-left text-gray-700">Status</th>
                                    <th className="px-4 py-3 text-left text-gray-700">Amount</th>
                                    <th className="px-4 py-3 text-left text-gray-700">Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-100">
                                        <td className="px-4 py-3 font-medium text-auric-rose">{item.order_number}</td>
                                        <td className="px-4 py-3 text-gray-700">{item.customer_name}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${item.payment_status === 'verified' || item.payment_status === 'approved' || item.payment_status === 'completed' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                                {item.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-semibold">₹{item.total_amount.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-gray-500 text-xs">{new Date(item.updated_at || item.payment_screenshot_uploaded_at || item.created_at).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentManagement;
