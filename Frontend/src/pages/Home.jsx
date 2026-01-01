import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Truck, Headphones } from 'lucide-react';
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

    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

    // Mock Data
    const services = [
        {
            id: 1,
            title: "Janam Kundali",
            icon: "🕉️",
            desc: "Get detailed insights into your life path with our premium Kundali service.",
            color: "bg-purple-100"
        },
        {
            id: 2,
            title: "Love Matching",
            icon: "❤️",
            desc: "Find your perfect celestial match with detailed Guna Milan reports.",
            color: "bg-red-100"
        },
        {
            id: 3,
            title: "Gemstone Suggestion",
            icon: "💎",
            desc: "Discover the lucky stone that can change your fortune and brings positivity.",
            color: "bg-blue-100"
        }
    ];

    const products = allProducts.slice(0, 4);

    const zodiacs = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

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
                        Get precise horoscope readings, premium gemstones, and spiritual remedies from India's most trusted astrologers.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="pt-6"
                    >
                        <Button variant="primary" className="mr-4">
                            Talk to Astrologer
                        </Button>
                        <Button variant="outline" className="text-auric-rose border-auric-rose hover:bg-auric-rose hover:text-white">
                            Shop Collection
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Daily Horoscope Strip */}
            <div className="bg-white border-b border-gray-100 py-6 overflow-x-auto">
                <div className="container mx-auto px-4 flex justify-between gap-6 min-w-max">
                    {zodiacs.map((sign, index) => (
                        <div key={index} className="flex flex-col items-center gap-2 group cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-auric-rose/5 flex items-center justify-center text-2xl group-hover:bg-auric-gold group-hover:text-white transition-colors duration-300">
                                {sign}
                            </div>
                            <span className="text-xs font-medium text-gray-500 group-hover:text-auric-rose uppercase tracking-wider">Sign {index + 1}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Services Section */}
            <section className="py-20 container mx-auto px-4">
                <SectionHeading title="Our Premium Services" subtitle="COSMIC SOLUTIONS" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <motion.div
                            whileHover={{ y: -10 }}
                            key={service.id}
                            className="bg-white p-8 rounded-lg shadow-sm hover:shadow-xl border border-gray-100 text-center transition-all duration-300"
                        >
                            <div className="w-16 h-16 mx-auto bg-auric-blush rounded-full flex items-center justify-center text-3xl mb-6">
                                {service.icon}
                            </div>
                            <h3 className="font-serif text-xl font-bold text-auric-rose mb-4">{service.title}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">{service.desc}</p>
                            <Link to="/services" className="text-auric-gold font-medium uppercase text-xs tracking-widest hover:text-auric-rose flex items-center justify-center gap-2">
                                Read More <ArrowRight size={14} />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-12">
                        <div className="text-left">
                            <span className="text-auric-gold uppercase tracking-[0.2em] text-xs font-semibold">Divine Collection</span>
                            <h2 className="font-serif text-3xl md:text-4xl text-auric-rose font-bold mt-2">Sacred Artifacts</h2>
                        </div>
                        <Link to="/shop" className="hidden md:flex items-center gap-2 text-auric-rose font-medium hover:text-auric-gold transition-colors">
                            View All Products <ArrowRight size={18} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    <div className="mt-12 text-center md:hidden">
                        <Button variant="outline">View All Products</Button>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20 bg-auric-gold text-white">
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
