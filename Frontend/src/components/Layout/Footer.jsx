import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Youtube, Mail, MapPin, Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import logo from '../../assets/images/logo2.png';

const Footer = () => {
    return (
        <footer className="bg-auric-rose text-white pt-16 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Brand & Description */}
                    <div>
                        <div className="mb-6 flex items-center gap-3">
                            <img src={logo} alt="Auric krystals" className="h-10 w-auto object-contain brightness-0 invert" />
                            <div className="flex flex-col">
                                <span className="font-serif text-xl font-bold text-white tracking-wider leading-none">Auric krystals</span>
                                <p className="text-[0.5rem] uppercase tracking-[0.2em] text-auric-gold mt-1">Celestial Guidance</p>
                            </div>
                        </div>
                        <p className="text-white/70 text-sm leading-relaxed mb-6">
                            Experience the divine fusion of ancient wisdom and modern elegance.
                            Our curated collection of crystals and spiritual artifacts is designed
                            to illuminate your journey towards inner peace and celestial harmony.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <a
                                href="https://www.facebook.com/share/17C6HbL1gX/?mibextid=wwXIfr"
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white/10 p-2 rounded-full hover:bg-auric-gold hover:text-auric-rose transition-all duration-300"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="https://www.instagram.com/auric_krystals?igsh=eWJwaW5td3RtN293"
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white/10 p-2 rounded-full hover:bg-auric-gold hover:text-auric-rose transition-all duration-300"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="https://youtube.com/@astrokrupalir?feature=shared"
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white/10 p-2 rounded-full hover:bg-auric-gold hover:text-auric-rose transition-all duration-300"
                            >
                                <Youtube size={18} />
                            </a>
                            <a
                                href="https://www.linkedin.com/in/dr-krupali-r-mehta-32b7043aa?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white/10 p-2 rounded-full hover:bg-auric-gold hover:text-auric-rose transition-all duration-300"
                            >
                                <Linkedin size={18} />
                            </a>
                            <a
                                href="https://whatsapp.com/channel/0029VbAaYar1NCrVeJhmWu14"
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white/10 p-2 rounded-full hover:bg-auric-gold hover:text-auric-rose transition-all duration-300"
                            >
                                <FaWhatsapp size={18} />
                            </a>
                            {/* <a
                                href="https://drive.google.com/drive/folders/1q0dZ03Oamv7TDgwGMbAWkRU_suDiXyvx"
                                target="_blank"
                                rel="noreferrer"
                                className="bg-white/10 p-2 rounded-full hover:bg-auric-gold hover:text-auric-rose transition-all duration-300"
                            >
                                <Folder size={18} />
                            </a> */}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-serif text-lg font-semibold mb-6 text-auric-gold">Explore</h3>
                        <ul className="space-y-3 text-sm text-white/70">
                            <li><Link to="/about" className="hover:text-auric-gold transition-colors">About Our Journey</Link></li>
                            <li><Link to="/shop" className="hover:text-auric-gold transition-colors">The </Link></li>
                            <li><Link to="/services" className="hover:text-auric-gold transition-colors">Spiritual Services</Link></li>
                            <li><Link to="/Zodiac" className="hover:text-auric-gold transition-colors">Celestial Forecast</Link></li>
                            <li><Link to="/contact" className="hover:text-auric-gold transition-colors">Connect With Us</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-serif text-lg font-semibold mb-6 text-auric-gold">Care</h3>
                        <ul className="space-y-3 text-sm text-white/70">
                            <li><Link to="/faq" className="hover:text-auric-gold transition-colors">Inner Circle FAQ</Link></li>
                            <li><Link to="/shipping" className="hover:text-auric-gold transition-colors">Shipping & Returns</Link></li>
                            <li><Link to="/privacy" className="hover:text-auric-gold transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-auric-gold transition-colors">Terms of Harmony</Link></li>
                            <li><Link to="/track-order" className="hover:text-auric-gold transition-colors">Track Order</Link></li>
                        </ul>
                    </div>

                    {/* Contact & Support */}
                    <div>
                        <h3 className="font-serif text-lg font-semibold mb-6 text-auric-gold">Support</h3>
                        <p className="text-white/70 text-sm mb-6">
                            Reach out for guidance, support, or a custom consultation.
                        </p>
                        <div className="space-y-4 text-sm text-white/70">
                            <div className="flex items-center gap-3">
                                <MapPin size={16} className="text-auric-gold" />
                                <span>125 Rk World Tower Rajkot 360006</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-auric-gold" />
                                <span>+91 70432 16616</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={16} className="text-auric-gold" />
                                <span>aurickrystalss@gmail.com</span>
                            </div>
                        </div>
                        <Link
                            to="/contact"
                            className="inline-block mt-6 bg-white/10 hover:bg-auric-gold text-white hover:text-auric-rose px-5 py-2 rounded uppercase tracking-widest text-xs font-bold transition-all duration-300"
                        >
                            Contact Us
                        </Link>
                    </div>

                </div>

                <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-white/50">
                    <p>&copy; {new Date().getFullYear()} Auric krystals. All rights reserved.</p>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mt-4 md:mt-0">
                        <div className="flex items-center gap-2">
                            <Mail size={14} className="text-auric-gold" />
                            <span>aurickrystalss@gmail.com</span>
                        </div>
                        <span className="mt-2 md:mt-0 text-xs uppercase tracking-widest text-white/60">
                            No exchange. No return | No refund.
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
