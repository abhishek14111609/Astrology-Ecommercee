import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { User, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import logo from '../../assets/images/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Services', path: '/services' },
    { name: 'Zodiac', path: '/Zodiac' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-auric-gold/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src={logo}
                alt="Auric krystals"
                className="h-12 md:h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute -inset-1 bg-auric-gold/10 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-3xl md:text-xl font-bold text-auric-rose tracking-wider leading-none">
                Auric krystals
              </span>
              <span className="text-[0.6rem] uppercase tracking-[0.2em] text-auric-gold font-medium mt-1">
                Celestial Guidance
              </span> 
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-300 hover:text-auric-gold ${isActive ? 'text-auric-gold font-semibold' : 'text-gray-700'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-5">
            {user && <NotificationDropdown />}
            <Link to="/cart" className="relative text-gray-700 hover:text-auric-gold transition-colors">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-auric-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-auric-gold transition-colors">
              <User size={20} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-gray-700 hover:text-auric-gold focus:outline-none">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-3 py-3 text-base font-medium rounded-md transition-colors ${isActive ? 'bg-auric-rose/5 text-auric-gold' : 'text-gray-700 hover:bg-gray-50 hover:text-auric-gold'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="flex items-center justify-around pt-4 border-t border-gray-100 mt-4">
              {user && <div className="text-gray-700"><NotificationDropdown /></div>}
              <Link to="/cart" className="text-gray-700 hover:text-auric-gold relative">
                <ShoppingBag size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-auric-gold text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/profile" className="text-gray-700 hover:text-auric-gold">
                <User size={24} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;