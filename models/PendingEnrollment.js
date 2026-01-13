const mongoose = require('mongoose');

const pendingEnrollmentSchema = new mongoose.Schema({
  deviceId: {
    type: String,
    required: true,
    index: true
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  employeeCode: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model(
  'PendingEnrollment',
  pendingEnrollmentSchema
);
