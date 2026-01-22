import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Truck, Headphones, Compass, Heart, Gem } from 'lucide-react';
import Button from '../components/UI/Button';
import SectionHeading from '../components/UI/SectionHeading';
import ProductCard from '../components/UI/ProductCard';
import { products as allProducts } from '../data/products';

const Home = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    const [bestSellers, setBestSellers] = React.useState([]);
    const [zodiacProducts, setZodiacProducts] = React.useState([]);
    const [selectedZodiac, setSelectedZodiac] = React.useState('Aries');

    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

    // Fetch Bestsellers
    React.useEffect(() => {
        const fetchBestsellers = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/products?is_bestseller=1');
                const data = await res.json();
                setBestSellers(data.length > 0 ? data.slice(0, 4) : allProducts.slice(0, 4));
            } catch (err) {
                setBestSellers(allProducts.slice(0, 4));
            }
        };
        fetchBestsellers();
    }, []);

    // Fetch Zodiac Specific Products
    React.useEffect(() => {
        const fetchZodiacProducts = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/products?zodiac=${selectedZodiac}`);
                const data = await res.json();
                setZodiacProducts(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchZodiacProducts();
    }, [selectedZodiac]);

    // Mock Data
    const services = [
        {
            title: "Celestial Birth Chart",
            subtitle: "KUNDALI ANALYSIS",
            desc: "A deep dive into your unique planetary alignment at the moment of birth. Discover your life purpose, hidden talents, and cosmic destiny.",
            icon: <Compass size={32} />,
            price: "₹1,499"
        },
        {
            title: "Vedic Love Sync",
            subtitle: "RELATIONSHIP MATCHING",
            desc: "Understand the soul-level compatibility between you and your partner using ancient Guna Milan techniques for a harmonious future.",
            icon: <Heart size={32} />,
            price: "₹999"
        },
        {
            title: "Gemstone Prescription",
            subtitle: "ENERGY HEALING",
            desc: "Personalized recommendations for crystals and gemstones that resonate with your aura to attract abundance and ward off negativity.",
            icon: <Gem size={32} />,
            price: "₹499"
        }
    ];

    const products = allProducts.slice(0, 4);

    const zodiacs = [
        { name: "Aries", icon: "♈" },
        { name: "Taurus", icon: "♉" },
        { name: "Gemini", icon: "♊" },
        { name: "Cancer", icon: "♋" },
        { name: "Leo", icon: "♌" },
        { name: "Virgo", icon: "♍" },
        { name: "Libra", icon: "♎" },
        { name: "Scorpio", icon: "♏" },
        { name: "Sagittarius", icon: "♐" },
        { name: "Capricorn", icon: "♑" },
        { name: "Aquarius", icon: "♒" },
        { name: "Pisces", icon: "♓" }
    ];

    return (
        <div className="bg-auric-blush">
            {/* Hero Section */}
            <section ref={targetRef} className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-white text-center px-4">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-auric-blush via-transparent to-white"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-auric-accent)_0%,_transparent_70%)] opacity-20"></div>

                <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="inline-block text-auric-gold uppercase tracking-[0.3em] text-sm font-semibold"
                    >
                        Unlock Your Destiny
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="font-serif text-5xl md:text-7xl font-bold text-auric-rose leading-tight"
                    >
                        Ancient Wisdom for <br /> <span className="text-auric-gold italic">Modern Life</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-auric-rose/80 text-lg md:text-xl max-w-2xl mx-auto"
                    >
                        Get precise horoscope readings, premium crystal and gemstones spiritual remedies from India's most trusted astrologers.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="pt-6"
                    >
                        <a 
                            href="https://wa.me/917043216616?text=Hello%2C%20I%20would%20like%20to%20consult%20with%20an%20astrologer%20regarding%20my%20birth%20chart%20and%20future%20predictions.%20Please%20guide%20me."
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="primary" className="mr-4">
                                Talk to Astrologer
                            </Button>
                        </a>
                        <Link to="/shop">
                            <Button variant="outline" className="text-auric-rose border-auric-rose hover:bg-auric-rose hover:text-white">
                                Shop Collection
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Daily Horoscope Strip */}
            <div className="bg-white border-b border-gray-100 py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <span className="text-auric-gold uppercase tracking-[0.2em] text-xs font-semibold">Celestial Insights</span>
                        <h2 className="font-serif text-3xl text-auric-rose font-bold mt-2">Daily Horoscopes</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                        {zodiacs.map((sign, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedZodiac(sign.name)}
                                className={`flex flex-col items-center gap-3 group cursor-pointer p-4 rounded-xl transition-all duration-300 ${selectedZodiac === sign.name ? 'bg-auric-blush shadow-inner' : 'hover:bg-auric-blush/30'}`}
                            >
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-colors duration-300 shadow-sm ${selectedZodiac === sign.name ? 'bg-auric-gold text-white' : 'bg-auric-rose/5 group-hover:bg-auric-gold group-hover:text-white'}`}>
                                    {sign.icon}
                                </div>
                                <span className={`text-sm font-semibold uppercase tracking-widest ${selectedZodiac === sign.name ? 'text-auric-rose' : 'text-gray-700 group-hover:text-auric-rose'}`}>{sign.name}</span>
                            </div>
                        ))}
                    </div>

                    {/* Zodiac Suggestions */}
                    {zodiacProducts.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-16 p-8 bg-auric-blush/20 rounded-3xl border border-auric-blush"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                                <h3 className="font-serif text-2xl text-auric-rose font-bold">Recommended for {selectedZodiac}</h3>
                                <Link to={`/shop?zodiac=${selectedZodiac}`} className="text-auric-gold text-sm font-bold uppercase tracking-widest hover:text-auric-rose">View All {selectedZodiac} Items</Link>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                {zodiacProducts.slice(0, 4).map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Gemstone Finder CTA */}
            <section className="py-20 bg-gradient-to-r from-auric-rose to-[#5c1a2e] text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl mx-auto text-center space-y-8">
                        <span className="text-auric-gold uppercase tracking-[0.3em] text-sm font-bold">Gemstone Recommendation</span>
                        <h2 className="text-4xl md:text-5xl font-serif font-bold leading-tight">Can't decide which stone <br /> resonates with you?</h2>
                        <p className="text-lg text-white/80">Take our cosmic quiz. Our engine analyzes your energy patterns to suggest the perfect sacred artifact for your current path.</p>
                        <div className="pt-4">
                            <Link to="/gemstone-finder">
                                <Button className="bg-auric-gold hover:bg-white hover:text-auric-rose border-none text-white px-10 py-4 text-lg">
                                    Start Celestial Quiz
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20 container mx-auto px-4">
                <SectionHeading title="Our Premium Services" subtitle="COSMIC SOLUTIONS" />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group">
                            <div className="w-16 h-16 bg-auric-blush text-auric-rose rounded-xl flex items-center justify-center mb-8 group-hover:bg-auric-gold group-hover:text-white transition-colors duration-500">
                                {service.icon}
                            </div>
                            <span className="text-auric-gold uppercase tracking-widest text-xs font-bold mb-3 block">{service.subtitle}</span>
                            <h3 className="font-serif text-2xl font-bold text-auric-rose mb-4">{service.title}</h3>
                            <p className="text-gray-600 leading-relaxed mb-8">{service.desc}</p>
                            <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                                <span className="text-2xl font-serif font-bold text-auric-rose">{service.price}</span>
                                <Button variant="outline" className="text-xs px-4 py-2 border-auric-gold text-auric-gold hover:bg-auric-gold hover:text-white">Book Session</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div className="text-left">
                            <span className="text-auric-gold uppercase tracking-[0.2em] text-xs font-semibold">Premium Collection</span>
                            <h2 className="font-serif text-3xl md:text-4xl text-auric-rose font-bold mt-2">Bestselling Products</h2>
                        </div>
                        <Link to="/shop" className="hidden md:flex items-center gap-2 text-auric-rose font-medium hover:text-auric-gold transition-colors">
                            View All Products <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {bestSellers.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <div className="mt-12 text-center lg:hidden">
                        <Button variant="outline">View All Products</Button>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-auric-blush text-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="space-y-4">
                            <div className="bg-auric-rose/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-auric-gold">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="font-serif text-auric-rose text-xl font-bold">100% Authentic</h3>
                            <p className="text-auric-rose text-sm leading-relaxed">All our gemstones and rudrakshas are lab certified and energized by expert pundits.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-auric-rose/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-auric-gold">
                                <Truck size={32} />
                            </div>
                            <h3 className="font-serif text-auric-rose text-xl font-bold">Secure Shipping</h3>
                            <p className="text-auric-rose text-sm leading-relaxed">We deliver valuable spiritual products with insured and safe packaging worldwide.</p>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-auric-rose/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-auric-gold">
                                <Headphones size={32} />
                            </div>
                            <h3 className="font-serif text-auric-rose text-xl font-bold">Expert Support</h3>
                            <p className="text-auric-rose text-sm leading-relaxed">Our support team and astrologers are available to guide you on your spiritual journey.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
