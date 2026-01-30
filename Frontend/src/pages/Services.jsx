import React, { useState } from 'react';
import SectionHeading from '../components/UI/SectionHeading';
import Button from '../components/UI/Button';
import { Star, Heart, Moon, Sun, Gem, Compass, X, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import VITE_API_BASE_URL from '../config/api';
import axios from 'axios';

const Services = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [loading, setLoading] = useState(false);
    const [bookingData, setBookingData] = useState({
        preferred_date: '',
        preferred_time: '',
        message: ''
    });

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
        },
        {
            title: "Lunar Shadow Reading",
            subtitle: "MOON SIGN INSIGHTS",
            desc: "Explore your emotional landscape and subconscious patterns through an intensive analysis of your Moon sign and Nakshatras.",
            icon: <Moon size={32} />,
            price: "₹799"
        },
        {
            title: "Career Constellation",
            subtitle: "PROFESSIONAL GUIDANCE",
            desc: "Align your career choices with your astrological strengths. Find the perfect time for professional transitions and growth.",
            icon: <Star size={32} />,
            price: "₹1,299"
        },
        {
            title: "Solar Return Report",
            subtitle: "YEAR AHEAD FORECAST",
            desc: "A comprehensive guide for your upcoming year, starting from your birthday. Prepare for the challenges and embrace the opportunities.",
            icon: <Sun size={32} />,
            price: "₹1,999"
        }
    ];

    const handleBookSession = (service) => {
        if (!user) {
            navigate('/login');
            return;
        }
        setSelectedService(service);
        setShowBookingModal(true);
    };

    const handleInputChange = (e) => {
        setBookingData({ ...bookingData, [e.target.name]: e.target.value });
    };

    const handleSubmitBooking = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post(`${VITE_API_BASE_URL}/api/service-bookings/create`, {
                service_title: selectedService.title,
                service_subtitle: selectedService.subtitle,
                service_price: selectedService.price,
                ...bookingData
            });

            alert('Booking request submitted successfully! We will contact you soon.');
            setShowBookingModal(false);
            setBookingData({ preferred_date: '', preferred_time: '', message: '' });
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to submit booking');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-auric-blush min-h-screen">
            {/* Header */}
            <section className="py-20 bg-auric-rose text-white overflow-hidden relative">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <span className="text-auric-gold uppercase tracking-[0.3em] text-sm font-semibold mb-3 block">Divine Offerings</span>
                    <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">Spiritual Consultations</h1>
                    <p className="text-white/70 max-w-3xl mx-auto text-lg leading-relaxed">
                        Our master practitioners use time-honored traditions to provide clarity and guidance
                        on your journey through the cosmos.
                    </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://images.unsplash.com/photo-1506318137071-a8e063b4bcc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] bg-cover bg-center"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-auric-gold/10 rounded-full blur-3xl"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-auric-gold/10 rounded-full blur-3xl"></div>
            </section>

            {/* Services Grid */}
            <section className="py-20 container mx-auto px-4">
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
                                <Button 
                                    onClick={() => handleBookSession(service)}
                                    variant="outline" 
                                    className="text-xs px-4 py-2 border-auric-gold text-auric-gold hover:bg-auric-gold hover:text-white"
                                >
                                    Book Session
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action */} 
            {/* <section className="py-20 bg-white">
                <div className="container mx-auto px-4 text-center bg-auric-blush/30 rounded-3xl p-16 border border-auric-gold/10">
                    <h2 className="font-serif text-3xl md:text-4xl text-auric-rose font-bold mb-6">Unsure where to begin?</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-10 text-lg">
                        Connect with our celestial concierge for a complimentary 10-minute discovery call to find the perfect service for your needs.
                    </p>
                    <Button variant="primary" className="px-10 py-4 text-sm tracking-widest">Request Discovery Call</Button>
                </div>
            </section> */}

            {/* Booking Modal */}
            {showBookingModal && selectedService && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl transform transition-all max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-serif text-2xl font-bold text-auric-rose">Book {selectedService.title}</h3>
                            <button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="bg-auric-blush/30 p-4 rounded-xl mb-6">
                            <p className="text-sm text-gray-600 mb-1">{selectedService.subtitle}</p>
                            <p className="text-2xl font-serif font-bold text-auric-rose">{selectedService.price}</p>
                        </div>

                        <form onSubmit={handleSubmitBooking} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">Preferred Date</label>
                                <input
                                    type="date"
                                    name="preferred_date"
                                    required
                                    value={bookingData.preferred_date}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-auric-gold"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">Preferred Time</label>
                                <input
                                    type="time"
                                    name="preferred_time"
                                    required
                                    value={bookingData.preferred_time}
                                    onChange={handleInputChange}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-auric-gold"
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 block mb-2">Message (Optional)</label>
                                <textarea
                                    name="message"
                                    value={bookingData.message}
                                    onChange={handleInputChange}
                                    rows="4"
                                    placeholder="Any specific requirements or questions..."
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:border-auric-gold resize-none"
                                ></textarea>
                            </div>

                            <div className="flex gap-4 mt-6">
                                <Button
                                    type="button"
                                    onClick={() => setShowBookingModal(false)}
                                    variant="secondary"
                                    className="flex-1 py-3"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    variant="primary"
                                    className="flex-1 py-3 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16} />
                                            Submitting...
                                        </>
                                    ) : 'Submit Request'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;
