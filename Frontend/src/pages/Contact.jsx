import React from 'react';
import SectionHeading from '../components/UI/SectionHeading';
import Button from '../components/UI/Button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import VITE_API_BASE_URL from '../config/api';

const Contact = () => {
    return (
        <div className="bg-auric-blush min-h-screen">
            {/* Header */}
            <section className="py-20 bg-white border-b border-auric-gold/10">
                <div className="container mx-auto px-4 text-center">
                    <SectionHeading title="Connect With Us" subtitle="SAY HELLO" />
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                        Whether you seek a custom celestial consultation or have a question about our boutique items,
                        our guardians of harmony are here to assist you.
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-20 container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-auric-blush rounded-full flex items-center justify-center text-auric-rose mb-4">
                                    <Mail size={24} />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-auric-rose mb-2">Email</h3>
                                <p className="text-gray-600">aurickrystals@gmail.com</p>
                                <p className="text-gray-400 text-sm mt-1">24/7 Celestial Support</p>
                            </div>
                            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                                <div className="w-12 h-12 bg-auric-blush rounded-full flex items-center justify-center text-auric-rose mb-4">
                                    <Phone size={24} />
                                </div>
                                <h3 className="font-serif text-xl font-bold text-auric-rose mb-2">Phone</h3>
                                <p className="text-gray-600">+91 70432 16616</p>
                                <p className="text-gray-400 text-sm mt-1">Mon-Sat, 9am - 7pm</p>
                            </div>
                        </div>

                        <div className="bg-auric-rose text-white p-12 rounded-xl shadow-xl relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="font-serif text-2xl font-bold mb-6">Visit Our Sanctuary</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <MapPin className="text-auric-gold mt-1 shrink-0" size={20} />
                                        <p className="text-white/80 leading-relaxed text-lg">
                                            125 Rk World Tower <br />
                                            Rajkot 360006 <br />
                                            Gujrat, India
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-auric-gold/10 rounded-full blur-3xl"></div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-10 rounded-xl shadow-lg border border-gray-100">
                        <h3 className="font-serif text-2xl font-bold text-auric-rose mb-8 text-center">Send an Inquiry</h3>
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const data = Object.fromEntries(formData.entries());

                            try {
                                const button = e.target.querySelector('button');
                                const originalText = button.innerHTML;
                                button.disabled = true;
                                button.innerHTML = 'Sending...';

                                const res = await fetch(`${VITE_API_BASE_URL}/api/contact`, {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(data)
                                });

                                if (res.ok) {
                                    alert('Message sent successfully!');
                                    e.target.reset();
                                } else {
                                    alert('Failed to send message. Please try again.');
                                }
                                button.innerHTML = originalText;
                                button.disabled = false;
                            } catch (err) {
                                console.error(err);
                                alert('An error occurred.');
                            }
                        }} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                                    <input name="name" required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-auric-gold transition-colors" placeholder="Enter your name" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                                    <input name="email" required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-auric-gold transition-colors" placeholder="Enter your email" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Subject</label>
                                <select name="subject" className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-auric-gold transition-colors appearance-none capitalize">
                                    <option>General Inquiry</option>
                                    <option>Crystal Consultation</option>
                                    <option>Astrology Service</option>
                                    <option>Order Support</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Your Message</label>
                                <textarea name="message" required rows="5" className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-auric-gold transition-colors" placeholder="How can we illuminate your path?"></textarea>
                            </div>
                            <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                                    <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-sm px-4 py-3 focus:outline-none focus:border-auric-gold transition-colors" placeholder="Enter your Phone Number" />
                                </div>
                            <Button variant="primary" className="w-full py-4 gap-2">
                                <Send size={18} /> Send Message
                            </Button>
                        </form>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default Contact;
