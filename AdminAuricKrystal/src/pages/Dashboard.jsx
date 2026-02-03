import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VITE_API_BASE_URL from '../config/api';
import {
    TrendingUp,
    TrendingDown,
    ShoppingBag,
    Users,
    Package,
    IndianRupee,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical,
    Star,
    Loader2,
    AlertCircle
} from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch all dashboard data in parallel
            const [statsRes, ordersRes, productsRes] = await Promise.all([
                axios.get(`${VITE_API_BASE_URL}/api/dashboard/stats`),
                axios.get(`${VITE_API_BASE_URL}/api/dashboard/recent-orders?limit=5`),
                axios.get(`${VITE_API_BASE_URL}/api/dashboard/top-products?limit=4`)
            ]);

            // Format stats data
            const statsData = [
                {
                    label: 'Total Revenue',
                    value: `₹${parseFloat(statsRes.data.revenue.value).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
                    change: `${statsRes.data.revenue.change}%`,
                    trend: statsRes.data.revenue.trend,
                    icon: IndianRupee,
                    color: 'from-auric-purple to-auric-purple-dark',
                    iconBg: 'bg-auric-purple/10',
                    iconColor: 'text-auric-purple'
                },
                {
                    label: 'Total Products',
                    value: statsRes.data.products.value.toString(),
                    change: statsRes.data.products.change,
                    trend: statsRes.data.products.trend,
                    icon: ShoppingBag,
                    color: 'from-auric-emerald to-auric-emerald-light',
                    iconBg: 'bg-auric-emerald/10',
                    iconColor: 'text-auric-emerald'
                },
                {
                    label: 'Active Orders',
                    value: statsRes.data.activeOrders.value.toString(),
                    change: statsRes.data.activeOrders.change,
                    trend: statsRes.data.activeOrders.trend,
                    icon: Package,
                    color: 'from-auric-amber to-auric-amber-light',
                    iconBg: 'bg-auric-amber/10',
                    iconColor: 'text-auric-amber'
                },
                {
                    label: 'Total Customers',
                    value: statsRes.data.customers.value.toString(),
                    change: statsRes.data.customers.change,
                    trend: statsRes.data.customers.trend,
                    icon: Users,
                    color: 'from-auric-gold to-auric-accent',
                    iconBg: 'bg-auric-gold/10',
                    iconColor: 'text-auric-gold'
                }
            ];

            setStats(statsData);
            setRecentOrders(ordersRes.data);
            setTopProducts(productsRes.data);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
        }
        setLoading(false);
    };

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            await fetchDashboardData();
        };

        if (isMounted) {
            loadData();
        }

        return () => {
            isMounted = false;
        };
    }, []);

    const getStatusColor = (status) => {
        const normalizedStatus = status?.toLowerCase() || '';
        
        // Order statuses
        if (normalizedStatus === 'delivered' || normalizedStatus === 'completed' || normalizedStatus === 'confirmed') {
            return 'badge-success';
        }
        if (normalizedStatus === 'shipped' || normalizedStatus === 'processing' || normalizedStatus === 'processed') {
            return 'badge-info';
        }
        if (normalizedStatus === 'pending' || normalizedStatus === 'pending_approval') {
            return 'badge-warning';
        }
        if (normalizedStatus === 'payment_rejected' || normalizedStatus === 'rejected' || normalizedStatus === 'cancelled') {
            return 'badge-error';
        }
        
        return 'badge-neutral';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">
                        Dashboard Overview
                    </h1>
                    <p className="text-neutral-500 mt-1">
                        Welcome back! Here's what's happening with your store today.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <select className="input-ghost text-sm">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                        <option>This year</option>
                    </select>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="card p-4 border-red-200 bg-red-50">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                        <div>
                            <h3 className="font-semibold text-red-900">Error Loading Dashboard</h3>
                            <p className="text-sm text-red-700 mt-1">{error}</p>
                            <p className="text-xs text-red-600 mt-2">
                                Make sure the backend is running and database is initialized.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && stats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32">
                    <Loader2 className="w-12 h-12 text-auric-purple animate-spin mb-4" />
                    <p className="text-neutral-500 font-semibold">Loading dashboard data...</p>
                </div>
            ) : (
                <>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card relative overflow-hidden">
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                                        <stat.icon size={24} className={stat.iconColor} />
                                    </div>
                                    <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === 'up' ? 'text-auric-emerald' : 'text-auric-crimson'
                                        }`}>
                                        {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                        {stat.change}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-neutral-500 text-sm font-medium mb-1">{stat.label}</p>
                                    <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
                                </div>
                                <div className={`absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-5 rounded-full translate-x-12 translate-y-12`} />
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Orders */}
                        <div className="lg:col-span-2 card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-neutral-900">Recent Orders</h2>
                                    <p className="text-sm text-neutral-500 mt-1">Latest customer purchases</p>
                                </div>
                                <button className="btn-ghost text-sm">
                                    View All
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-neutral-100">
                                            <th className="text-left py-3 px-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Order ID</th>
                                            <th className="text-left py-3 px-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Customer</th>
                                            <th className="text-left py-3 px-4 text-xs font-bold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Product</th>
                                            <th className="text-left py-3 px-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Amount</th>
                                            <th className="text-left py-3 px-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentOrders.map((order, index) => (
                                            <tr key={index} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                                                <td className="py-4 px-4">
                                                    <span className="text-sm font-semibold text-neutral-900">{order.id}</span>
                                                    <p className="text-xs text-neutral-400 mt-0.5">{order.time}</p>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="text-sm font-medium text-neutral-700">{order.customer}</span>
                                                </td>
                                                <td className="py-4 px-4 hidden md:table-cell">
                                                    <span className="text-sm text-neutral-600">{order.product}</span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className="text-sm font-semibold text-neutral-900">{order.amount}</span>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <span className={`badge ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Top Products */}
                        <div className="card p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-xl font-bold text-neutral-900">Top Products</h2>
                                    <p className="text-sm text-neutral-500 mt-1">Best performers</p>
                                </div>
                                <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                                    <MoreVertical size={18} className="text-neutral-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {topProducts.map((product, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors group">
                                        <div className="w-12 h-12 bg-gradient-to-br from-auric-purple/10 to-auric-purple/5 rounded-lg flex items-center justify-center text-2xl font-bold text-auric-purple">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-neutral-900 mb-1 truncate">
                                                {product.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex items-center gap-1">
                                                    <Star size={14} className="text-auric-amber fill-auric-amber" />
                                                    <span className="text-xs font-semibold text-neutral-700">{product.rating}</span>
                                                </div>
                                                <span className="text-xs text-neutral-400">•</span>
                                                <span className="text-xs text-neutral-500">{product.sales} sales</span>
                                            </div>
                                            <p className="text-sm font-bold text-auric-purple">{product.revenue}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
