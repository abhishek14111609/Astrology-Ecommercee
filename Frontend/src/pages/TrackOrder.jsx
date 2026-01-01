import React, { useState } from 'react';
import SectionHeading from '../components/UI/SectionHeading';
import Button from '../components/UI/Button';
import { Package, Search, Truck } from 'lucide-react';

const TrackOrder = () => {
    const [orderId, setOrderId] = useState('');

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

                    <form className="space-y-6 text-left">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Order ID</label>
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-auric-gold transition-colors"
                                placeholder="e.g. #AK-88210"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-auric-gold transition-colors"
                                placeholder="The email you used at checkout"
                            />
                        </div>
                        <Button variant="primary" className="w-full py-4 gap-2">
                            <Search size={18} /> Track Order
                        </Button>
                    </form>
                </div>

                <div className="mt-12 flex items-center justify-center gap-8 text-gray-400">
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-auric-gold rounded-full mb-2"></div>
                        <span className="text-[0.6rem] uppercase tracking-widest">Ordered</span>
                    </div>
                    <div className="w-16 h-[1px] bg-gray-200"></div>
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-gray-200 rounded-full mb-2"></div>
                        <span className="text-[0.6rem] uppercase tracking-widest">Processed</span>
                    </div>
                    <div className="w-16 h-[1px] bg-gray-200"></div>
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-gray-200 rounded-full mb-2"></div>
                        <span className="text-[0.6rem] uppercase tracking-widest">Shipping</span>
                    </div>
                    <div className="w-16 h-[1px] bg-gray-200"></div>
                    <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-gray-200 rounded-full mb-2"></div>
                        <span className="text-[0.6rem] uppercase tracking-widest">Delivered</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
