import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import { Upload, Check, AlertCircle, Loader2, Copy, CheckCircle2 } from 'lucide-react';
import VITE_API_BASE_URL from '../config/api';

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading: authLoading } = useAuth();

    const [paymentSettings, setPaymentSettings] = useState(null);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [copied, setCopied] = useState(false);

    // Get shipping data and cart info from checkout
    const shippingData = location.state?.shippingData || {};
    const cartItems = location.state?.cartItems || [];
    const userId = location.state?.userId || null;
    const cartTotal = location.state?.cartTotal || 0;

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [authLoading, user, navigate]);

    useEffect(() => {
        const fetchPaymentSettings = async () => {
            try {
                // Fetch payment settings
                const settingsRes = await axios.get(`${VITE_API_BASE_URL}/api/payment/settings`);
                setPaymentSettings(settingsRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching payment settings:', error);
                setLoading(false);
            }
        };

        if (user && !authLoading) {
            fetchPaymentSettings();
        }
    }, [user, authLoading]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file || !termsAccepted) {
            alert('Please select a file and accept the terms & conditions');
            return;
        }

        setUploading(true);
        setUploadStatus(null);

        try {
            // First, create the order
            const orderPayload = {
                items: cartItems.map(item => ({ id: item.id, quantity: item.quantity })),
                customer_details: shippingData,
                user_id: userId
            };

            const orderResponse = await axios.post(`${VITE_API_BASE_URL}/api/orders`, orderPayload);
            const createdOrder = orderResponse.data.order;
            setOrder(createdOrder);

            // Then upload the screenshot
            const formData = new FormData();
            formData.append('screenshot', file);

            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${VITE_API_BASE_URL}/api/payment/upload-screenshot/${createdOrder.id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            const uploadedOrder = response.data.order || createdOrder;
            setOrder(uploadedOrder);

            setUploadStatus({ type: 'success', message: 'Screenshot uploaded successfully! Your order has been submitted. Admin will review and approve shortly.' });
            setFile(null);
            setPreview(null);
            setTermsAccepted(false);
            
            // Redirect to order details after successful payment
            setTimeout(() => {
                navigate(`/order-details/${uploadedOrder.order_number}`);
            }, 2000);

        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus({
                type: 'error',
                message: error.response?.data?.message || 'Failed to upload screenshot'
            });
        } finally {
            setUploading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-auric-gold" size={48} />
            </div>
        );
    }

    if (!paymentSettings || !shippingData || !cartItems.length) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600">Unable to load payment details</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-auric-blush via-purple-50 to-white py-8 md:py-12">
            <div className="container mx-auto px-4 max-w-6xl relative">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="font-serif text-4xl font-bold text-auric-rose mb-3">Complete Your Payment</h1>
                    <p className="text-gray-600 text-lg">Amount to Pay: ₹{(order?.total_amount ?? cartTotal).toLocaleString()}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Payment Details Section */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Amount to Pay */}
                        <div className="bg-gradient-to-r from-auric-rose/10 to-purple-100 border-2 border-auric-rose rounded-2xl p-8">
                            <p className="text-gray-600 text-sm font-medium mb-2">Amount to Pay</p>
                            <h2 className="font-serif text-5xl font-bold text-auric-rose">₹{cartTotal.toLocaleString()}</h2>
                        </div>

                        {/* QR Code and UPI Details */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
                            <h3 className="font-serif text-2xl font-bold text-auric-rose mb-8 flex items-center gap-3">
                                <span className="w-10 h-10 bg-auric-rose text-white rounded-full flex items-center justify-center font-bold">1</span>
                                Payment via UPI/GPay
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* QR Code */}
                                <div className="flex flex-col items-center justify-center">
                                    {paymentSettings.qr_code_image && (
                                        <div className="bg-black p-4 rounded-xl">
                                            <img
                                                src={`${VITE_API_BASE_URL}/${paymentSettings.qr_code_image}`}
                                                alt="Payment QR Code"
                                                className="w-56 h-56 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                    <p className="text-sm text-gray-500 mt-4 text-center">Scan QR code to pay</p>
                                </div>

                                {/* UPI ID */}
                                <div className="flex flex-col justify-center space-y-6">
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium mb-2">Or enter UPI ID manually</p>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={paymentSettings.upi_id}
                                                readOnly
                                                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg font-mono text-sm"
                                            />
                                            <button
                                                onClick={() => copyToClipboard(paymentSettings.upi_id)}
                                                className="px-4 py-3 bg-auric-rose text-white rounded-lg hover:bg-auric-rose/90 transition-colors flex items-center gap-2"
                                            >
                                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {paymentSettings.account_holder && (
                                        <div>
                                            <p className="text-xs text-gray-500 mb-1">Account Holder</p>
                                            <p className="text-sm font-semibold text-gray-800">{paymentSettings.account_holder}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Payment Steps */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
                            <h3 className="font-serif text-2xl font-bold text-auric-rose mb-8 flex items-center gap-3">
                                <span className="w-10 h-10 bg-auric-rose text-white rounded-full flex items-center justify-center font-bold">2</span>
                                Payment Steps
                            </h3>

                            <div className="space-y-4">
                                {paymentSettings.instructions && paymentSettings.instructions.map((instruction, index) => (
                                    <div key={index} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                                        <div className="flex-shrink-0">
                                            <div className="w-8 h-8 bg-auric-rose text-white rounded-full flex items-center justify-center font-bold text-sm">
                                                {index + 1}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-gray-700">{instruction}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Uploaded Proof Preview */}
                        {order?.payment_screenshot && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
                                <h3 className="font-serif text-2xl font-bold text-auric-rose mb-6 flex items-center gap-3">
                                    <span className="w-10 h-10 bg-auric-rose text-white rounded-full flex items-center justify-center font-bold">3</span>
                                    Uploaded Payment Proof
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">Here is the screenshot we received for verification.</p>
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-center">
                                    <img
                                        src={`${VITE_API_BASE_URL}/${order.payment_screenshot}`}
                                        alt="Payment Proof"
                                        className="max-h-96 object-contain rounded-lg"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Screenshot Upload */}
                        {uploadStatus?.type !== 'success' && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-lg">
                                <h3 className="font-serif text-2xl font-bold text-auric-rose mb-6 flex items-center gap-3">
                                    <span className="w-10 h-10 bg-auric-rose text-white rounded-full flex items-center justify-center font-bold">3</span>
                                    Upload Payment Screenshot
                                </h3>

                                <p className="text-gray-600 text-sm mb-6">
                                    Upload a clear screenshot of your successful payment for verification
                                </p>

                                {/* File Upload Area */}
                                <div
                                    className="border-2 border-dashed border-auric-gold/50 rounded-xl p-8 mb-6 cursor-pointer hover:border-auric-rose transition-colors bg-auric-blush/50"
                                    onClick={() => document.getElementById('file-input').click()}
                                >
                                    <div className="flex flex-col items-center justify-center">
                                        <Upload className="text-auric-rose mb-3" size={32} />
                                        <p className="text-gray-700 font-medium mb-1">Click to upload or drag & drop</p>
                                        <p className="text-xs text-gray-500">Supports JPG, PNG, WEBP (Max 5MB)</p>
                                    </div>
                                    <input
                                        id="file-input"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </div>

                                {/* Preview */}
                                {preview && (
                                    <div className="mb-6">
                                        <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="max-w-full h-64 object-contain rounded-lg border border-gray-200"
                                        />
                                        <button
                                            onClick={() => {
                                                setFile(null);
                                                setPreview(null);
                                            }}
                                            className="mt-3 text-sm text-red-500 hover:text-red-700 font-medium"
                                        >
                                            Remove Image
                                        </button>
                                    </div>
                                )}

                                {/* Terms & Conditions */}
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={termsAccepted}
                                            onChange={(e) => setTermsAccepted(e.target.checked)}
                                            className="mt-1"
                                        />
                                        <span className="text-sm text-gray-700">
                                            I confirm that I have made the payment and the screenshot is genuine. I agree to the{' '}
                                            <a href="/terms" className="text-auric-rose hover:underline">Terms & Conditions</a>
                                            {' '}and{' '}
                                            <a href="/privacy" className="text-auric-rose hover:underline">Privacy Policy</a>
                                        </span>
                                    </label>
                                </div>

                                {/* Status Messages */}
                                {uploadStatus && (
                                    <div className={`mb-6 p-4 rounded-lg flex gap-3 ${
                                        uploadStatus.type === 'success'
                                            ? 'bg-green-50 border border-green-200'
                                            : 'bg-red-50 border border-red-200'
                                    }`}>
                                        {uploadStatus.type === 'success' ? (
                                            <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
                                        ) : (
                                            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                                        )}
                                        <p className={uploadStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                                            {uploadStatus.message}
                                        </p>
                                    </div>
                                )}

                                {/* Upload Button */}
                                <button
                                    onClick={handleUpload}
                                    disabled={!file || !termsAccepted || uploading}
                                    className="w-full py-3 bg-gradient-to-r from-auric-rose to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {uploading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={20} />
                                            Upload Screenshot
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Verification Status */}
                        {order?.payment_status === 'pending_approval' && (
                            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-8">
                                <div className="flex gap-4">
                                    <Loader2 className="text-blue-600 flex-shrink-0 animate-spin" size={24} />
                                    <div>
                                        <h4 className="font-bold text-blue-900 mb-2">Payment Under Verification</h4>
                                        <p className="text-blue-800 text-sm">
                                            Your payment screenshot has been received. Our admin will verify it shortly and update your order status.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {order?.payment_status === 'verified' && (
                            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8">
                                <div className="flex gap-4">
                                    <CheckCircle2 className="text-green-600 flex-shrink-0" size={24} />
                                    <div>
                                        <h4 className="font-bold text-green-900 mb-2">Payment Verified!</h4>
                                        <p className="text-green-800 text-sm">
                                            Your payment has been verified. Your order is confirmed and will be processed soon.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {order?.payment_status === 'rejected' && (
                            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                                <div className="flex gap-4">
                                    <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
                                    <div>
                                        <h4 className="font-bold text-red-900 mb-2">Payment Rejected</h4>
                                        <p className="text-red-800 text-sm mb-3">{order?.admin_notes || 'Your payment proof was not valid. Please try again.'}</p>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="text-red-700 font-semibold hover:text-red-900"
                                        >
                                            Upload Again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-4 bg-white rounded-2xl border border-gray-200 p-6 shadow-lg">
                            <h3 className="font-serif text-xl font-bold text-auric-rose mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                                {(order?.items || cartItems).map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{item.product_name || item.name}</span>
                                        <span className="font-semibold">₹{(item.price * (item.quantity || 1)).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-semibold">₹{(order?.total_amount ?? cartTotal).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax:</span>
                                    <span className="font-semibold">₹0</span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-gray-200 text-lg">
                                    <span className="text-auric-rose font-bold">Total:</span>
                                    <span className="text-auric-rose font-bold">₹{(order?.total_amount ?? cartTotal).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-auric-blush rounded-lg">
                                <p className="text-xs text-gray-600 mb-2">
                                    <strong>Reference ID:</strong> {order?.order_number || 'Pending' }
                                </p>
                                <p className="text-xs text-gray-600">
                                    <strong>Status:</strong> <span className="text-auric-rose font-semibold">{order?.payment_status || 'pending'}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
