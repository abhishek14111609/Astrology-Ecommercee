import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/UI/Button';

const GemstoneFinder = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // New quiz content (7 questions, A-D answers)
    const questions = [
        {
            id: 1,
            text: 'When you wake up most days, how do you usually feel?',
            options: [
                { text: 'Calm but emotionally sensitive', tag: 'A' },
                { text: 'Mentally tired or overthinking', tag: 'B' },
                { text: 'Energetic but restless', tag: 'C' },
                { text: 'Heavy, drained, or low', tag: 'D' },
            ],
        },
        {
            id: 2,
            text: 'Which area of life feels most out of balance right now?',
            options: [
                { text: 'Love, emotions, or relationships', tag: 'A' },
                { text: 'Mental peace and clarity', tag: 'B' },
                { text: 'Career, money, or growth', tag: 'C' },
                { text: 'Protection and stability', tag: 'D' },
            ],
        },
        {
            id: 3,
            text: 'What are you seeking the most at this phase of life?',
            options: [
                { text: 'Emotional healing and self-love', tag: 'A' },
                { text: 'Guidance and inner clarity', tag: 'B' },
                { text: 'Confidence, success, and motivation', tag: 'C' },
                { text: 'Grounding and protection', tag: 'D' },
            ],
        },
        {
            id: 4,
            text: 'How do you usually react to stressful situations?',
            options: [
                { text: 'I get emotionally affected easily', tag: 'A' },
                { text: 'I overthink and feel mentally exhausted', tag: 'B' },
                { text: 'I push myself harder to overcome it', tag: 'C' },
                { text: 'I withdraw and feel low on energy', tag: 'D' },
            ],
        },
        {
            id: 5,
            text: 'What kind of energy do you wish to attract right now?',
            options: [
                { text: 'Gentle, loving, and soothing', tag: 'A' },
                { text: 'Calm, peaceful, and balanced', tag: 'B' },
                { text: 'Powerful, confident, and abundant', tag: 'C' },
                { text: 'Protective, grounding, and stable', tag: 'D' },
            ],
        },
        {
            id: 6,
            text: 'Which affirmation resonates most with you?',
            options: [
                { text: '“I am worthy of love and healing.”', tag: 'A' },
                { text: '“My mind is calm and clear.”', tag: 'B' },
                { text: '“I attract success and abundance.”', tag: 'C' },
                { text: '“I am safe, protected, and grounded.”', tag: 'D' },
            ],
        },
        {
            id: 7,
            text: 'How would you like your crystal to support you?',
            options: [
                { text: 'Heal my emotions and bring comfort', tag: 'A' },
                { text: 'Clear my mind and improve focus', tag: 'B' },
                { text: 'Boost my confidence and growth', tag: 'C' },
                { text: 'Protect my energy and keep me grounded', tag: 'D' },
            ],
        },
    ];

    // Crystal recommendations mapped to answer themes (A-D)
    const crystalResults = [
        {
            id: 'rose-quartz',
            title: 'Rose Quartz',
            theme: 'Love • Emotional Healing • Self-Care',
            summary:
                'Gently opens the heart, heals emotional wounds, and attracts harmonious relationships. Supports inner peace and emotional balance.',
            searchHint: 'Search “Rose Quartz” in the shop to view all options.',
            matches: ['A'],
        },
        {
            id: 'amethyst',
            title: 'Amethyst',
            theme: 'Mental Peace • Clarity • Spiritual Growth',
            summary:
                'Soothes the mind, eases overthinking, and enhances intuition. Ideal when you want calm, focus, and emotional stability.',
            searchHint: 'Type “Amethyst” in the search bar and pick what resonates.',
            matches: ['B'],
        },
        {
            id: 'citrine',
            title: 'Citrine',
            theme: 'Abundance • Confidence • Success',
            summary:
                'Known as the stone of prosperity and positivity. Boosts confidence, attracts success, and helps clear self-doubt.',
            searchHint: 'Search “Citrine” to explore prosperity pieces.',
            matches: ['C'],
        },
        {
            id: 'black-tourmaline',
            title: 'Black Tourmaline',
            theme: 'Protection • Grounding • Stability',
            summary:
                'Absorbs negativity, grounds your energy, and builds a shield of stability. Great for sensitive or draining environments.',
            searchHint: 'Type “Black Tourmaline” to see protective pieces.',
            matches: ['D'],
        },
        {
            id: 'clear-quartz',
            title: 'Clear Quartz',
            theme: 'Energy Amplification • Clarity • Balance',
            summary:
                'The master healer. Amplifies positive energy, supports focus, and balances overall well-being.',
            searchHint: 'Search “Clear Quartz” to find master healer options.',
            matches: ['A', 'B', 'C', 'D'],
        },
        {
            id: 'green-aventurine',
            title: 'Green Aventurine',
            theme: 'Luck • Growth • New Opportunities',
            summary:
                'Attracts luck and gentle growth while keeping emotions calm. Perfect for new beginnings and steady progress.',
            searchHint: 'Type “Green Aventurine” to see growth-focused pieces.',
            matches: ['A', 'C'],
        },
        {
            id: 'tigers-eye',
            title: "Tiger's Eye",
            theme: 'Courage • Strength • Decision-Making',
            summary:
                'Builds courage, confidence, and decisive action—especially during challenges or competition.',
            searchHint: 'Search “Tiger’s Eye” for confidence boosters.',
            matches: ['C'],
        },
        {
            id: 'labradorite',
            title: 'Labradorite',
            theme: 'Transformation • Intuition • Energy Protection',
            summary:
                'Protects the aura, heightens intuition, and supports spiritual growth during life transitions.',
            searchHint: 'Type “Labradorite” to browse transformative pieces.',
            matches: ['B', 'D'],
        },
        {
            id: 'carnelian',
            title: 'Carnelian',
            theme: 'Motivation • Creativity • Vitality',
            summary:
                'Ignites passion, creativity, and drive. Great when you need a spark of motivation and vitality.',
            searchHint: 'Search “Carnelian” to explore vitality pieces.',
            matches: ['C'],
        },
        {
            id: 'selenite',
            title: 'Selenite',
            theme: 'Cleansing • Peace • Higher Awareness',
            summary:
                'Clears heavy energy, promotes mental clarity, and brings serene, higher awareness to your space.',
            searchHint: 'Type “Selenite” to view cleansing options.',
            matches: ['B', 'D'],
        },
    ];

    const handleOption = (tag) => {
        const newAnswers = [...answers, tag];
        setAnswers(newAnswers);
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            fetchResults(newAnswers);
        }
    };

    const fetchResults = (finalAnswers) => {
        setLoading(true);
        setStep(questions.length);

        // Tally scores for A-D
        const tally = { A: 0, B: 0, C: 0, D: 0 };
        finalAnswers.forEach((tag) => {
            if (tally[tag] !== undefined) {
                tally[tag] += 1;
            }
        });

        // Score crystals by how well they match the chosen themes
        const scored = crystalResults
            .map((crystal) => {
                const score = crystal.matches.reduce((acc, letter) => acc + (tally[letter] || 0), 0);
                return { ...crystal, score };
            })
            .sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score;
                return a.title.localeCompare(b.title);
            });

        // Take the top 4 recommendations
        setResults(scored.slice(0, 4));
        setLoading(false);
    };

    const reset = () => {
        setStep(0);
        setAnswers([]);
        setResults([]);
    };

    return (
        <div className="min-h-[70vh] py-20 bg-white">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                <AnimatePresence mode="wait">
                    {step < questions.length ? (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="space-y-2">
                                <span className="text-auric-gold font-semibold uppercase tracking-widest text-sm">Step {step + 1} of {questions.length}</span>
                                <h2 className="text-3xl md:text-4xl font-serif text-auric-rose font-bold">{questions[step].text}</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {questions[step].options.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOption(opt.tag)}
                                        className="p-6 border-2 border-auric-blush rounded-2xl hover:border-auric-gold hover:bg-auric-blush/20 transition-all duration-300 text-lg font-medium text-auric-rose group"
                                    >
                                        {opt.text}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-12"
                        >
                            {loading ? (
                                <div className="py-20">
                                    <div className="animate-spin w-12 h-12 border-4 border-auric-gold border-t-transparent rounded-full mx-auto mb-4"></div>
                                    <p className="text-auric-gold font-medium animate-pulse uppercase tracking-widest">Studying Your Celestial Pattern...</p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        <h2 className="text-4xl font-serif text-auric-rose font-bold">Your Spiritual Matches</h2>
                                        <p className="text-gray-600">Based on your answers, these sacred artifacts will harmonize with your energy best.</p>
                                    </div>

                                    {results.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                                            {results.map((res, idx) => (
                                                <div
                                                    key={res.id}
                                                    className="p-6 rounded-3xl border-2 border-auric-blush bg-white shadow-sm hover:shadow-md transition-all duration-300"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-sm font-semibold text-auric-gold uppercase tracking-widest">
                                                            {idx === 0 ? 'Top Match' : 'Good Match'}
                                                        </span>
                                                        <span className="text-xs text-gray-500">Score {res.score}</span>
                                                    </div>
                                                    <h3 className="text-2xl font-serif text-auric-rose font-bold mb-1">{res.title}</h3>
                                                    <p className="text-auric-gold font-semibold text-sm mb-3">{res.theme}</p>
                                                    <p className="text-gray-700 leading-relaxed mb-4">{res.summary}</p>
                                                    <div className="text-sm text-gray-600 bg-auric-blush/30 rounded-2xl px-3 py-2 inline-block">
                                                        {res.searchHint}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-12 bg-auric-blush rounded-3xl">
                                            <p className="text-auric-rose font-medium">No direct matches found, but our general collection might still hold what you're looking for.</p>
                                            <Button variant="outline" className="mt-6" onClick={reset}>Try Again</Button>
                                        </div>
                                    )}

                                    <div className="pt-8">
                                        <Button variant="outline" onClick={reset}>Restart Quiz</Button>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default GemstoneFinder;
