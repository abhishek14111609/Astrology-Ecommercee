import React from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ onMenuClick }) => {
    const { user } = useAuth();
    return (
        <header className="fixed top-0 right-0 left-0 lg:left-72 h-16 bg-white/80 backdrop-blur-xl border-b border-neutral-100 z-40 transition-all duration-300">
            <div className="h-full px-4 md:px-6 lg:px-8 flex items-center justify-between">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
                    >
                        <Menu size={20} />
                    </button>

                    {/* Search Bar */}
                    {/* <div className="hidden md:flex items-center gap-3 bg-neutral-50 px-4 py-2 rounded-xl border border-neutral-100 focus-within:border-auric-purple/30 focus-within:bg-white transition-all group w-80">
                        <Search size={18} className="text-neutral-400 group-focus-within:text-auric-purple transition-colors" />
                        <input
                            type="text"
                            placeholder="Search anything..."
                            className="bg-transparent outline-none text-sm w-full placeholder:text-neutral-400"
                        />
                        <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 text-xs font-semibold text-neutral-500 bg-white border border-neutral-200 rounded">
                            ⌘K
                        </kbd>
                    </div> */}
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-2">
                    {/* Mobile Search */}
                    <button className="md:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors">
                        <Search size={20} />
                    </button>

                    {/* Notifications */}
                    <button className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors group">
                        <Bell size={20} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-auric-crimson rounded-full border-2 border-white animate-pulse"></span>
                    </button>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 ml-2 pl-2 border-l border-neutral-200">
                        <div className="hidden lg:block text-right">
                            <p className="text-sm font-semibold text-neutral-900">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-neutral-500">{user?.email || 'admin@auric.com'}</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-auric-purple to-auric-purple-dark rounded-xl flex items-center justify-center text-white font-semibold shadow-lg shadow-auric-purple/20 cursor-pointer hover:scale-105 transition-transform">
                            {user?.name?.charAt(0).toUpperCase() || <User size={18} />}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
