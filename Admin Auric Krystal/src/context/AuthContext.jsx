import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ensure credentials are sent with every request
    axios.defaults.withCredentials = true;

    const checkAuth = async () => {
        try {
            setLoading(true);
            const res = await axios.get('http://localhost:5000/api/auth/me');
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data)); // Keep local copy for non-critical UI if needed, but rely on cookie
        } catch (error) {
            setUser(null);
            localStorage.removeItem('user');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
        setUser(res.data.user);
        return res.data;
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/logout');
            setUser(null);
            localStorage.removeItem('user');
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
