const mongoose = require('mongoose');

const installmentSchema = new mongoose.Schema({
  beneficiaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Beneficiary', required: true },
  installmentNumber: { type: Number, required: true, enum: [1, 2, 3] },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Released'], default: 'Pending' },
  releasedAt: { type: Date },
  releasedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Officer' }
}, { timestamps: true });

module.exports = mongoose.model('Installment', installmentSchema);
