const express = require('express');
const router = express.Router();
const beneficiaryController = require('../controllers/beneficiaryController');
const logController = require('../controllers/logController');
const notificationController = require('../controllers/notificationController');
const messageController = require('../controllers/messageController');
const ratingController = require('../controllers/ratingController');
const installmentController = require('../controllers/installmentController');
const announcementController = require('../controllers/announcementController');
const { verifyToken, officerOnly, userOnly } = require('../middleware/verifyAuth');

// ══════════════════════════════════════════
// User Routes (beneficiary / user role)
// ══════════════════════════════════════════
router.get('/user/me', verifyToken, userOnly, beneficiaryController.getMyData);

// ══════════════════════════════════════════
// Officer Routes (officer role)
// ══════════════════════════════════════════
router.get('/beneficiaries', verifyToken, officerOnly, beneficiaryController.getAll);
router.get('/beneficiaries/:id', verifyToken, officerOnly, beneficiaryController.getOne);
router.get('/statistics', verifyToken, officerOnly, beneficiaryController.getStatistics);
router.post('/beneficiaries', verifyToken, officerOnly, beneficiaryController.create);
router.put('/beneficiaries/:id/status', verifyToken, officerOnly, beneficiaryController.updateStatus);
router.patch('/beneficiaries/:id/start-construction', verifyToken, officerOnly, beneficiaryController.startConstruction);
router.delete('/beneficiaries/:id', verifyToken, officerOnly, beneficiaryController.remove);

// ── Feature 3: Audit Logs (officer only) ──
router.get('/logs', verifyToken, officerOnly, logController.getAllLogs);
router.get('/logs/:beneficiaryId', verifyToken, officerOnly, logController.getLogsByBeneficiary);

// ── Feature 4: Notifications ──
router.get('/notifications', verifyToken, notificationController.getNotifications);
router.get('/notifications/unread-count', verifyToken, officerOnly, notificationController.getUnreadCount);
router.patch('/notifications/:id/read', verifyToken, notificationController.markAsRead);

// ── Feature 5: Messages ──
router.post('/messages/send', verifyToken, messageController.sendMessage);
router.get('/messages/:userId', verifyToken, messageController.getConversation);

// ── Feature 7: Ratings ──
router.post('/ratings', verifyToken, userOnly, ratingController.submitRating);
router.get('/ratings/average', verifyToken, officerOnly, ratingController.getAverageRating);
router.get('/ratings/my', verifyToken, userOnly, ratingController.getMyRating);

// ── Feature 8: Installments ──
router.get('/installments/:beneficiaryId', verifyToken, installmentController.getInstallments);
router.patch('/installments/:id/release', verifyToken, officerOnly, installmentController.releaseInstallment);

// ── Feature 9: Announcements ──
router.post('/announcements', verifyToken, officerOnly, announcementController.create);
router.get('/announcements', verifyToken, announcementController.getAll);
router.delete('/announcements/:id', verifyToken, officerOnly, announcementController.remove);

module.exports = router;
