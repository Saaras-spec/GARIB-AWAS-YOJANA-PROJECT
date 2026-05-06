const Installment = require('../models/Installment');

// GET /api/installments/:beneficiaryId — Get installments for a beneficiary
exports.getInstallments = async (req, res) => {
    try {
        const installments = await Installment.find({ beneficiaryId: req.params.beneficiaryId })
            .sort({ installmentNumber: 1 });
        res.json(installments);
    } catch (error) {
        console.error('getInstallments error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// PATCH /api/installments/:id/release — Release an installment
exports.releaseInstallment = async (req, res) => {
    try {
        const installment = await Installment.findById(req.params.id);
        if (!installment) {
            return res.status(404).json({ error: 'Installment not found' });
        }

        if (installment.status === 'Released') {
            return res.status(400).json({ error: 'Installment already released' });
        }

        installment.status = 'Released';
        installment.releasedAt = new Date();
        installment.releasedBy = req.user.id;
        await installment.save();

        res.json(installment);
    } catch (error) {
        console.error('releaseInstallment error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
