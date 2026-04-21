const express = require('express');
const router = express.Router();
const beneficiaryController = require('../controllers/beneficiaryController');
const { verifyToken, officerOnly } = require('../middleware/auth');

// All beneficiary routes are protected — user must be logged in
router.get('/user/me', verifyToken, beneficiaryController.getMyData);

// Protected Officer Routes
router.get('/beneficiaries', verifyToken, officerOnly, beneficiaryController.getAll);
router.get('/statistics', verifyToken, officerOnly, beneficiaryController.getStatistics);
router.post('/beneficiaries', verifyToken, officerOnly, beneficiaryController.create);
router.put('/beneficiaries/:id/status', verifyToken, officerOnly, beneficiaryController.updateStatus);
router.delete('/beneficiaries/:id', verifyToken, officerOnly, beneficiaryController.remove);

module.exports = router;
