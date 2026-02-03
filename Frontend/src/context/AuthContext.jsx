import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import VITE_API_BASE_URL from '../config/api';

const API_URL = VITE_API_BASE_URL;

// Configure axios defaults globally to send credentials (cookies) with all requests
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/auth/me`);
            setUser(res.data);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        // Use user-specific login endpoint to prevent admin access
        const res = await axios.post(`${API_URL}/api/auth/user-login`, { email, password });
        // Check if user is admin (should be rejected by backend, but double-check)
        if (res.data.user && res.data.user.role === 'admin') {
            throw new Error('Admin accounts cannot access the frontend. Please use the admin panel.');
        }
        setUser(res.data.user);
        return res.data;
    };

    const logout = async () => {
        try {
            await axios.post(`${API_URL}/api/auth/logout`);
            setUser(null);
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
