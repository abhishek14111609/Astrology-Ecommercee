import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    ShoppingBag,
    Layers,
    HelpCircle,
    Users,
    LogOut,
    X,
    Sparkles,
    Package,
    GitBranch,
    MessageSquare,
    Settings,
    CreditCard,
    Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
    const { user, logout } = useAuth();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const menuItems = [
        {
            name: 'Overview',
            path: '/',
            icon: LayoutDashboard,
            badge: null
        },
        {
            name: 'Products',
            path: '/products',
            icon: ShoppingBag,
            badge: null
        },
        {
            name: 'Categories',
            path: '/categories',
            icon: Layers,
            badge: null
        },
        {
            name: 'Sub-Categories',
            path: '/subcategories',
            icon: GitBranch,
            badge: null
        },
        {
            name: 'Orders',
            path: '/orders',
            icon: Package,
            badge: null
        },
        {
            name: 'Customers',
            path: '/customers',
            icon: Users,
            badge: null
        },
        {
            name: 'Inquiries',
            path: '/inquiries',
            icon: MessageSquare,
            badge: null
        },
        {
            name: 'Quiz Config',
            path: '/quiz',
            icon: HelpCircle,
            badge: null
        },
        {
            name: 'Payment Verification',
            path: '/payments',
            icon: CreditCard,
            badge: null
        },
        {
            name: 'Payment Settings',
            path: '/payment-settings',
            icon: Settings,
            badge: null
        },
        {
            name: 'Service Bookings',
            path: '/service-bookings',
            icon: Calendar,
            badge: null
        },
    ];

    return (
        <>
            {/* Backdrop for mobile */}
            <div
                className={`fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <aside
                className={`
          fixed left-0 top-0 h-screen w-72 bg-white border-r border-neutral-100 
          flex flex-col z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                {/* Logo Section */}
                <div className="h-16 px-6 flex items-center justify-between border-b border-neutral-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-auric-purple to-auric-purple-dark rounded-xl flex items-center justify-center shadow-lg shadow-auric-purple/20">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-serif font-bold text-neutral-900 leading-tight">
                                Auric krystals
                            </h2>
                            <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">
                                Admin Portal
                            </p>
                        </div>
                    </div>

                    {/* Close button for mobile */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 overflow-y-auto">
                    <div className="space-y-1">
                        <div className="px-3 mb-3">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                Main Menu
                            </p>
                        </div>

                        {menuItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${isActive
                                        ? 'bg-gradient-to-r from-auric-purple to-auric-purple-dark text-white shadow-lg shadow-auric-purple/20'
                                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon
                                            size={20}
                                            className={`transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-neutral-500'
                                                }`}
                                        />
                                        <span className="text-sm font-semibold flex-1">
                                            {item.name}
                                        </span>
                                        {item.badge && (
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${isActive
                                                ? 'bg-white/20 text-white'
                                                : 'bg-auric-purple/10 text-auric-purple'
                                                }`}>
                                                {item.badge}
                                            </span>
                                        )}
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    {/* Settings Section */}
                    {/* <div className="mt-8 pt-6 border-t border-neutral-100">
                        <div className="px-3 mb-3">
                            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                System
                            </p>
                        </div>
                        <NavLink
                            to="/settings"
                            onClick={() => setIsOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-gradient-to-r from-auric-purple to-auric-purple-dark text-white shadow-lg shadow-auric-purple/20'
                                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                                }`
                            }
                        >
                            <Settings size={20} className="text-neutral-500 group-hover:rotate-90 transition-transform duration-300" />
                            <span className="text-sm font-semibold">Settings</span>
                        </NavLink>
                    </div> */}
                </nav>

                {/* Footer - User Info & Logout */}
                <div className="p-4 border-t border-neutral-100 space-y-3">
                    {/* User Info */}
                    {/* <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                        <div className="w-10 h-10 bg-gradient-to-br from-auric-gold to-auric-accent rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-neutral-900 truncate">
                                {user?.name || 'Admin User'}
                            </p>
                            <p className="text-xs text-neutral-500 truncate">
                                {user?.email || 'admin@auric.com'}
                            </p>
                        </div>
                    </div> */}

                    {/* Logout Button */}
                    <button
                        onClick={async () => {
                            setShowLogoutModal(true);
                        }}
                        className="flex items-center gap-3 px-4 py-3 w-full text-neutral-600 hover:text-auric-crimson hover:bg-red-50 rounded-xl transition-all duration-200 group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-semibold">Sign Out</span>
                    </button>
                </div>
            </aside>

            {showLogoutModal && (
                <div className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="p-6 border-b">
                            <h3 className="text-xl font-bold text-neutral-900">Confirm Sign Out</h3>
                            <p className="text-sm text-neutral-500 mt-1">
                                You will be logged out of the admin panel.
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-3 p-4 rounded-xl bg-auric-purple/5 border border-auric-purple/20">
                                <div className="w-10 h-10 rounded-xl bg-auric-purple text-white flex items-center justify-center">
                                    <LogOut size={18} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-neutral-900">Sign out now?</p>
                                    <p className="text-xs text-neutral-500">Unsaved changes will be lost.</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowLogoutModal(false)}
                                className="btn-secondary flex-1"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={async () => {
                                    await logout();
                                    window.location.href = '/login';
                                }}
                                className="btn-primary flex-1"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
