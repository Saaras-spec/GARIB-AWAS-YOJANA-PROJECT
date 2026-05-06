const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'garib_awas_yojana_secret_key_2026';

// Middleware: Verify JWT Token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Expect format: "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied. Invalid token format.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token. Please login again.' });
    }
};

// Middleware: Restrict to Officers only
const officerOnly = (req, res, next) => {
    if (req.user && req.user.role === 'officer') {
        next();
    } else {
        return res.status(403).json({ error: 'Access denied. Officers only.' });
    }
};

// Middleware: Restrict to Users only
const userOnly = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        next();
    } else {
        return res.status(403).json({ error: 'Access denied. Users only.' });
    }
};

module.exports = { verifyToken, officerOnly, userOnly };
