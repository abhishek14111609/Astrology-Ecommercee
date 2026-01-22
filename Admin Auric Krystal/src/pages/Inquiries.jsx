import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    MessageSquare,
    Search,
    Trash2,
    Loader2,
    AlertCircle,
    Calendar,
    Mail,
    User,
    RefreshCw
} from 'lucide-react';

const Inquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const API_BASE = 'http://localhost:5000/api';

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_BASE}/contact`, {

            });
            setInquiries(response.data);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load inquiries');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            await axios.delete(`${API_BASE}/contact/${id}`, {

            });
            setInquiries(prev => prev.filter(inq => inq._id !== id));
        } catch (err) {
            alert('Failed to delete inquiry');
        }
    };

    const filteredInquiries = inquiries.filter(inq =>
        inq.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.subject?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Inquiries</h1>
                    <p className="text-neutral-500 mt-1">Manage customer messages and support requests</p>
                </div>
                <button
                    onClick={fetchInquiries}
                    className="btn-secondary flex items-center gap-2"
                >
                    <RefreshCw size={18} /> Refresh
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="card p-4 border-red-200 bg-red-50">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                        <div>
                            <h3 className="font-semibold text-red-900">Error</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            <div className="card p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email or subject..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input-ghost pl-10 w-full"
                    />
                </div>
            </div>

            {/* Inquiries List */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 text-auric-purple animate-spin" />
                </div>
            ) : filteredInquiries.length === 0 ? (
                <div className="card p-12 text-center">
                    <MessageSquare className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-600">No inquiries yet</h3>
                    <p className="text-neutral-500 mt-2">Messages from the 'Contact Us' page will appear here</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredInquiries.map((inq) => (
                        <div key={inq._id} className="card p-6 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-auric-purple/10 rounded-full flex items-center justify-center text-auric-purple">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-neutral-900">{inq.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-neutral-500">
                                                <Mail size={14} /> {inq.email}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                                        <h4 className="font-semibold text-neutral-800 mb-2">{inq.subject}</h4>
                                        <p className="text-neutral-600 text-sm leading-relaxed whitespace-pre-wrap">
                                            {inq.message}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-neutral-400">
                                        <Calendar size={12} />
                                        {new Date(inq.created_at).toLocaleString()}
                                    </div>
                                </div>

                                <div className="flex md:flex-col gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => window.location.href = `mailto:${inq.email}?subject=Re: ${inq.subject}`}
                                        className="btn-secondary text-xs py-2 px-3"
                                    >
                                        Reply
                                    </button>
                                    <button
                                        onClick={() => handleDelete(inq._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-right"
                                        title="Delete Message"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Inquiries;
