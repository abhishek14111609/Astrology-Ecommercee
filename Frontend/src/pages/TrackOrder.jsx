import React, { useState } from 'react';
import SectionHeading from '../components/UI/SectionHeading';
import Button from '../components/UI/Button';
import { Package, Search, Truck, CheckCircle2, XCircle } from 'lucide-react';

const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [trackingResult, setTrackingResult] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setTrackingResult(null);

        try {
            // Remove # if present
            const cleanId = orderId.replace('#', '');
            const res = await fetch(`http://localhost:5000/api/orders/${cleanId}`);

            if (!res.ok) throw new Error('Order not found');

            const data = await res.json();

            if (data.customer_email.toLowerCase() !== email.toLowerCase()) {
                throw new Error('Email does not match our records for this order.');
            }

            setTrackingResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStep = (status) => {
        const steps = ['pending', 'processed', 'shipped', 'delivered'];
        // Map common statuses
        let current = status.toLowerCase();
        if (current === 'paid') current = 'processed';

        return steps.indexOf(current);
    };

    return (
        <div className="bg-auric-blush min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-2xl text-center">
                <SectionHeading title="Track Your Sanctuary" subtitle="ORDER STATUS" />

                <div className="mt-12 bg-white p-10 rounded-3xl shadow-lg border border-gray-100">
                    <div className="w-20 h-20 bg-auric-blush rounded-full flex items-center justify-center text-auric-rose mx-auto mb-8">
                        <Truck size={32} />
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-auric-rose mb-4">Where is my artifact?</h3>
                    <p className="text-gray-600 mb-8">Enter your order ID and the email address used during purchase to see the current location of your divine delivery.</p>

                    <form onSubmit={handleTrack} className="space-y-6 text-left">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Order ID</label>
                            <input
                                required
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-auric-gold transition-colors"
                                placeholder="e.g. AK-88210"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-auric-gold transition-colors"
                                placeholder="The email you used at checkout"
                            />
                        </div>
                        <Button disabled={loading} variant="primary" className="w-full py-4 gap-2">
                            {loading ? 'Searching...' : <><Search size={18} /> Track Order</>}
                        </Button>
                    </form>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm justify-center">
                            <XCircle size={18} /> {error}
                        </div>
                    )}

                    {trackingResult && (
                        <div className="mt-8 p-6 bg-green-50 rounded-2xl border border-green-100 animate-in slide-in-from-bottom-2 fade-in">
                            <h4 className="font-bold text-green-800 text-lg mb-2 flex items-center justify-center gap-2">
                                <CheckCircle2 size={20} /> Status: <span className="uppercase">{trackingResult.status}</span>
                            </h4>
                            <p className="text-green-700 text-sm">Order Total: ₹{trackingResult.total_amount}</p>

                            <div className="mt-8 flex items-center justify-center gap-2 md:gap-8 text-gray-400">
                                {['Pending', 'Processed', 'Shipped', 'Delivered'].map((label, idx) => {
                                    const currentStep = getStatusStep(trackingResult.status);
                                    const active = idx <= currentStep;
                                    return (
                                        <React.Fragment key={label}>
                                            <div className="flex flex-col items-center">
                                                <div className={`w-3 h-3 rounded-full mb-2 ${active ? 'bg-auric-gold' : 'bg-gray-200'}`}></div>
                                                <span className={`text-[0.6rem] uppercase tracking-widest ${active ? 'text-auric-gold font-bold' : ''}`}>{label}</span>
                                            </div>
                                            {idx < 3 && <div className={`w-8 md:w-16 h-px ${idx < currentStep ? 'bg-auric-gold' : 'bg-gray-200'}`}></div>}
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
