import React from 'react';
import SectionHeading from '../components/UI/SectionHeading';
import logo from '../assets/images/logo2.png';
import logo1 from '../assets/images/crystal.png';

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
                                Auric Krystals was born from a simple belief — that crystals are not just beautiful objects, but living carriers of energy, intention, and ancient wisdom. Every crystal we offer is carefully chosen, not by appearance alone, but by its vibration, origin, and purity. We deal only in pure, original, and certified crystals and gemstones, because authenticity is the foundation of true healing.
                            </p>
                            <p>
                                At Auric Krystals, quality is never compromised. Each gemstone and crystal product goes through a mindful selection process, ensuring it is natural, energetically sound, and worthy of becoming a part of your journey. From spiritual tools to gemstone creations, every piece reflects our commitment to truth, transparency, and trust.
                            </p>
                            <p>
                                But we believe a crystal’s journey doesn’t end at delivery — it begins there. That’s why every Auric Krystals product comes with a certification of authenticity and a special crystal charging bag, so your crystal remains protected and energetically aligned. More importantly, each crystal is energetically cleansed and charged with intention, based on the purpose for which you are welcoming it into your life — whether it’s healing, protection, abundance, peace, or spiritual growth.
                            </p>
                            <p>
                                Auric Krystals is not just about selling crystals; it’s about creating a soulful connection between you and the energy you choose to carry. When a crystal reaches you, it carries care, consciousness, and a silent blessing — reminding you that the universe always supports those who seek with purity of heart.
                            </p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-[4/5] bg-white rounded-2xl overflow-hidden shadow-2xl skew-y-3 transform transition-transform hover:skew-y-0 duration-700">
                             <img src={logo1} alt="Logo"  />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-auric-gold rounded-full flex items-center justify-center animate-pulse">
                            <img src={logo} alt="Logo" className="w-20 h-20 object-contain brightness-0 invert opacity-50" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-6xl">
                    <SectionHeading title="Why We Exist" subtitle="OUR MISSION & VISION" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
                        <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-auric-blush/60 via-white to-auric-gold/20">
                            <img
                                src="/images/about/mission-crystals.jpg"
                                alt="Auric Krystals mission"
                                className="absolute inset-0 w-full h-full object-cover opacity-70"
                            />
                            <div className="relative p-10 space-y-6 backdrop-blur-sm">
                                <h3 className="font-serif text-3xl font-bold text-auric-rose">Our Mission</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Our mission is to guide individuals toward clarity, balance, and self-alignment through authentic astrology and consciously charged crystal energies. At Auric Krystals, we are committed to offering only pure, original, and certified crystals, prepared with intention and care. Every product and every guidance we provide is meant to support personal transformation, emotional healing, and spiritual growth—so that people feel supported, protected, and empowered on their life journey.
                                </p>
                            </div>
                        </div>

                        <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-auric-gold/15 via-white to-auric-blush/50">
                            <img
                                src="/images/about/founder.png"
                                alt="Auric Krystals vision"
                                className="absolute inset-0 w-full h-full object-cover opacity-70"
                            />
                            <div className="relative p-10 space-y-6 backdrop-blur-sm">
                                <h3 className="font-serif text-3xl font-bold text-auric-rose">Our Vision</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    Our vision is to create a trusted sacred space where cosmic wisdom and Earth’s natural energies come together in harmony. We envision Auric Krystals as more than a brand—an energy companion for those seeking truth, healing, and purpose. By blending astrology, crystals, and intention-based practices, we aspire to help people live with greater awareness, confidence, and inner peace, while honoring the belief that destiny is guided best when aligned with conscious choice and pure energy.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 bg-auric-blush text-white">
                <div className="container mx-auto px-4">
                    <SectionHeading title="The Pillars of Auric Krystal" subtitle="OUR VALUES" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                        <div className="p-8 border border-auric-rose/10 rounded-lg hover:border-auric-gold transition-colors">
                            <h3 className="font-serif text-2xl font-bold text-auric-gold mb-4">Authenticity</h3>
                            <p className="text-auric-rose/70">Every gemstone is lab-certified and every reading is rooted in centuries-old traditions.</p>
                        </div>
                        <div className="p-8 border border-auric-rose/10 rounded-lg hover:border-auric-gold transition-colors">
                            <h3 className="font-serif text-2xl font-bold text-auric-gold mb-4">Elegance</h3>
                            <p className="text-auric-rose/70">We believe spiritual growth should be accompanied by aesthetic beauty and grace.</p>
                        </div>
                        <div className="p-8 border border-auric-rose/10 rounded-lg hover:border-auric-gold transition-colors">
                            <h3 className="font-serif text-2xl font-bold text-auric-gold mb-4">Guidance</h3>
                            <p className="text-auric-rose/70">Beyond products, we offer personalized celestial coaching to illuminate your path.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
