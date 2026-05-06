const Announcement = require('../models/Announcement');
const Officer = require('../models/Officer');

// POST /api/announcements — Officer posts announcement
exports.create = async (req, res) => {
    try {
        const { title, message } = req.body;
        if (!title || !message) {
            return res.status(400).json({ error: 'Title and message are required' });
        }

        const officer = await Officer.findById(req.user.id);
        const officerName = officer ? officer.name : 'Unknown Officer';

        const announcement = await Announcement.create({
            title,
            message,
            postedBy: req.user.id,
            officerName
        });

        res.status(201).json(announcement);
    } catch (error) {
        console.error('create announcement error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/announcements — Get all announcements
exports.getAll = async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .sort({ postedAt: -1 })
            .limit(50);
        res.json(announcements);
    } catch (error) {
        console.error('getAll announcements error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// DELETE /api/announcements/:id — Delete own announcement
exports.remove = async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);
        if (!announcement) {
            return res.status(404).json({ error: 'Announcement not found' });
        }

        if (announcement.postedBy.toString() !== req.user.id) {
            return res.status(403).json({ error: 'You can only delete your own announcements' });
        }

        await Announcement.findByIdAndDelete(req.params.id);
        res.json({ message: 'Announcement deleted successfully' });
    } catch (error) {
        console.error('delete announcement error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
