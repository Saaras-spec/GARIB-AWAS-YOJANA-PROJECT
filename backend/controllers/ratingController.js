const Rating = require('../models/Rating');
const Beneficiary = require('../models/Beneficiary');

// POST /api/ratings — User submits a rating
exports.submitRating = async (req, res) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        // Find the beneficiary record for this user
        const beneficiary = await Beneficiary.findOne({ name: req.user.name.toLowerCase() });
        if (!beneficiary) {
            return res.status(404).json({ error: 'Beneficiary not found' });
        }

        // Check if already rated
        const existingRating = await Rating.findOne({ beneficiaryId: beneficiary._id });
        if (existingRating) {
            return res.status(400).json({ error: 'You have already submitted a rating' });
        }

        const newRating = await Rating.create({
            beneficiaryId: beneficiary._id,
            userId: beneficiary._id,
            rating,
            comment: comment || ''
        });

        res.status(201).json(newRating);
    } catch (error) {
        console.error('submitRating error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/ratings/average — Returns average rating (officer only)
exports.getAverageRating = async (req, res) => {
    try {
        const result = await Rating.aggregate([
            { $group: { _id: null, average: { $avg: '$rating' }, totalRatings: { $sum: 1 } } }
        ]);

        if (result.length === 0) {
            return res.json({ average: 0, totalRatings: 0 });
        }

        res.json({
            average: Math.round(result[0].average * 10) / 10,
            totalRatings: result[0].totalRatings
        });
    } catch (error) {
        console.error('getAverageRating error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/ratings/my — Returns user's own rating
exports.getMyRating = async (req, res) => {
    try {
        const beneficiary = await Beneficiary.findOne({ name: req.user.name.toLowerCase() });
        if (!beneficiary) {
            return res.status(404).json({ error: 'Beneficiary not found' });
        }

        const rating = await Rating.findOne({ beneficiaryId: beneficiary._id });
        if (!rating) {
            return res.json(null);
        }

        res.json(rating);
    } catch (error) {
        console.error('getMyRating error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
