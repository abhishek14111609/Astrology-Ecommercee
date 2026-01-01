import React from 'react';
import { User, Package, MapPin, Settings, LogOut, ChevronRight } from 'lucide-react';
import Button from '../components/UI/Button';
import SectionHeading from '../components/UI/SectionHeading';

const Profile = () => {
    // Mock user data
    const user = {
        name: "Aman Sharma",
        email: "aman.spiritual@example.com",
        joined: "January 2026",
        avatar: null
    };

    const recentOrders = [
        { id: "#AK-88210", date: "Dec 28, 2025", status: "Delivered", total: "₹2,499" },
        { id: "#AK-88154", date: "Dec 15, 2025", status: "Delivered", total: "₹1,200" }
    ];

    const menuItems = [
        { icon: <Package size={20} />, label: "My Orders", desc: "Track, return or buy again" },
        { icon: <MapPin size={20} />, label: "Saved Addresses", desc: "Manage your delivery locations" },
        { icon: <Settings size={20} />, label: "Account Settings", desc: "Update your profile and preferences" }
    ];

    return (
        <div className="bg-auric-blush min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-5xl">
                <SectionHeading title="Your Inner Sanctuary" subtitle="MY ACCOUNT" />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">

                    {/* Sidebar / User Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                            <div className="w-24 h-24 bg-auric-blush rounded-full mx-auto flex items-center justify-center text-auric-rose mb-4 border-2 border-auric-gold/20">
                                <User size={48} />
                            </div>
                            <h3 className="font-serif text-2xl font-bold text-auric-rose">{user.name}</h3>
                            <p className="text-gray-500 text-sm mb-6">{user.email}</p>
                            <div className="pt-6 border-t border-gray-50">
                                <span className="text-[0.6rem] uppercase tracking-widest text-gray-400">Seeking since {user.joined}</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            {menuItems.map((item, idx) => (
                                <button key={idx} className="w-full flex items-center justify-between p-5 hover:bg-auric-blush/30 transition-colors border-b border-gray-50 last:border-0 group">
                                    <div className="flex items-center gap-4 text-left">
                                        <div className="text-auric-gold">{item.icon}</div>
                                        <div>
                                            <div className="text-sm font-bold text-auric-rose">{item.label}</div>
                                            <div className="text-[0.7rem] text-gray-400">{item.desc}</div>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-auric-gold transition-colors" />
                                </button>
                            ))}
                            <button className="w-full flex items-center gap-4 p-5 text-red-400 hover:bg-red-50 transition-colors">
                                <LogOut size={20} />
                                <span className="text-sm font-bold">Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Content / Recent Activity */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-serif text-xl font-bold text-auric-rose mb-6 flex items-center gap-2">
                                <Package className="text-auric-gold" size={20} /> Recent Orders
                            </h3>
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div key={order.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border border-gray-100 hover:border-auric-gold/30 transition-colors bg-gray-50/50">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-auric-gold mb-1">{order.id}</span>
                                            <span className="text-sm font-medium text-auric-rose">{order.date}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-4 md:mt-0 gap-8">
                                            <div className="flex flex-col items-end">
                                                <span className="text-[0.6rem] uppercase tracking-widest text-gray-400">Total</span>
                                                <span className="text-sm font-bold text-auric-rose">{order.total}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 bg-green-100 text-green-700 text-[0.6rem] font-bold rounded-full uppercase tracking-widest">
                                                    {order.status}
                                                </span>
                                                <Button variant="outline" className="text-[0.6rem] py-1 px-3 border-auric-gold text-auric-gold">View Details</Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full text-center mt-6 text-sm font-bold text-auric-gold hover:underline">View All Orders</button>
                        </div>

                        {/* Recommendation Banner */}
                        <div className="bg-auric-rose rounded-2xl p-8 text-white relative overflow-hidden">
                            <div className="relative z-10 max-w-md">
                                <h3 className="font-serif text-2xl font-bold mb-4">Complete Your Aura</h3>
                                <p className="text-white/70 text-sm mb-6 leading-relaxed">
                                    Based on your last purchase of the Amitabha Buddha, we suggest looking at our newly arrived Citrine clusters for abundance.
                                </p>
                                <Button variant="primary" className="text-xs py-2 px-6">Explore Recommendations</Button>
                            </div>
                            <div className="absolute -top-10 -right-10 w-48 h-48 bg-auric-gold/10 rounded-full blur-3xl"></div>
                            <div className="absolute top-1/2 -right-12 transform -translate-y-1/2 opacity-20 rotate-12">
                                <User size={160} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
