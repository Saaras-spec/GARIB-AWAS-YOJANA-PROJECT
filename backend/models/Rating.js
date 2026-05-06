const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  beneficiaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Beneficiary', required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Beneficiary', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Rating', ratingSchema);
