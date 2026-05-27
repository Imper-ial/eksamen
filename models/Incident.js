// hendelsesmodell
const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Vannlekkasje', 'Brannfare', 'IT-feil', 'Strøm', 'Annet']
  },
  priority: {
    type: String,
    required: true,
    enum: ['Lav', 'Middels', 'Høy', 'Kritisk'],
    default: 'Middels'
  },
  status: {
    type: String,
    required: true,
    enum: ['Åpen', 'Under arbeid', 'Løst'],
    default: 'Åpen'
  },
  // ansvarlig bruker
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // bruker som registrerte hendelsen
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  // gir createdAt og updatedAt automatisk
  timestamps: true
});

module.exports = mongoose.model('Incident', incidentSchema);
