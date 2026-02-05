import React, { useState, useEffect } from 'react';
import news1 from '../../assets/images/news1.jpeg';
import news2 from '../../assets/images/news2.jpeg';
import news3 from '../../assets/images/news3.jpeg';
import news4 from '../../assets/images/news4.jpeg';

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

  // const goToSlide = (index) => {
  //   setCurrentSlide(index);
  // };

  // const nextSlide = () => {
  //   setCurrentSlide((prev) => (prev + 1) % slides.length);
  // };

  // const prevSlide = () => {
  //   setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  // };

  // const slide = slides[currentSlide];

  return (
    <div className="relative w-full h-[500px] sm:h-[600px] md:h-screen overflow-hidden">
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-center bg-cover bg-no-repeat"
              style={{ backgroundImage: `url(${s.imageUrl})` }}
            />

            {/* Dark Overlay for Text Readability */}
            <div className="absolute inset-0 bg-black/20" />

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
      {/* <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 rounded-full transition-all duration-300 transform hover:scale-110"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button> */}

      {/* <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 rounded-full transition-all duration-300 transform hover:scale-110"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button> */}

      {/* Dot Indicators */}
      {/* <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-2 sm:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-amber-300 w-6 sm:w-8 h-3'
                : 'w-2 sm:w-3 h-2 sm:h-3 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div> */}

      {/* Slide Counter */}
      {/* <div className="absolute top-4 sm:top-8 right-4 sm:right-8 z-30 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1 sm:py-2 rounded-full text-white text-xs sm:text-sm font-semibold">
        {currentSlide + 1} / {slides.length}
      </div> */}
    </div>
  );
};

export default MysticalSlider;