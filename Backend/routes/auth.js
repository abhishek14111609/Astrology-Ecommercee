import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connect } from '../db.js';
import User from '../models/User.js';
import { getNextSequence } from '../models/Counter.js';
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'auric_krystals_secret_key_2026';

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, date_of_birth, password, zodiac_sign } = req.body;

        await connect();

        const existing = await User.findOne({ email }).lean();
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const id = await getNextSequence('users');
        const user = await User.create({ 
            id, 
            name, 
            email, 
            phone, 
            date_of_birth, 
            password: hashedPassword, 
            zodiac_sign 
        });
        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

// Login - Generic handler for token generation
const generateTokenAndRespond = async (user, res) => {
    // Generate Token
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '24h' }
    );

    // Set Cookie
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    });

    res.json({
        message: 'Login successful',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            zodiac_sign: user.zodiac_sign
        }
    });
};

// Login - Main endpoint (used internally or by specific clients)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        await connect();
        const user = await User.findOne({ email }).lean();
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        await generateTokenAndRespond(user, res);
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

// User Login - Only for regular users (rejects admins)
router.post('/user-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        await connect();
        const user = await User.findOne({ email }).lean();
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Reject admin users
        if (user.role === 'admin') {
            return res.status(403).json({ 
                message: 'Admin accounts cannot access the frontend. Please use the admin panel.' 
            });
        }

        await generateTokenAndRespond(user, res);
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

// Admin Login - Only for admin users (rejects regular users)
router.post('/admin-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        await connect();
        const user = await User.findOne({ email }).lean();
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Only allow admin users
        if (user.role !== 'admin') {
            return res.status(403).json({ 
                message: 'This login is for admin access only. Please use the customer login.' 
            });
        }

        await generateTokenAndRespond(user, res);
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
});

// Get Current User (Session Check)
router.get('/me', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: 'Not authenticated' });

        const decoded = jwt.verify(token, JWT_SECRET);
        await connect();
        const user = await User.findOne({ id: decoded.id }).select('-password').lean();

        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            zodiac_sign: user.zodiac_sign
        });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

export default router;
