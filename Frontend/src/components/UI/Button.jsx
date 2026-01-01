import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center px-6 py-3 border text-sm font-medium rounded-sm transition-all duration-300 focus:outline-none tracking-wider uppercase';

    const variants = {
        primary: 'border-transparent text-luxury-purple bg-luxury-gold hover:bg-white hover:text-luxury-purple hover:border-luxury-purple shadow-sm',
        secondary: 'border-transparent text-white bg-luxury-purple hover:bg-luxury-gold hover:text-luxury-purple shadow-sm',
        outline: 'border-luxury-purple text-luxury-purple bg-transparent hover:bg-luxury-purple hover:text-white',
        ghost: 'border-transparent text-luxury-purple hover:bg-luxury-purple/5'
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
