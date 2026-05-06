const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Officer', required: true },
  officerName: { type: String, required: true },
  postedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
