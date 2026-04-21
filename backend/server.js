require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

// Database Connection Logic
const connectDB = async () => {
    try {
        let uri = process.env.MONGODB_URI;
        
        // Use in-memory DB only if no real URI is provided (useful for local dev/testing)
        if (!uri) {
            console.log('No MONGODB_URI found, initializing in-memory database...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            uri = mongoServer.getUri();
        }

        await mongoose.connect(uri);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

// Serve Frontend
// Serve standard Vanilla JS Static Frontend
app.use(express.static(path.join(__dirname, '../frontend'), { extensions: ['html'] }));

// Redirect root to officer dashboard
app.get('/', (req, res) => {
    res.redirect('/officer/');
});

// Return 404 JSON for any unmatched /api routes (prevents HTML fallback)
app.use('/api', (req, res) => {
    res.status(404).json({ message: 'API route not found' });
});

// Catch-all for non-API routes — serve login page (Express 5 syntax)
app.get('{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'login.html'));
});

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
