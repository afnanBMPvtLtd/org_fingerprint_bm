const mongoose = require('mongoose');

const pendingEnrollmentSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true
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
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: 300   // ⏱️ AUTO DELETE AFTER 5 MINUTES
    }
  }
);

module.exports = mongoose.model(
  'PendingEnrollment',
  pendingEnrollmentSchema
);
