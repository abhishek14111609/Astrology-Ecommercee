import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Settings as SettingsIcon,
    Save,
    Loader2,
    AlertCircle,
    Globe,
    Mail,
    DollarSign,
    Truck,
    Shield
} from 'lucide-react';

const Settings = () => {
    const [settings, setSettings] = useState({
        site_name: '',
        support_email: '',
        currency: 'INR',
        shipping_fee: 0,
        maintenance_mode: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const API_BASE = 'http://localhost:5000/api';

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE}/settings`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setSettings(response.data);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load settings');
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.put(`${API_BASE}/settings`, settings, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSettings(response.data);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-32">
                <Loader2 className="w-12 h-12 text-auric-purple animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">Store Settings</h1>
                    <p className="text-neutral-500 mt-1">Manage global configuration for your store</p>
                </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div className="card p-4 border-red-200 bg-red-50 flex items-start gap-3">
                    <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                    <p className="text-red-700 text-sm">{error}</p>
                </div>
            )}
            {success && (
                <div className="card p-4 border-green-200 bg-green-50 flex items-start gap-3">
                    <Shield className="text-green-600 flex-shrink-0" size={20} />
                    <p className="text-green-700 text-sm">Settings saved successfully!</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* General Settings */}
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
                        <Globe className="text-auric-purple" size={20} />
                        General Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Site Name</label>
                            <input
                                type="text"
                                name="site_name"
                                value={settings.site_name}
                                onChange={handleChange}
                                className="input-ghost w-full"
                                placeholder="e.g. Auric Krystal"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Support Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                                <input
                                    type="email"
                                    name="support_email"
                                    value={settings.support_email}
                                    onChange={handleChange}
                                    className="input-ghost w-full pl-10"
                                    placeholder="support@example.com"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Financial Settings */}
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
                        <DollarSign className="text-auric-emerald" size={20} />
                        Finance & Shipping
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Currency Code</label>
                            <select
                                name="currency"
                                value={settings.currency}
                                onChange={handleChange}
                                className="input-ghost w-full"
                            >
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Standard Shipping Fee</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 font-bold">₹</span>
                                <input
                                    type="number"
                                    name="shipping_fee"
                                    value={settings.shipping_fee}
                                    onChange={handleChange}
                                    className="input-ghost w-full pl-8"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Status */}
                <div className="card p-6">
                    <h3 className="text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2">
                        <SettingsIcon className="text-neutral-600" size={20} />
                        System Status
                    </h3>
                    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-100">
                        <div>
                            <h4 className="font-semibold text-neutral-900">Maintenance Mode</h4>
                            <p className="text-sm text-neutral-500">Temporarily disable the storefront for customers</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="maintenance_mode"
                                checked={settings.maintenance_mode}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-auric-purple/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-auric-purple"></div>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn-primary flex items-center gap-2 px-8 py-3"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Settings;
