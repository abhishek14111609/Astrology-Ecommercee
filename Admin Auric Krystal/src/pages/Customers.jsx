import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    Search,
    Eye,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Mail,
    Calendar,
    ShoppingBag,
    X,
    Star
} from 'lucide-react';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });

    const API_BASE = 'http://localhost:5000/api';

    useEffect(() => {
        let isMounted = true;

        const fetchCustomers = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE}/admin/customers`, {
                    params: {
                        page: pagination.page,
                        limit: pagination.limit,
                        search: searchQuery
                    },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                if (isMounted) {
                    setCustomers(response.data.customers);
                    setPagination(prev => ({ ...prev, ...response.data.pagination }));
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err.response?.data?.message || 'Failed to load customers');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        const debounce = setTimeout(fetchCustomers, 300);
        
        return () => {
            isMounted = false;
            clearTimeout(debounce);
        };
    }, [pagination.page, searchQuery]);

    const viewCustomerDetails = async (customerId) => {
        try {
            const response = await axios.get(`${API_BASE}/admin/customers/${customerId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSelectedCustomer(response.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to load customer details');
        }
    };

    const getRoleBadge = (role) => {
        return role === 'admin' ? 'badge-primary' : 'badge-secondary';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Customers</h1>
                    <p className="text-neutral-500 mt-1">Manage customer accounts</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="badge badge-primary">{pagination.total} Total</span>
                </div>
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
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                        className="input-ghost pl-10 w-full"
                    />
                </div>
            </div>

            {/* Customers Table */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 text-auric-purple animate-spin" />
                </div>
            ) : customers.length === 0 ? (
                <div className="card p-12 text-center">
                    <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-600">No customers found</h3>
                    <p className="text-neutral-500 mt-2">Customers will appear here once they register</p>
                </div>
            ) : (
                <>
                    <div className="card overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-neutral-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                            Zodiac Sign
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                            Joined Date
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {customers.map((customer) => (
                                        <tr key={customer.id} className="hover:bg-neutral-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-auric-purple to-auric-purple-dark rounded-full flex items-center justify-center text-white font-semibold">
                                                        {customer.name?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-neutral-900">
                                                            {customer.name || 'N/A'}
                                                        </p>
                                                        <p className="text-sm text-neutral-500 flex items-center gap-1">
                                                            <Mail size={12} />
                                                            {customer.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Star size={16} className="text-auric-gold" />
                                                    <span className="text-sm font-medium text-neutral-700">
                                                        {customer.zodiac_sign || 'Not set'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`badge ${getRoleBadge(customer.role)}`}>
                                                    {customer.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-neutral-600">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={14} />
                                                    {new Date(customer.created_at).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => viewCustomerDetails(customer.id)}
                                                    className="p-2 text-auric-purple hover:bg-auric-purple/10 rounded-lg transition-colors"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-neutral-600">
                                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                                {pagination.total} customers
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={pagination.page === 1}
                                    className="btn-secondary disabled:opacity-50"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <span className="px-4 py-2">
                                    Page {pagination.page} of {pagination.pages}
                                </span>
                                <button
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page === pagination.pages}
                                    className="btn-secondary disabled:opacity-50"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Customer Details Modal */}
            {selectedCustomer && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
                            <h2 className="text-2xl font-bold text-neutral-900">Customer Details</h2>
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div className="flex items-start gap-4">
                                <div className="w-20 h-20 bg-gradient-to-br from-auric-purple to-auric-purple-dark rounded-full flex items-center justify-center text-white font-bold text-2xl">
                                    {selectedCustomer.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold text-neutral-900">{selectedCustomer.name || 'N/A'}</h3>
                                    <p className="text-neutral-600 flex items-center gap-2 mt-1">
                                        <Mail size={16} />
                                        {selectedCustomer.email}
                                    </p>
                                    <div className="flex gap-2 mt-3">
                                        <span className={`badge ${getRoleBadge(selectedCustomer.role)}`}>
                                            {selectedCustomer.role}
                                        </span>
                                        {selectedCustomer.zodiac_sign && (
                                            <span className="badge badge-secondary flex items-center gap-1">
                                                <Star size={14} />
                                                {selectedCustomer.zodiac_sign}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="card p-4 bg-auric-purple/5">
                                    <p className="text-sm text-neutral-500">Customer ID</p>
                                    <p className="text-2xl font-bold text-auric-purple">{selectedCustomer.id}</p>
                                </div>
                                <div className="card p-4 bg-auric-emerald/5">
                                    <p className="text-sm text-neutral-500">Total Orders</p>
                                    <p className="text-2xl font-bold text-auric-emerald">
                                        {selectedCustomer.orders?.length || 0}
                                    </p>
                                </div>
                                <div className="card p-4 bg-auric-gold/5">
                                    <p className="text-sm text-neutral-500">Member Since</p>
                                    <p className="text-lg font-semibold text-auric-gold">
                                        {new Date(selectedCustomer.created_at).toLocaleDateString('en-IN', {
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Order History */}
                            <div className="border-t pt-4">
                                <h3 className="font-semibold mb-3 flex items-center gap-2">
                                    <ShoppingBag size={18} />
                                    Order History
                                </h3>
                                {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                                    <div className="space-y-3">
                                        {selectedCustomer.orders.slice(0, 5).map((order) => (
                                            <div key={order.id} className="flex justify-between items-center p-4 bg-neutral-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium">{order.order_number || `#${order.id}`}</p>
                                                    <p className="text-sm text-neutral-500">
                                                        {new Date(order.created_at).toLocaleDateString('en-IN')}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">₹{order.total_amount?.toLocaleString('en-IN')}</p>
                                                    <span className={`badge ${
                                                        order.status === 'delivered' ? 'badge-success' :
                                                        order.status === 'processing' ? 'badge-info' :
                                                        order.status === 'cancelled' ? 'badge-error' :
                                                        'badge-warning'
                                                    } text-xs`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {selectedCustomer.orders.length > 5 && (
                                            <p className="text-center text-sm text-neutral-500">
                                                + {selectedCustomer.orders.length - 5} more orders
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-neutral-500 text-center py-8">No orders yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
