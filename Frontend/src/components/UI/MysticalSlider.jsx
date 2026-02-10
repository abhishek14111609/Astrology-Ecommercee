import React, { useState, useEffect } from 'react';
import news1 from '../../assets/images/slider1.png';
import news2 from '../../assets/images/slider2.png';
import news3 from '../../assets/images/slider3.png';
import news4 from '../../assets/images/slider4.png';

const MysticalSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchDeltaX, setTouchDeltaX] = useState(0);

  const slides = [
    {
      id: 1,
      imageUrl: news1,
    },
    {
      id: 2,
      imageUrl: news2,
    },
    {
      id: 3,
      imageUrl: news3,
    },
    {
      id: 4,
      imageUrl: news4,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    const safeIndex = ((index % slides.length) + slides.length) % slides.length;
    setCurrentSlide(safeIndex);
  };

  const handleTouchStart = (event) => {
    setTouchStartX(event.touches[0].clientX);
    setTouchDeltaX(0);
  };

  const handleTouchMove = (event) => {
    if (touchStartX === null) return;
    setTouchDeltaX(event.touches[0].clientX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;

    const swipeThreshold = 40;
    if (touchDeltaX > swipeThreshold) {
      goToSlide(currentSlide - 1);
    } else if (touchDeltaX < -swipeThreshold) {
      goToSlide(currentSlide + 1);
    }

    setTouchStartX(null);
    setTouchDeltaX(0);
  };

  return (
    <div
      className="relative w-full h-[175px] xs:h-[420px] sm:h-[450px] md:h-[550px] lg:h-[650px] xl:h-[700px] overflow-hidden bg-purple-400"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full">
        {slides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            {/* Background Image */}
            <img
              src={s.imageUrl}
              alt={`Slide ${s.id}`}
              className="absolute inset-0 w-full h-full object-contain sm:object-cover object-center bg-[#2A1D3B]"
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
              </div>
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
};

export default MysticalSlider;