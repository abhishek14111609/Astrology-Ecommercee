import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Services', path: '/services' },
    { name: 'Horoscope', path: '/horoscope' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-luxury-gold/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex flex-col items-center">
            <span className="font-serif text-2xl font-bold text-luxury-purple tracking-wider">ASTRO KENDRA</span>
            <span className="text-[0.6rem] uppercase tracking-[0.2em] text-luxury-gold">Celestial Guidance</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors duration-300 hover:text-luxury-gold ${isActive ? 'text-luxury-gold font-semibold' : 'text-gray-700'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <button className="text-gray-700 hover:text-luxury-gold transition-colors">
              <Search size={20} />
            </button>
            <Link to="/wishlist" className="text-gray-700 hover:text-luxury-gold transition-colors">
              <Heart size={20} />
            </Link>
            <Link to="/cart" className="relative text-gray-700 hover:text-luxury-gold transition-colors">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-luxury-gold text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-luxury-gold transition-colors">
              <User size={20} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-gray-700 hover:text-luxury-gold focus:outline-none">
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
                  `block px-3 py-3 text-base font-medium rounded-md transition-colors ${isActive
                    ? 'bg-luxury-purple/5 text-luxury-gold'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-luxury-gold'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="flex items-center justify-around pt-4 border-t border-gray-100 mt-4">
              <button className="text-gray-700 hover:text-luxury-gold"><Search size={24} /></button>
              <Link to="/wishlist" className="text-gray-700 hover:text-luxury-gold"><Heart size={24} /></Link>
              <Link to="/cart" className="text-gray-700 hover:text-luxury-gold relative">
                <ShoppingBag size={24} />
                <span className="absolute -top-1 -right-2 bg-luxury-gold text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">0</span>
              </Link>
              <Link to="/profile" className="text-gray-700 hover:text-luxury-gold"><User size={24} /></Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
