import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import { ShieldCheck, CreditCard, Truck, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';
import API_BASE_URL, { buildImageUrl } from '../config/api';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [authLoading, user, navigate]);

    const [loading, setLoading] = useState(false);
    const [orderInfo, setOrderInfo] = useState(null);

    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        address: '',
        city: '',
        pincode: '',
        phone: ''
    });

    // Auto-fill shipping form with logged-in user details
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                email: user.email || prev.email,
                fullName: user.name || prev.fullName
            }));
        }
    }, [user]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = (e) => {
        if (e) e.preventDefault();
        setStep(step + 1);
        window.scrollTo(0, 0);
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            // Instead of creating order now, pass shipping details to payment page via state
            // Clear cart and navigate to payment page with shipping data
            clearCart();
            
            // Pass shipping form data and cart items via navigation state
            navigate(`/payment`, {
                state: {
                    shippingData: formData,
                    cartItems: cartItems,
                    userId: user?.id || null,
                    cartTotal: cartTotal
                }
            });
        } catch (error) {
            console.error("Order error", error);
            alert("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    // Show loader once hooks are declared to avoid hook order issues
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-auric-gold" />
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center bg-auric-blush px-4">
                <h1 className="font-serif text-2xl font-bold text-auric-rose mb-4">Your Cart is Empty</h1>
                <Link to="/shop">
                    <Button variant="primary">Return to Boutique</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-auric-blush min-h-screen py-12">
            <div className="container mx-auto px-4 max-w-6xl">

                {/* Checkout Steps Indicator (2 steps) */}
                <div className="flex items-center justify-center mb-12 space-x-4 md:space-x-8">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-auric-rose font-bold' : 'text-gray-400'}`}>
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-auric-rose text-white' : 'bg-gray-200'}`}>1</span>
                        <span className="hidden sm:inline">Shipping</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-auric-rose font-bold' : 'text-gray-400'}`}>
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-auric-rose text-white' : 'bg-gray-200'}`}>2</span>
                        <span className="hidden sm:inline">Payment</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Form Section */}
                        <div className="lg:col-span-8">
                            <div className="bg-white p-8 md:p-10 rounded-2xl border border-gray-100 shadow-sm">
                                {step === 1 ? (
                                    <form onSubmit={nextStep}>
                                        <h2 className="font-serif text-2xl font-bold text-auric-rose mb-8 flex items-center gap-3">
                                            <Truck className="text-auric-gold" size={24} /> Delivery Information
                                        </h2>

                                        <div className="space-y-6">
                                                    <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Full Name</label>
                                                <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-auric-gold transition-colors" placeholder="John Doe" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Email Address</label>
                                                <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-auric-gold transition-colors" placeholder="email@example.com" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Street Address</label>
                                                <input required name="address" value={formData.address} onChange={handleInputChange} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-auric-gold transition-colors" placeholder="House number and street name" />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">City</label>
                                                    <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-auric-gold transition-colors" placeholder="City" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700">Pincode</label>
                                                    <input required name="pincode" value={formData.pincode} onChange={handleInputChange} type="text" className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-auric-gold transition-colors" placeholder="400001" />
                                                </div>
                                            </div>
                                            <div className="space-y-2 pt-4">
                                                <Button type="submit" variant="primary" className="w-full py-4">Continue to Payment</Button>
                                            </div>
                                        </div>
                                    </form>
                                ) : (
                                    <div>
                                        <h2 className="font-serif text-2xl font-bold text-auric-rose mb-8 flex items-center gap-3">
                                            <CreditCard className="text-auric-gold" size={24} /> Payment Method
                                        </h2>

                                        <div className="space-y-6">
                                            <div className="p-6 border-2 border-auric-gold bg-auric-blush/20 rounded-xl relative">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="font-bold text-auric-rose">UPI Payment (GPay, PhonePe, etc.)</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-6">Pay securely using UPI apps. You'll receive payment instructions on the next page including QR code and UPI ID.</p>
                                                <Button
                                                    onClick={handlePlaceOrder}
                                                    disabled={loading}
                                                    variant="primary"
                                                    className="w-full py-4 uppercase tracking-widest text-xs flex justify-center items-center gap-2"
                                                >
                                                    {loading ? (
                                                        <>
                                                            <Loader2 className="animate-spin" size={16} /> Processing...
                                                        </>
                                                    ) : 'Proceed to Payment'}
                                                </Button>
                                            </div>

                                            <button onClick={() => setStep(1)} className="text-sm font-medium text-auric-gold hover:underline">← Edit Shipping Details</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Summary Section */}
                        <div className="lg:col-span-4">
                            {/* Summary Content same as before */}
                            <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm sticky top-28">
                                <h3 className="font-serif text-xl font-bold text-auric-rose mb-6">Order Summary</h3>

                                <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex gap-4">
                                            <div className="w-16 h-16 bg-auric-blush rounded-md overflow-hidden shrink-0">
                                                <img src={buildImageUrl(item.image_url || item.image)} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-auric-rose truncate">{item.name}</p>
                                                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                                <p className="text-sm font-bold text-auric-gold">₹{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 pt-6 border-t border-gray-50">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-medium text-auric-rose">₹{cartTotal}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Shipping</span>
                                        <span className="text-green-600 font-medium">Free</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-auric-rose pt-4 border-t border-gray-50 mt-4">
                                        <span>Total</span>
                                        <span>₹{cartTotal}</span>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-gray-50 rounded-xl flex items-center gap-3">
                                    <ShieldCheck size={24} className="text-auric-gold" />
                                    <div>
                                        <p className="text-[0.7rem] font-bold text-gray-700 uppercase tracking-widest leading-none mb-1">Secure Payment</p>
                                        <p className="text-[0.65rem] text-gray-400 leading-tight">Your celestial investment is protected by 256-bit encryption.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
            </div>
        </div>
    );
};

export default Checkout;
