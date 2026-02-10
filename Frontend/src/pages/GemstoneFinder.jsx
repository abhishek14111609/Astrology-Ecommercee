import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/UI/Button';
import ProductCard from '../components/UI/ProductCard';
import axios from 'axios';
import VITE_API_BASE_URL from '../config/api';

const GemstoneFinder = () => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [productsError, setProductsError] = useState(null);
    const [matchedProducts, setMatchedProducts] = useState([]);

    // Fetch quiz questions on component mount
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${VITE_API_BASE_URL}/api/products/quiz/questions`);
                setQuestions(response.data);
                setFetchError(null);
            } catch (error) {
                console.error('Error fetching quiz questions:', error);
                setFetchError('Failed to load quiz. Please refresh the page.');
                setQuestions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setProductsLoading(true);
                const response = await axios.get(`${VITE_API_BASE_URL}/api/products`);
                const data = response.data?.data?.products || response.data?.products || response.data;

                if (Array.isArray(data)) {
                    setProducts(data);
                    setProductsError(null);
                } else {
                    setProducts([]);
                    setProductsError('Failed to load product recommendations.');
                }
            } catch (error) {
                console.error('Error fetching products:', error);
                setProducts([]);
                setProductsError('Failed to load product recommendations.');
            } finally {
                setProductsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Crystal recommendations mapped to answer themes (A-D)
    const crystalResults = [
        {
            id: 'rose-quartz',
            title: 'Rose Quartz',
            theme: 'Love • Emotional Healing • Self-Care',
            summary:
                'Gently opens the heart, heals emotional wounds, and attracts harmonious relationships. Supports inner peace and emotional balance.',
            searchHint: 'Search "Rose Quartz" in the shop to view all options.',
            matches: ['A'],
            keywords: ['rose quartz'],
        },
        {
            id: 'amethyst',
            title: 'Amethyst',
            theme: 'Mental Peace • Clarity • Spiritual Growth',
            summary:
                'Soothes the mind, eases overthinking, and enhances intuition. Ideal when you want calm, focus, and emotional stability.',
            searchHint: 'Type "Amethyst" in the search bar and pick what resonates.',
            matches: ['B'],
            keywords: ['amethyst'],
        },
        {
            id: 'citrine',
            title: 'Citrine',
            theme: 'Abundance • Confidence • Success',
            summary:
                'Known as the stone of prosperity and positivity. Boosts confidence, attracts success, and helps clear self-doubt.',
            searchHint: 'Search "Citrine" to explore prosperity pieces.',
            matches: ['C'],
            keywords: ['citrine'],
        },
        {
            id: 'black-tourmaline',
            title: 'Black Tourmaline',
            theme: 'Protection • Grounding • Stability',
            summary:
                'Absorbs negativity, grounds your energy, and builds a shield of stability. Great for sensitive or draining environments.',
            searchHint: 'Type "Black Tourmaline" to see protective pieces.',
            matches: ['D'],
            keywords: ['black tourmaline', 'tourmaline'],
        },
        {
            id: 'clear-quartz',
            title: 'Clear Quartz',
            theme: 'Energy Amplification • Clarity • Balance',
            summary:
                'The master healer. Amplifies positive energy, supports focus, and balances overall well-being.',
            searchHint: 'Search "Clear Quartz" to find master healer options.',
            matches: ['A', 'B', 'C', 'D'],
            keywords: ['clear quartz', 'quartz'],
        },
        {
            id: 'green-aventurine',
            title: 'Green Aventurine',
            theme: 'Luck • Growth • New Opportunities',
            summary:
                'Attracts luck and gentle growth while keeping emotions calm. Perfect for new beginnings and steady progress.',
            searchHint: 'Type "Green Aventurine" to see growth-focused pieces.',
            matches: ['A', 'C'],
            keywords: ['green aventurine', 'aventurine'],
        },
        {
            id: 'tigers-eye',
            title: "Tiger's Eye",
            theme: 'Courage • Strength • Decision-Making',
            summary:
                'Builds courage, confidence, and decisive action—especially during challenges or competition.',
            searchHint: 'Search "Tiger\'s Eye" for confidence boosters.',
            matches: ['C'],
            keywords: ["tiger's eye", 'tiger eye'],
        },
        {
            id: 'labradorite',
            title: 'Labradorite',
            theme: 'Transformation • Intuition • Energy Protection',
            summary:
                'Protects the aura, heightens intuition, and supports spiritual growth during life transitions.',
            searchHint: 'Type "Labradorite" to browse transformative pieces.',
            matches: ['B', 'D'],
            keywords: ['labradorite'],
        },
        {
            id: 'carnelian',
            title: 'Carnelian',
            theme: 'Motivation • Creativity • Vitality',
            summary:
                'Ignites passion, creativity, and drive. Great when you need a spark of motivation and vitality.',
            searchHint: 'Search "Carnelian" to explore vitality pieces.',
            matches: ['C'],
            keywords: ['carnelian'],
        },
        {
            id: 'selenite',
            title: 'Selenite',
            theme: 'Cleansing • Peace • Higher Awareness',
            summary:
                'Clears heavy energy, promotes mental clarity, and brings serene, higher awareness to your space.',
            searchHint: 'Type "Selenite" to view cleansing options.',
            matches: ['B', 'D'],
            keywords: ['selenite'],
        },
    ];

    useEffect(() => {
        if (results.length === 0 || products.length === 0) {
            setMatchedProducts([]);
            return;
        }

        const keywordSet = new Set(
            results
                .flatMap((res) => res.keywords || [res.title])
                .map((keyword) => keyword.toLowerCase())
        );

        const matches = products.filter((product) => {
            const name = (product.name || '').toLowerCase();
            const tags = (product.tags || []).map((tag) => String(tag).toLowerCase());
            return Array.from(keywordSet).some((keyword) => name.includes(keyword) || tags.includes(keyword));
        });

        setMatchedProducts(matches.slice(0, 8));
    }, [results, products]);

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

    };

    const reset = () => {
        setStep(0);
        setAnswers([]);
        setResults([]);
        setMatchedProducts([]);
        setProductsError(null);
    };

    return (
        <div className="min-h-[70vh] py-20 bg-white">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                {fetchError ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-20"
                    >
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                            <p className="text-red-600 font-medium mb-4">{fetchError}</p>
                            <Button variant="outline" onClick={() => window.location.reload()}>
                                Refresh Page
                            </Button>
                        </div>
                    </motion.div>
                ) : loading && questions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-20"
                    >
                        <div className="animate-spin w-12 h-12 border-4 border-auric-gold border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-auric-gold font-medium animate-pulse uppercase tracking-widest">Loading Quiz...</p>
                    </motion.div>
                ) : (
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
                                    <h2 className="text-3xl md:text-4xl font-serif text-auric-rose font-bold">{questions[step]?.question_text}</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {questions[step]?.options?.map((opt, idx) => (
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
                                <>
                                    <div className="space-y-4">
                                        <h2 className="text-4xl font-serif text-auric-rose font-bold">Your Spiritual Matches</h2>
                                        <p className="text-gray-600">Based on your answers, these sacred artifacts will harmonize with your energy best.</p>
                                    </div>

                                    {results.length > 0 ? (
                                        <p className="text-sm text-gray-600">
                                            Spiritual matches: {results.map((res) => res.title).join(', ')}.
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-600">
                                            No direct spiritual matches found, but we can still suggest products for your answers.
                                        </p>
                                    )}

                                    <div className="space-y-4">
                                        <h3 className="text-2xl font-serif text-auric-rose font-bold">Recommended Products</h3>
                                        {productsLoading ? (
                                            <div className="flex justify-center py-8">
                                                <div className="animate-spin w-8 h-8 border-4 border-auric-gold border-t-transparent rounded-full"></div>
                                            </div>
                                        ) : productsError ? (
                                            <p className="text-sm text-red-500">{productsError}</p>
                                        ) : matchedProducts.length > 0 ? (
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                                {matchedProducts.map((product) => (
                                                    <ProductCard key={product._id || product.id} product={product} />
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-600">No product suggestions found for your answers yet.</p>
                                        )}
                                    </div>

                                    <div className="pt-8">
                                        <Button variant="outline" onClick={reset}>Restart Quiz</Button>
                                    </div>
                                </>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default GemstoneFinder;
