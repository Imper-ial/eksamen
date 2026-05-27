// brukermodell
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  // hash av passord
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'it', 'drift']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
