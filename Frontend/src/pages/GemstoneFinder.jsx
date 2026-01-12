import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/UI/Button';
import ProductCard from '../components/UI/ProductCard';

const GemstoneFinder = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const questions = [
        {
            id: 1,
            text: "What is your primary goal right now?",
            options: [
                { text: "Career Growth", tag: "Career" },
                { text: "Personal Peace", tag: "Peace" },
                { text: "Wealth & Prosperity", tag: "Wealth" },
                { text: "Better Health", tag: "Health" }
            ]
        },
        {
            id: 2,
            text: "Which area of life needs most protection?",
            options: [
                { text: "Evil Eye / Negativity", tag: "Protection" },
                { text: "Relationships", tag: "Love" },
                { text: "Travel & Safety", tag: "Safety" },
                { text: "Business Stability", tag: "Stability" }
            ]
        },
        {
            id: 3,
            text: "How do you feel most of the time?",
            options: [
                { text: "Stressed / Anxious", tag: "Calm" },
                { text: "Lacking Energy", tag: "Energy" },
                { text: "Seeking Direction", tag: "Wisdom" },
                { text: "Emotionally Heavy", tag: "Healing" }
            ]
        },
        {
            id: 4,
            text: "What kind of energy are you attracted to?",
            options: [
                { text: "Vibrant & Bold", tag: "Dynamic" },
                { text: "Cool & Soothing", tag: "Lunar" },
                { text: "Earthy & Grounded", tag: "Earth" },
                { text: "Divine & Spiritual", tag: "Spirit" }
            ]
        }
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

    const fetchResults = async (finalAnswers) => {
        setLoading(true);
        setStep(questions.length); // Final "calculating" state
        try {
            const response = await fetch('http://localhost:5000/api/products/suggest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: finalAnswers }),
            });
            const data = await response.json();
            setResults(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
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
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                                            {results.map(product => (
                                                <ProductCard key={product.id} product={product} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-12 bg-auric-blush rounded-3xl">
                                            <p className="text-auric-rose font-medium">No direct matches found, but our general collection might still hold what you're looking for.</p>
                                            <Button variant="outline" className="mt-6" onClick={reset}>Try Again</Button>
                                        </div>
                                    )}

                                    <div className="pt-8">
                                        <Button variant="outline" onClick={reset}>Restart Finder</Button>
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
