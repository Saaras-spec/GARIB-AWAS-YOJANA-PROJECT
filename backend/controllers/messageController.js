const Message = require('../models/Message');

// POST /api/messages/send — Send a message
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, message } = req.body;
        if (!receiverId || !message) {
            return res.status(400).json({ error: 'Receiver ID and message are required' });
        }

        const newMessage = await Message.create({
            senderId: req.user.id,
            receiverId,
            senderRole: req.user.role,
            message
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('sendMessage error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

// GET /api/messages/:userId — Get all messages between current user and target user
exports.getConversation = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const messages = await Message.find({
            $or: [
                { senderId: currentUserId, receiverId: userId },
                { senderId: userId, receiverId: currentUserId }
            ]
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        console.error('getConversation error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
