import React from 'react';
import SectionHeading from '../components/UI/SectionHeading';
import logo from '../assets/images/logo2.png';

const About = () => {
    return (
        <div className="bg-auric-blush min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-white text-center px-4">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-auric-blush via-transparent to-white"></div>

                <div className="relative z-10 max-w-4xl mx-auto space-y-6">
                    <span className="inline-block text-auric-gold uppercase tracking-[0.3em] text-sm font-semibold">Our Eternal Journey</span>
                    <h1 className="font-serif text-5xl md:text-7xl font-bold text-auric-rose leading-tight">
                        The Story of <br /> <span className="text-auric-gold italic whitespace-nowrap">Auric Krystal</span>
                    </h1>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 container mx-auto px-4 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <SectionHeading title="Ancient Roots, Modern Soul" subtitle="OUR ORIGIN" center={false} />
                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <p>
                                Auric Krystal was born from a profound respect for the celestial arts and a desire to bring the luminous energy of crystals into contemporary life. Our journey began with a simple belief: that every soul deserves a touch of divine harmony.
                            </p>
                            <p>
                                We meticulously source our crystals and artifacts from across the globe, ensuring each piece resonates with the highest vibrational frequency. Our master astrologers and energy healers work in unison to energize every product, bridging the gap between ancient wisdom and the modern seeker.
                            </p>
                            <p>
                                Today, Auric Krystal stands as a sanctuary for those seeking spiritual elevation, offering not just products, but a pathway to personal enlightenment and cosmic alignment.
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-2xl skew-y-3 transform transition-transform hover:skew-y-0 duration-700">
                            <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="About Us" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-auric-gold rounded-full flex items-center justify-center animate-pulse">
                            <img src={logo} alt="Logo" className="w-20 h-20 object-contain brightness-0 invert opacity-50" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-auric-rose text-white">
                <div className="container mx-auto px-4">
                    <SectionHeading title="The Pillars of Auric Krystal" subtitle="OUR VALUES" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="p-8 border border-white/10 rounded-lg hover:border-auric-gold transition-colors">
                            <h3 className="font-serif text-2xl font-bold text-auric-gold mb-4">Authenticity</h3>
                            <p className="text-white/70">Every gemstone is lab-certified and every reading is rooted in centuries-old traditions.</p>
                        </div>
                        <div className="p-8 border border-white/10 rounded-lg hover:border-auric-gold transition-colors">
                            <h3 className="font-serif text-2xl font-bold text-auric-gold mb-4">Elegance</h3>
                            <p className="text-white/70">We believe spiritual growth should be accompanied by aesthetic beauty and grace.</p>
                        </div>
                        <div className="p-8 border border-white/10 rounded-lg hover:border-auric-gold transition-colors">
                            <h3 className="font-serif text-2xl font-bold text-auric-gold mb-4">Guidance</h3>
                            <p className="text-white/70">Beyond products, we offer personalized celestial coaching to illuminate your path.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
