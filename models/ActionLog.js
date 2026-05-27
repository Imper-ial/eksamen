// logg knyttet til en hendelse
const mongoose = require('mongoose');

const actionLogSchema = new mongoose.Schema({
  incident: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  }
}, {
  // gir createdAt automatisk
  timestamps: true
});

module.exports = mongoose.model('ActionLog', actionLogSchema);
