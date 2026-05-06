const Beneficiary = require('../models/Beneficiary');
const Officer = require('../models/Officer');
const StatusLog = require('../models/StatusLog');
const Notification = require('../models/Notification');
const Installment = require('../models/Installment');

// GET /api/beneficiaries — Fetch beneficiaries with filtering + pagination (Feature 2)
exports.getAll = async (req, res) => {
    try {
        const { status, district, page = 1, limit = 10 } = req.query;
        const filter = { officerId: req.user.id };

        // Status filter
        if (status) {
            filter.status = status;
        }

        // District filter — filter by officer's district via populate match
        // Since district is on Officer model, we filter after populate or use a different approach
        let districtFilter = null;
        if (district) {
            districtFilter = district;
        }

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.max(1, Math.min(100, parseInt(limit)));
        const skip = (pageNum - 1) * limitNum;

        let query = Beneficiary.find(filter)
            .populate('officerId', 'name district');

        // Get total count for pagination
        const totalCount = await Beneficiary.countDocuments(filter);

        let beneficiaries = await query.sort({ createdAt: -1 }).skip(skip).limit(limitNum);

        // Apply district filter post-populate if needed
        if (districtFilter) {
            beneficiaries = beneficiaries.filter(b =>
                b.officerId && b.officerId.district &&
                b.officerId.district.toLowerCase().includes(districtFilter.toLowerCase())
            );
        }

        const totalPages = Math.ceil(totalCount / limitNum);

        res.json({
            beneficiaries,
            totalPages,
            currentPage: pageNum,
            totalCount
        });
    } catch (error) {
        console.error('getAll error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/beneficiaries/:id — Get single beneficiary
exports.getOne = async (req, res) => {
    try {
        const beneficiary = await Beneficiary.findById(req.params.id)
            .populate('officerId', 'name district');
        if (!beneficiary) {
            return res.status(404).json({ error: 'Beneficiary not found' });
        }
        res.json(beneficiary);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/user/me — Fetch logged-in user's data
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

// GET /api/statistics — Dashboard statistics (scoped to logged-in officer)
exports.getStatistics = async (req, res) => {
    try {
        const filter = { officerId: req.user.id };
        const total = await Beneficiary.countDocuments(filter);
        const pending = await Beneficiary.countDocuments({ ...filter, status: 'Pending' });
        const underConstruction = await Beneficiary.countDocuments({ ...filter, status: 'Under Construction' });
        const completed = await Beneficiary.countDocuments({ ...filter, status: 'Completed' });

        res.json({ total, pending, underConstruction, completed });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// POST /api/beneficiaries — Register new beneficiary with eligibility check (Feature 1) + installments (Feature 8)
exports.create = async (req, res) => {
    try {
        const { name, age, familyMembers, income, address, latitude, longitude, installments } = req.body;

        // ── Feature 1: Eligibility Validation ──
        if (income >= 300000) {
            return res.status(400).json({ error: 'Not eligible: Annual income exceeds ₹3,00,000 limit' });
        }
        if (age < 18 || age > 70) {
            return res.status(400).json({ error: 'Not eligible: Age must be between 18 and 70 years' });
        }
        if (!familyMembers || familyMembers < 1) {
            return res.status(400).json({ error: 'Not eligible: Family members count must be at least 1' });
        }

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

        // ── Feature 8: Create installments if provided ──
        if (installments && Array.isArray(installments) && installments.length > 0) {
            const installmentDocs = installments.map((inst, index) => ({
                beneficiaryId: newBeneficiary._id,
                installmentNumber: index + 1,
                amount: inst.amount,
                status: 'Pending'
            }));
            await Installment.insertMany(installmentDocs);
        }

        res.status(201).json(newBeneficiary);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Failed to add beneficiary' });
    }
};

// PUT /api/beneficiaries/:id/status — Update status with audit log + notification (Feature 3 & 4)
exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Get the beneficiary's old status before updating
        const beneficiary = await Beneficiary.findById(req.params.id);
        if (!beneficiary) {
            return res.status(404).json({ error: 'Not found' });
        }
        const oldStatus = beneficiary.status;

        // Get officer info for the log
        const officer = await Officer.findById(req.user.id);
        const officerName = officer ? officer.name : 'Unknown Officer';

        // Update the status
        beneficiary.status = status;
        await beneficiary.save();

        // ── Feature 3: Create audit log entry ──
        await StatusLog.create({
            beneficiaryId: beneficiary._id,
            beneficiaryName: beneficiary.name,
            officerId: req.user.id,
            officerName: officerName,
            oldStatus: oldStatus,
            newStatus: status
        });

        // ── Feature 4: Create notification for the user ──
        let notifMessage = `Your application status has been updated to ${status}`;
        if (status === 'Completed') {
            notifMessage = 'Your application has been Completed. Congratulations!';
        }
        await Notification.create({
            userId: beneficiary._id,
            message: notifMessage
        });

        res.json(beneficiary);
    } catch (error) {
        console.error('updateStatus error:', error);
        res.status(400).json({ error: 'Failed to update' });
    }
};

// PATCH /api/beneficiaries/:id/start-construction — Start construction with expected date (Feature 6)
exports.startConstruction = async (req, res) => {
    try {
        const { expectedCompletionDate } = req.body;
        if (!expectedCompletionDate) {
            return res.status(400).json({ error: 'Expected completion date is required' });
        }

        const beneficiary = await Beneficiary.findById(req.params.id);
        if (!beneficiary) {
            return res.status(404).json({ error: 'Not found' });
        }

        const oldStatus = beneficiary.status;
        beneficiary.status = 'Under Construction';
        beneficiary.expectedCompletionDate = new Date(expectedCompletionDate);
        await beneficiary.save();

        // Get officer info
        const officer = await Officer.findById(req.user.id);
        const officerName = officer ? officer.name : 'Unknown Officer';

        // Audit log
        await StatusLog.create({
            beneficiaryId: beneficiary._id,
            beneficiaryName: beneficiary.name,
            officerId: req.user.id,
            officerName: officerName,
            oldStatus: oldStatus,
            newStatus: 'Under Construction'
        });

        // Notification
        await Notification.create({
            userId: beneficiary._id,
            message: 'Your application status has been updated to Under Construction'
        });

        res.json(beneficiary);
    } catch (error) {
        console.error('startConstruction error:', error);
        res.status(400).json({ error: 'Failed to start construction' });
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
