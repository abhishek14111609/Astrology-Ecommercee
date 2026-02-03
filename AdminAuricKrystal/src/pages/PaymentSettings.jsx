import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Upload, Save, Loader2, AlertCircle, CheckCircle2, Plus, X } from 'lucide-react';
import VITE_API_BASE_URL from '../config/api';

const PaymentSettings = () => {
    const { user } = useAuth();
    const [settings, setSettings] = useState({
        upi_id: '',
        account_holder: '',
        qr_code_image: '',
        instructions: []
    });
    const [newInstruction, setNewInstruction] = useState('');
    const [qrFile, setQrFile] = useState(null);
    const [qrPreview, setQrPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState(null);

    const getBase = () => VITE_API_BASE_URL?.replace(/\/$/, '').replace(/\/api$/, '');
    const apiUrl = (path) => `${getBase()}/api${path}`;
    const getImageUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http')) return path;
        const cleanPath = path.replace(/^\//, '');
        return `${getBase()}/${cleanPath}`;
    };
    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await axios.get(
                apiUrl('/admin/payments/settings'),
                { headers: getAuthHeaders() }
            );
            if (response.data) {
                setSettings(response.data);
                if (response.data.qr_code_image) {
                    setQrPreview(getImageUrl(response.data.qr_code_image));
                }
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching settings:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSettings({
            ...settings,
            [name]: value
        });
    };

    const handleQrFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setQrFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setQrPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const addInstruction = () => {
        if (newInstruction.trim()) {
            setSettings({
                ...settings,
                instructions: [...settings.instructions, newInstruction.trim()]
            });
            setNewInstruction('');
        }
    };

    const removeInstruction = (index) => {
        setSettings({
            ...settings,
            instructions: settings.instructions.filter((_, i) => i !== index)
        });
    };

    const handleSave = async () => {
        setSaving(true);
        setStatus(null);

        try {
            const formData = new FormData();

            formData.append('upi_id', settings.upi_id);
            formData.append('account_holder', settings.account_holder);
            settings.instructions.forEach((instruction, index) => {
                formData.append(`instructions`, instruction);
            });

            if (qrFile) {
                formData.append('qrCode', qrFile);
            }

            const response = await axios.post(
                apiUrl('/admin/payments/settings'),
                formData,
                {
                    headers: {
                        ...getAuthHeaders(),
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            setSettings(response.data.settings);
            setQrFile(null);
            setStatus({
                type: 'success',
                message: 'Payment settings updated successfully!'
            });

            setTimeout(() => setStatus(null), 3000);
        } catch (error) {
            console.error('Error saving settings:', error);
            setStatus({
                type: 'error',
                message: error.response?.data?.message || 'Error saving settings'
            });
        } finally {
            setSaving(false);
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
        <div className="p-6 max-w-4xl">
            <div className="mb-8">
                <h1 className="font-serif text-3xl font-bold text-auric-rose mb-2">Payment Settings</h1>
                <p className="text-gray-600">Configure UPI payment details and QR code</p>
            </div>

            {status && (
                <div className={`mb-6 p-4 rounded-lg flex gap-3 ${
                    status.type === 'success'
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-red-50 border border-red-200'
                }`}>
                    {status.type === 'success' ? (
                        <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
                    ) : (
                        <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                    )}
                    <p className={status.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                        {status.message}
                    </p>
                </div>
            )}

            <div className="space-y-8">
                {/* UPI ID Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="font-bold text-lg text-auric-rose mb-4">UPI Details</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                            <input
                                type="text"
                                name="upi_id"
                                value={settings.upi_id}
                                onChange={handleInputChange}
                                placeholder="e.g., username@upi"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-auric-rose focus:ring-1 focus:ring-auric-rose"
                            />
                            <p className="text-xs text-gray-500 mt-1">The UPI ID customers will use to send payment</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                            <input
                                type="text"
                                name="account_holder"
                                value={settings.account_holder}
                                onChange={handleInputChange}
                                placeholder="e.g., John Doe"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-auric-rose focus:ring-1 focus:ring-auric-rose"
                            />
                            <p className="text-xs text-gray-500 mt-1">Name shown on payment page</p>
                        </div>
                    </div>
                </div>

                {/* QR Code Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="font-bold text-lg text-auric-rose mb-4">QR Code</h2>

                    <div className="space-y-4">
                        {qrPreview && (
                            <div className="bg-black p-4 rounded-lg inline-block">
                                <img
                                    src={qrPreview}
                                    alt="QR Code Preview"
                                    className="w-48 h-48 object-cover rounded"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Upload QR Code</label>
                            <div
                                className="border-2 border-dashed border-auric-gold/50 rounded-lg p-6 cursor-pointer hover:border-auric-rose transition-colors bg-auric-blush/50"
                                onClick={() => document.getElementById('qr-file-input').click()}
                            >
                                <div className="flex flex-col items-center justify-center">
                                    <Upload className="text-auric-rose mb-2" size={28} />
                                    <p className="text-gray-700 font-medium text-sm">Click to upload QR code</p>
                                    <p className="text-xs text-gray-500">JPG, PNG, WEBP (Max 5MB)</p>
                                </div>
                                <input
                                    id="qr-file-input"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleQrFileChange}
                                    className="hidden"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                This QR code will be displayed on the payment page for customers to scan
                            </p>
                        </div>
                    </div>
                </div>

                {/* Payment Instructions Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="font-bold text-lg text-auric-rose mb-4">Payment Instructions</h2>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-600 mb-3">Add step-by-step instructions for customers to follow</p>

                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newInstruction}
                                    onChange={(e) => setNewInstruction(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            addInstruction();
                                        }
                                    }}
                                    placeholder="Add instruction step..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-auric-rose focus:ring-1 focus:ring-auric-rose"
                                />
                                <button
                                    onClick={addInstruction}
                                    className="px-4 py-2 bg-auric-rose text-white rounded-lg hover:bg-auric-rose/90 flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    Add
                                </button>
                            </div>

                            {settings.instructions.length > 0 && (
                                <div className="space-y-2">
                                    {settings.instructions.map((instruction, index) => (
                                        <div key={index} className="flex gap-3 items-start bg-gray-50 p-3 rounded-lg">
                                            <span className="bg-auric-rose text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                {index + 1}
                                            </span>
                                            <span className="text-sm text-gray-700 flex-1 pt-0.5">{instruction}</span>
                                            <button
                                                onClick={() => removeInstruction(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {settings.instructions.length === 0 && (
                                <div className="text-sm text-gray-500 text-center py-4">
                                    No instructions added yet. Add some to help customers with payment.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-6 py-3 bg-gradient-to-r from-auric-rose to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="animate-spin" size={20} />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={20} />
                                Save Settings
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSettings;
