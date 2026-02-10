import React, { useState } from 'react';
import SectionHeading from '../components/UI/SectionHeading';
import Button from '../components/UI/Button';

const Zodiac = () => {
    const signs = [
        { name: 'Aries', date: 'Mar 21 - Apr 19', symbol: '♈', element: 'Fire', trait: 'Fearless' },
        { name: 'Taurus', date: 'Apr 20 - May 20', symbol: '♉', element: 'Earth', trait: 'Reliable' },
        { name: 'Gemini', date: 'May 21 - Jun 20', symbol: '♊', element: 'Air', trait: 'Expressive' },
        { name: 'Cancer', date: 'Jun 21 - Jul 22', symbol: '♋', element: 'Water', trait: 'Intuitive' },
        { name: 'Leo', date: 'Jul 23 - Aug 22', symbol: '♌', element: 'Fire', trait: 'Radiant' },
        { name: 'Virgo', date: 'Aug 23 - Sep 22', symbol: '♍', element: 'Earth', trait: 'Analytical' },
        { name: 'Libra', date: 'Sep 23 - Oct 22', symbol: '♎', element: 'Air', trait: 'Harmonious' },
        { name: 'Scorpio', date: 'Oct 23 - Nov 21', symbol: '♏', element: 'Water', trait: 'Passionate' },
        { name: 'Sagittarius', date: 'Nov 22 - Dec 21', symbol: '♐', element: 'Fire', trait: 'Adventurous' },
        { name: 'Capricorn', date: 'Dec 22 - Jan 19', symbol: '♑', element: 'Earth', trait: 'Ambitious' },
        { name: 'Aquarius', date: 'Jan 20 - Feb 18', symbol: '♒', element: 'Air', trait: 'Original' },
        { name: 'Pisces', date: 'Feb 19 - Mar 20', symbol: '♓', element: 'Water', trait: 'Dreamy' },
    ];

    const [selectedSign, setSelectedSign] = useState(null);

    return (
        <div className="bg-auric-blush min-h-screen py-20">
            <div className="container mx-auto px-4">
                <SectionHeading title="Daily Celestial Guidance" subtitle="YOUR Zodiac" />

                <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16 text-lg">
                    Discover how the current planetary movements are influencing your energy,
                    career, and connections today. Select your zodiac sign for enlightenment.
                </p>

                {/* Signs Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-16">
                    {signs.map((sign, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedSign(sign)}
                            className={`p-8 bg-white rounded-2xl border transition-all duration-300 flex flex-col items-center hover:shadow-xl hover:border-auric-gold group ${selectedSign?.name === sign.name ? 'border-auric-gold shadow-lg shadow-auric-gold/10' : 'border-gray-100'}`}
                        >
                            <span className={`zodiac-glyph text-4xl mb-4 transition-transform duration-300 group-hover:scale-110 ${selectedSign?.name === sign.name ? 'text-auric-gold' : 'text-auric-rose'}`}>
                                {sign.symbol}
                            </span>
                            <span className="font-serif text-lg font-bold text-auric-rose">{sign.name}</span>
                            <span className="text-[0.6rem] uppercase tracking-widest text-gray-400 mt-1">{sign.date}</span>
                        </button>
                    ))}
                </div>

                {/* Daily Reading Display */}
                {selectedSign ? (
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-auric-gold/10 max-w-4xl mx-auto transform transition-all animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <div className="grid grid-cols-1 md:grid-cols-3">
                            <div className="bg-auric-rose p-10 text-white flex flex-col items-center justify-center text-center">
                                <span className="zodiac-glyph text-6xl mb-6 text-auric-gold">{selectedSign.symbol}</span>
                                <h3 className="font-serif text-3xl font-bold mb-2">{selectedSign.name}</h3>
                                <div className="space-y-4 w-full mt-6 pt-6 border-t border-white/10 uppercase tracking-[0.2em] text-[0.7rem] font-bold">
                                    <div className="flex justify-between">
                                        <span className="text-white/50">Element</span>
                                        <span className="text-auric-gold font-bold">{selectedSign.element}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-white/50">Quality</span>
                                        <span className="text-auric-gold font-bold">{selectedSign.trait}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-2 p-10 md:p-12">
                                <span className="text-auric-gold font-bold uppercase tracking-[0.2em] text-xs">Today's Forecast - {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                <h4 className="font-serif text-2xl font-bold text-auric-rose mt-2 mb-6">Alignment & Abundance</h4>
                                <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
                                    <p>
                                        Today, the alignment of celestial bodies indicates a period of introspection and renewed clarity for {selectedSign.name}. You may find that long-standing questions are finally finding their answers as you embrace the stillness within.
                                    </p>
                                    <p>
                                        In your professional life, a touch of {selectedSign.trait} energy will serve you well. Trust your instincts on a creative project that has been surfacing in your thoughts. Your element of {selectedSign.element} is particularly active, grounding you while allowing for organic growth.
                                    </p>
                                </div>
                                <div className="mt-10 flex flex-wrap gap-4">
                                    <div className="px-4 py-2 bg-auric-blush rounded-full text-auric-rose text-sm font-bold">Lucky Color: Gold</div>
                                    <div className="px-4 py-2 bg-auric-blush rounded-full text-auric-rose text-sm font-bold">Lucky Number: 8</div>
                                    <div className="px-4 py-2 bg-auric-blush rounded-full text-auric-rose text-sm font-bold">Crystal: Rose Quartz</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-auric-rose/20 backdrop-blur-sm">
                        <p className="text-auric-rose/60 text-xl font-serif italic text-lg">Select your sign to reveal today's celestial message...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Zodiac;
