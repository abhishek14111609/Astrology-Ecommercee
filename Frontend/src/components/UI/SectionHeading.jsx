import React from 'react';

const SectionHeading = ({ title, subtitle, center = true }) => {
    return (
        <div className={`mb-10 ${center ? 'text-center' : 'text-left'}`}>
            {subtitle && (
                <span className="block text-luxury-gold uppercase tracking-[0.2em] text-xs font-semibold mb-2">
                    {subtitle}
                </span>
            )}
            <h2 className="font-serif text-3xl md:text-4xl text-luxury-purple font-bold">
                {title}
            </h2>
            <div className={`mt-3 h-1 w-20 bg-luxury-gold/30 rounded-full ${center ? 'mx-auto' : ''}`}></div>
        </div>
    );
};

export default SectionHeading;
