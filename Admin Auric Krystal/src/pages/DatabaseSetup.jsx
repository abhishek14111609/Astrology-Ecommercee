import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Database,
    CheckCircle2,
    XCircle,
    Loader2,
    RefreshCw,
    AlertCircle,
    Server
} from 'lucide-react';

const DatabaseSetup = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initializing, setInitializing] = useState(false);
    const [seeding, setSeeding] = useState(false);
    const [error, setError] = useState(null);

    const API_BASE = 'http://localhost:5000/api';

    useEffect(() => {
        checkDatabaseStatus();
    }, []);

    const checkDatabaseStatus = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_BASE}/setup/database-status`);
            setStatus(response.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
        setLoading(false);
    };

    const initializeDatabase = async () => {
        setInitializing(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE}/setup/init-database`);
            alert('Database initialized successfully!');
            checkDatabaseStatus();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            alert('Failed to initialize database: ' + (err.response?.data?.message || err.message));
        }
        setInitializing(false);
    };

    const seedDatabase = async () => {
        setSeeding(true);
        setError(null);
        try {
            const response = await axios.post(`${API_BASE}/seed/seed-data`);
            alert(`Seed data inserted successfully!\nCategories: ${response.data.summary.categories}\nProducts: ${response.data.summary.products}\nAdmin Users: ${response.data.summary.users}\nCustomers: ${response.data.summary.customers}\nOrders: ${response.data.summary.orders}`);
            checkDatabaseStatus();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            alert('Failed to seed database: ' + (err.response?.data?.message || err.message));
        }
        setSeeding(false);
    };

    const testBackendConnection = async () => {
        try {
            const response = await axios.get(`${API_BASE}/health`);
            alert('Backend connection successful!\n' + JSON.stringify(response.data, null, 2));
        } catch (err) {
            alert('Backend connection failed: ' + err.message);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Database Setup</h1>
                    <p className="text-neutral-500 mt-1">Initialize and manage database connections</p>
                </div>
                <button
                    onClick={checkDatabaseStatus}
                    disabled={loading}
                    className="btn-secondary"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <RefreshCw size={18} />}
                    Refresh Status
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

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Initialize Database */}
                <div className="card p-6">
                    <div className="w-12 h-12 bg-auric-purple/10 rounded-xl flex items-center justify-center mb-4">
                        <Database size={24} className="text-auric-purple" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 mb-2">Initialize Database</h2>
                    <p className="text-neutral-600 text-sm mb-4">
                        Create all required tables in the MySQL database. This is safe to run multiple times.
                    </p>
                    <button
                        onClick={initializeDatabase}
                        disabled={initializing}
                        className="btn-primary w-full"
                    >
                        {initializing ? <Loader2 className="animate-spin" size={18} /> : <Database size={18} />}
                        {initializing ? 'Initializing...' : 'Initialize Database'}
                    </button>
                </div>

                {/* Seed Sample Data */}
                <div className="card p-6">
                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4">
                        <Database size={24} className="text-amber-600" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 mb-2">Seed Sample Data</h2>
                    <p className="text-neutral-600 text-sm mb-4">
                        Populate database with sample categories, products, and admin user for testing.
                    </p>
                    <button
                        onClick={seedDatabase}
                        disabled={seeding}
                        className="btn-secondary w-full"
                    >
                        {seeding ? <Loader2 className="animate-spin" size={18} /> : <Database size={18} />}
                        {seeding ? 'Seeding...' : 'Seed Data'}
                    </button>
                </div>

                {/* Test Backend Connection */}
                <div className="card p-6">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                        <Server size={24} className="text-emerald-600" />
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900 mb-2">Test Backend</h2>
                    <p className="text-neutral-600 text-sm mb-4">
                        Verify the connection between Admin Panel and Backend API server.
                    </p>
                    <button
                        onClick={testBackendConnection}
                        className="btn-secondary w-full"
                    >
                        <Server size={18} />
                        Test Connection
                    </button>
                </div>
            </div>

            {/* Database Status */}
            {status && (
                <div className="card p-6">
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">Database Tables Status</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(status.status).map(([table, info]) => (
                            <div
                                key={table}
                                className={`p-4 rounded-xl border-2 transition-all ${info.exists
                                    ? 'border-emerald-200 bg-emerald-50'
                                    : 'border-red-200 bg-red-50'
                                    }`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold text-neutral-900 capitalize">
                                        {table.replace(/_/g, ' ')}
                                    </h3>
                                    {info.exists ? (
                                        <CheckCircle2 size={20} className="text-emerald-600" />
                                    ) : (
                                        <XCircle size={20} className="text-red-600" />
                                    )}
                                </div>
                                {info.exists ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-emerald-700 font-semibold">
                                            {info.count} records
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-xs text-red-700 font-semibold">
                                        Table not found
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 p-4 bg-neutral-50 rounded-xl">
                        <p className="text-sm text-neutral-600">
                            <strong>Database:</strong> {status.database}
                        </p>
                    </div>
                </div>
            )}

            {/* Connection Info */}
            <div className="card p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Connection Configuration</h2>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                        <span className="text-sm font-semibold text-neutral-700">Backend API</span>
                        <code className="text-sm text-auric-purple bg-white px-3 py-1 rounded border">
                            http://localhost:5000
                        </code>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                        <span className="text-sm font-semibold text-neutral-700">Database</span>
                        <code className="text-sm text-auric-purple bg-white px-3 py-1 rounded border">
                            MySQL - auric_krystal
                        </code>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                        <span className="text-sm font-semibold text-neutral-700">Admin Panel</span>
                        <code className="text-sm text-auric-purple bg-white px-3 py-1 rounded border">
                            http://localhost:5174
                        </code>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatabaseSetup;
