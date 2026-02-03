import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'auric_krystals_secret_key_2026';

export const authenticateToken = (req, res, next) => {
    const token = req.cookies.token || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);

    if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid or Expired Token' });
        req.user = user;
        next();
    });
};

export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access Denied: Admin Rights Required' });
    }
    next();
};

export const verifyToken = authenticateToken;
