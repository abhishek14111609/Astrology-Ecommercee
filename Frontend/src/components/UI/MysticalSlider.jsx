import React, { useState, useEffect } from 'react';
import news1 from '../../assets/images/1.png';
import news2 from '../../assets/images/2.png';
import news3 from '../../assets/images/3.png';
import news4 from '../../assets/images/5.png';

const MysticalSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      //   title: 'Auric Krystals',
      //   subtitle: 'Pure Energy. Authentic Crystals. Conscious Living.',
      //   description: 'Certified Crystals & Gemstones • Spiritual & Energy Products',
      //   ctaText: 'Explore Products',
      //   ctaAction: () => navigate('/shop'),
      //   bgGradient: 'from-purple-900 via-purple-800 to-indigo-900',
      imageUrl: news1,
      //   icon: '✨',
    },
    {
      id: 2,
      //   title: 'Meet Our Modern Astro Guide',
      //   subtitle: 'Dr. Krupali R. Mehta',
      //   description: 'Your Path, Our Guidance',
      //   features: [
      //     'VedicKundali Consultation',
      //     'Kundali Matching',
      //     'Numerology',
      //     'Tarot Card Reading',
      //     'Vastu Guidance',
      //     'Healing Sessions',
      //     'Relationship Counselling',
      //     'Career Counselling',
      //   ],
      //   ctaText: 'Book Consultation',
      //   ctaAction: () => navigate('/services'),
      //   bgGradient: 'from-purple-900 via-purple-800 to-indigo-900',
      imageUrl: news2,
      //   icon: '🌟',
    },
    {
      id: 3,
      //   title: 'Why Our Crystal Products Are Different',
      //   subtitle: 'You might notice our prices differ from other crystal sellers—and here\'s why:',
      //   description: 'At Auric Krystals, we provide energized experiences',
      //   features: [
      //     'Energized Authentic Crystal Bracelet',
      //     'Certificate of Authenticity',
      //     'Each product energized & prepared thoughtfully',
      //     'Every crystal delivers positive energy',
      //   ],
      //   ctaText: 'Learn More',
      //   ctaAction: () => navigate('/about'),
      //   bgGradient: 'from-purple-900 via-purple-800 to-indigo-900',
      imageUrl: news3,
      //   icon: '💎',
    },
    {
      id: 4,
      //   title: 'Hampers by Auric Krystals',
      //   subtitle: 'Why gift ordinary or artificial items?',
      //   description: 'When you can gift positive energy, intention, and healing vibrations',
      //   features: [
      //     'Corporate Gift Hampers',
      //     'Return Gifts for All Occasions',
      //     'Diwali Gift Hampers',
      //   ],
      //   ctaText: 'View Hampers',
      //   ctaAction: () => navigate('/shop'),
      //   bgGradient: 'from-purple-900 via-purple-800 to-indigo-900',
      imageUrl: news4,
      //   icon: '🎁',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <div className="relative w-full h-[300px] xs:h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px] xl:h-[700px] overflow-hidden bg-gray-900">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            {/* Background Image */}
            <img
              src={s.imageUrl}
              alt={`Slide ${s.id}`}
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />

            {/* Content */}
            <div className="relative w-full h-full flex items-center justify-center px-3 sm:px-6 md:px-8 py-8 sm:py-12 md:py-0">
              <div className="max-w-5xl w-full text-center text-white">
                {/* Icon */}
                <div className="text-4xl md:text-6xl mb-3 md:mb-6 animate-pulse">{s.icon}</div>

                {/* Title */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 md:mb-4 bg-gradient-to-r from-amber-200 via-amber-100 to-yellow-200 bg-clip-text text-transparent leading-tight">
                  {s.title}
                </h1>

                {/* Subtitle */}
                <h2 className="text-base sm:text-xl md:text-2xl lg:text-4xl font-serif italic text-amber-100 mb-3 md:mb-6 leading-snug">
                  {s.subtitle}
                </h2>

                {/* Description */}
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 mb-4 md:mb-8 leading-relaxed">
                  {s.description}
                </p>

                {/* Features */}
                {s.features && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-4 md:mb-8 max-w-2xl mx-auto">
                    {s.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center justify-center text-xs sm:text-sm md:text-base">
                        <span className="text-amber-300 mr-2 flex-shrink-0">•</span>
                        <span className="text-gray-100">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* CTA Button */}
                {/* <button
                  onClick={s.ctaAction}
                  className="inline-block px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base md:text-lg bg-gradient-to-r from-amber-400 to-yellow-400 text-purple-900 font-bold rounded-full hover:from-amber-500 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  {s.ctaText}
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-30 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-1.5 sm:p-2 md:p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
        aria-label="Previous slide"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 bg-white/30 hover:bg-white/50 backdrop-blur-sm text-white p-1.5 sm:p-2 md:p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg"
        aria-label="Next slide"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-1.5 sm:gap-2 md:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-300 shadow-md ${index === currentSlide
                ? 'bg-amber-400 w-5 sm:w-6 md:w-8 h-2.5 sm:h-3'
                : 'w-2 sm:w-2.5 md:w-3 h-2 sm:h-2.5 md:h-3 bg-white/50 hover:bg-white/70'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      {/* <div className="absolute top-4 sm:top-8 right-4 sm:right-8 z-30 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full text-white text-xs sm:text-sm font-semibold">
        {currentSlide + 1} / {slides.length}
      </div> */}
    </div>
  );
};

export default MysticalSlider;