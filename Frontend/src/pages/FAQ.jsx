import React, { useState } from 'react';
import SectionHeading from '../components/UI/SectionHeading';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
    const categories = [
        {
            title: "Products & Quality",
            questions: [
                { q: "Are your crystals authentic and certified?", a: "Yes, all our gemstones and crystals are authentic and undergo rigorous lab certification. Every high-value item comes with a certificate of authenticity." },
                { q: "How should I cleanse my crystals?", a: "We recommend cleansing your crystals with sage smoke, moonlight, or sound healing. Avoid water for certain stones like Selenite or Pyrite." }
            ]
        },
        {
            title: "Consultations",
            questions: [
                { q: "How do I book an astrology session?", a: "You can book a session through our Services page. Select your desired consultation, choose a time slot, and complete the booking." },
                { q: "Can I get a recording of my session?", a: "Yes, all virtual consultations are recorded and the link is shared with you within 24 hours of the session." }
            ]
        },
        {
            title: "Orders & Shipping",
            questions: [
                { q: "How long does delivery take?", a: "Orders are typically processed within 2-3 business days. Domestic shipping takes 5-7 business days, while international shipping may take 10-14 days." },
                { q: "Do you offer international shipping?", a: "Yes, we ship our celestial artifacts world-wide. Shipping costs and delivery times vary by location." }
            ]
        }
    ];

    const [openIdx, setOpenIdx] = useState(null);

    const toggle = (idx) => {
        setOpenIdx(openIdx === idx ? null : idx);
    };

    return (
        <div className="bg-auric-blush min-h-screen py-16">
            <div className="container mx-auto px-4 max-w-4xl">
                <SectionHeading title="Common Inquiries" subtitle="FREQUENTLY ASKED" />

                <div className="mt-12 space-y-12">
                    {categories.map((cat, catIdx) => (
                        <div key={catIdx}>
                            <h3 className="font-serif text-2xl font-bold text-auric-rose mb-6 pb-2 border-b border-auric-gold/20">{cat.title}</h3>
                            <div className="space-y-4">
                                {cat.questions.map((item, qIdx) => {
                                    const globalIdx = `${catIdx}-${qIdx}`;
                                    const isOpen = openIdx === globalIdx;
                                    return (
                                        <div key={qIdx} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm transition-all duration-300">
                                            <button
                                                onClick={() => toggle(globalIdx)}
                                                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                                            >
                                                <span className="font-bold text-auric-rose">{item.q}</span>
                                                {isOpen ? <ChevronUp className="text-auric-gold" size={20} /> : <ChevronDown className="text-gray-400" size={20} />}
                                            </button>
                                            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                                <div className="p-6 pt-0 text-gray-600 leading-relaxed border-t border-gray-50 bg-gray-50/30">
                                                    {item.a}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FAQ;
