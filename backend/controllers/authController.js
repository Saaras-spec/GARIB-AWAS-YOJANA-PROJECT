const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Officer = require('../models/Officer');
const Beneficiary = require('../models/Beneficiary');

const JWT_SECRET = process.env.JWT_SECRET || 'garib_awas_yojana_secret_key_2026';

// POST /api/auth/signup — Officer Registration
exports.signup = async (req, res) => {
    try {
        const { name, phone, email, district, state, password } = req.body;

        // Check if officer already exists
        const existingOfficer = await Officer.findOne({ email: email.toLowerCase() });
        if (existingOfficer) {
            return res.status(400).json({ error: 'An officer with this email already exists.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new officer
        const officer = new Officer({
            name,
            phone,
            email: email.toLowerCase(),
            district,
            state,
            password: hashedPassword,
            role: 'officer'
        });

        await officer.save();

        res.status(201).json({ message: 'Officer registered successfully. Please sign in.' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Server error during registration.' });
    }
};

// POST /api/auth/login — Common Login (Officer + User)
exports.login = async (req, res) => {
    try {
        const { email, password, loginType, name } = req.body;

        // ─── USER LOGIN (Beneficiary-based) ───
        if (loginType === 'user') {
            const beneficiaryName = name ? name.toLowerCase() : '';
            // Step 1: Find beneficiary by name (case-insensitive)
            const beneficiary = await Beneficiary.findOne({ name: beneficiaryName });
            if (!beneficiary) {
                return res.status(404).json({ error: 'You are not registered.' });
            }

            // Step 2: Check password === name
            if (password !== name) {
                return res.status(401).json({ error: 'Invalid credentials.' });
            }

            // Step 3: Generate JWT and return
            const token = jwt.sign(
                { id: beneficiary._id, name: beneficiary.name, role: 'user' },
                JWT_SECRET,
                { expiresIn: '24h' }
            );
            return res.json({
                token,
                user: { id: beneficiary._id, name: beneficiary.name, role: 'user' }
            });
        }

        // ─── OFFICER LOGIN ───
        const officer = await Officer.findOne({ email: email.toLowerCase() });
        if (!officer) {
            return res.status(404).json({ error: 'Officer not found. Please sign up first.' });
        }

        const isMatch = await bcrypt.compare(password, officer.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password.' });
        }

        const token = jwt.sign(
            { id: officer._id, email: officer.email, role: 'officer' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: officer._id,
                name: officer.name,
                email: officer.email,
                role: 'officer',
                district: officer.district,
                state: officer.state
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error during login.' });
    }
};
