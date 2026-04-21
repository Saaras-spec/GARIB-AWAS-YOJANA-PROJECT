const Beneficiary = require('../models/Beneficiary');

// GET /api/beneficiaries — Fetch all beneficiaries
exports.getAll = async (req, res) => {
    try {
        const beneficiaries = await Beneficiary.find();
        res.json(beneficiaries);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/beneficiaries/me — Fetch logged-in user's data
exports.getMyData = async (req, res) => {
    try {
        // Find beneficiary by lowercase name from JWT
        const beneficiary = await Beneficiary.findOne({ 
            name: req.user.name.toLowerCase() 
        }).populate('officerId', 'name');
        
        if (!beneficiary) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(beneficiary);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/statistics — Dashboard statistics
exports.getStatistics = async (req, res) => {
    try {
        const total = await Beneficiary.countDocuments();
        const pending = await Beneficiary.countDocuments({ status: 'Pending' });
        const underConstruction = await Beneficiary.countDocuments({ status: 'Under Construction' });
        const completed = await Beneficiary.countDocuments({ status: 'Completed' });

        res.json({ total, pending, underConstruction, completed });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// POST /api/beneficiaries — Register new beneficiary
exports.create = async (req, res) => {
    try {
        const { name, age, familyMembers, income, address, latitude, longitude } = req.body;
        
        // Save name in lowercase for case-insensitive matching
        const beneficiaryName = name ? name.toLowerCase() : '';

        const newBeneficiary = new Beneficiary({
            name: beneficiaryName,
            age,
            familyMembers,
            income,
            address,
            location: {
                type: 'Point',
                coordinates: [longitude, latitude] // GeoJSON expects [lng, lat]
            },
            officerId: req.user.id // ID of the officer who created this record
        });

        await newBeneficiary.save();
        res.status(201).json(newBeneficiary);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to add beneficiary' });
    }
};

// PUT /api/beneficiaries/:id/status — Update status
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const beneficiary = await Beneficiary.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!beneficiary) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json(beneficiary);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update' });
    }
};

// DELETE /api/beneficiaries/:id — Remove beneficiary
exports.remove = async (req, res) => {
    try {
        const beneficiary = await Beneficiary.findByIdAndDelete(req.params.id);
        if (!beneficiary) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete' });
    }
};
