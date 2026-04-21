const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  familyMembers: { type: Number, required: true },
  income: { type: Number, required: true },
  address: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Under Construction', 'Completed'],
    default: 'Pending'
  },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true } // [longitude, latitude]
  },
  officerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Officer'
  },
  createdAt: { type: Date, default: Date.now }
});

// Index for 2dsphere mapping
beneficiarySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Beneficiary', beneficiarySchema);
