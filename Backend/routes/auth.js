import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connect } from '../db.js';
import User from '../models/User.js';
import { getNextSequence } from '../models/Counter.js';
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'auric_krystal_secret_key_2026';

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, zodiac_sign } = req.body;

        await connect();

        const existing = await User.findOne({ email }).lean();
        if (existing) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const id = await getNextSequence('users');
        const user = await User.create({ id, name, email, password: hashedPassword, zodiac_sign });
        res.status(201).json({ message: 'User registered successfully', userId: user.id });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

// Login
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

        // Generate Token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                zodiac_sign: user.zodiac_sign
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Login failed', error: error.message });
    }
});

export default router;
