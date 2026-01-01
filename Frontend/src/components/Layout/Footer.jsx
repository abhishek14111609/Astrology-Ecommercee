import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-luxury-purple text-white pt-16 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand & Description */}
                    <div>
                        <div className="mb-6">
                            <span className="font-serif text-2xl font-bold text-white tracking-wider">ASTRO KENDRA</span>
                            <p className="text-[0.6rem] uppercase tracking-[0.2em] text-luxury-gold mt-1">Celestial Guidance</p>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-6">
                            Discover your destiny with our authentic astrology services and premium spiritual products.
                            We bring ancient wisdom to the modern world.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-luxury-gold hover:text-white transition-all duration-300">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-luxury-gold hover:text-white transition-all duration-300">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-luxury-gold hover:text-white transition-all duration-300">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="bg-white/10 p-2 rounded-full hover:bg-luxury-gold hover:text-white transition-all duration-300">
                                <Youtube size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-serif text-lg font-semibold mb-6 text-luxury-gold">Quick Links</h3>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li><Link to="/about" className="hover:text-luxury-gold transition-colors">About Us</Link></li>
                            <li><Link to="/shop" className="hover:text-luxury-gold transition-colors">Our Shop</Link></li>
                            <li><Link to="/services" className="hover:text-luxury-gold transition-colors">Astrology Services</Link></li>
                            <li><Link to="/blog" className="hover:text-luxury-gold transition-colors">Blog & Articles</Link></li>
                            <li><Link to="/contact" className="hover:text-luxury-gold transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h3 className="font-serif text-lg font-semibold mb-6 text-luxury-gold">Support</h3>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li><Link to="/faq" className="hover:text-luxury-gold transition-colors">FAQ</Link></li>
                            <li><Link to="/shipping" className="hover:text-luxury-gold transition-colors">Shipping & Returns</Link></li>
                            <li><Link to="/privacy" className="hover:text-luxury-gold transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-luxury-gold transition-colors">Terms of Service</Link></li>
                            <li><Link to="/track-order" className="hover:text-luxury-gold transition-colors">Track Order</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-serif text-lg font-semibold mb-6 text-luxury-gold">Stay Connected</h3>
                        <p className="text-gray-300 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-white/5 border border-white/10 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-luxury-gold transition-colors"
                            />
                            <button className="w-full bg-luxury-gold text-luxury-purple font-semibold py-2 rounded hover:bg-white hover:text-luxury-purple transition-all duration-300">
                                Subscribe
                            </button>
                        </form>
                    </div>

                </div>

                <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Astro Kendra. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <div className="flex items-center gap-2">
                            <Mail size={14} className="text-luxury-gold" />
                            <span>support@astrokendra.com</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
