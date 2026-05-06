const StatusLog = require('../models/StatusLog');

// GET /api/logs — Returns all status change logs (officer only)
exports.getAllLogs = async (req, res) => {
    try {
        const logs = await StatusLog.find()
            .sort({ changedAt: -1 })
            .limit(200);
        res.json(logs);
    } catch (error) {
        console.error('getAllLogs error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/logs/:beneficiaryId — Returns logs for one beneficiary
exports.getLogsByBeneficiary = async (req, res) => {
    try {
        const logs = await StatusLog.find({ beneficiaryId: req.params.beneficiaryId })
            .sort({ changedAt: -1 });
        res.json(logs);
    } catch (error) {
        console.error('getLogsByBeneficiary error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
