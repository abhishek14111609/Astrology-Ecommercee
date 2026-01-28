import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroSlider = ({ slides, interval = 5000, children }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, interval);

        return () => clearInterval(timer);
    }, [slides.length, interval]);

    const currentSlide = slides[currentIndex];

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-black/5">
            {/* Background Image Carousel */}
            <AnimatePresence mode="popLayout">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full flex items-center justify-center"
                >
                    <img
                        src={currentSlide.image}
                        alt={currentSlide.title}
                        className="w-full h-full object-cover object-center"
                    />
                    {/* Overlay for better text visibility */}
                    <div className="absolute inset-0 bg-black/30"></div>
                </motion.div>
            </AnimatePresence>

            {/* Content Overlay */}
            <div className="absolute inset-0 flex items-center justify-center text-center z-10 px-4">
                <div className="max-w-4xl mx-auto space-y-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="space-y-4"
                        >
                            <span className="inline-block text-auric-gold uppercase tracking-[0.3em] text-sm font-semibold">
                                {currentSlide.subtitle}
                            </span>
                            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white leading-tight drop-shadow-lg">
                                {currentSlide.title}
                            </h1>
                            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-md">
                                {currentSlide.desc}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Fixed Buttons Area */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="pt-6"
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default HeroSlider;
