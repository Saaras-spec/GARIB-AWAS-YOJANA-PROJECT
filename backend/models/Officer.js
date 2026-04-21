const mongoose = require('mongoose');

const officerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'officer' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Officer', officerSchema);
