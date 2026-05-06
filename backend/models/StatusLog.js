const mongoose = require('mongoose');

const statusLogSchema = new mongoose.Schema({
  beneficiaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Beneficiary', required: true },
  beneficiaryName: { type: String, required: true },
  officerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Officer', required: true },
  officerName: { type: String, required: true },
  oldStatus: { type: String, required: true },
  newStatus: { type: String, required: true },
  changedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('StatusLog', statusLogSchema);
