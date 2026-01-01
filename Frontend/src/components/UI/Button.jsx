import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center px-6 py-3 border text-sm font-medium rounded-sm transition-all duration-300 focus:outline-none tracking-wider uppercase';

    const variants = {
        primary: 'border-transparent text-white bg-gradient-to-r from-auric-rose to-[#6D4444] hover:from-auric-gold hover:to-auric-gold-hover hover:text-auric-rose shadow-md transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300',
        secondary: 'border-transparent text-white bg-auric-gold hover:bg-auric-gold-hover hover:text-auric-rose shadow-sm',
        outline: 'border-auric-rose text-auric-rose bg-transparent hover:bg-auric-rose hover:text-white',
        ghost: 'border-transparent text-auric-rose hover:bg-auric-rose/5'
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
