/**
 * Validation utilities for user registration and authentication
 */

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    // At least 6 characters
    return password && password.length >= 6;
};

export const validateName = (name) => {
    // At least 2 characters, no numbers
    return name && name.trim().length >= 2 && !/\d/.test(name);
};

export const validatePhone = (phone) => {
    // Optional, but if provided should be valid
    if (!phone) return true;
    return /^\d{10,}$/.test(phone.replace(/\D/g, ''));
};

export const validateRegistrationInput = (data) => {
    const errors = [];

    if (!data.name || !validateName(data.name)) {
        errors.push('Name must be at least 2 characters and contain no numbers');
    }

    if (!data.email || !validateEmail(data.email)) {
        errors.push('Please provide a valid email address');
    }

    if (!data.password || !validatePassword(data.password)) {
        errors.push('Password must be at least 6 characters');
    }

    if (data.phone && !validatePhone(data.phone)) {
        errors.push('Please provide a valid phone number');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};
