const Notification = require('../models/Notification');

// GET /api/notifications — User gets own notifications, officer gets all
exports.getNotifications = async (req, res) => {
    try {
        let filter = {};
        if (req.user.role === 'user') {
            filter.userId = req.user.id;
        }
        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .limit(100);
        res.json(notifications);
    } catch (error) {
        console.error('getNotifications error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/notifications/unread-count — Officer gets total unread count
exports.getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({ isRead: false });
        res.json({ count });
    } catch (error) {
        console.error('getUnreadCount error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// PATCH /api/notifications/:id/read — Mark notification as read
exports.markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }
        res.json(notification);
    } catch (error) {
        console.error('markAsRead error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
