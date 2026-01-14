const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true
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

    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true
    },

    fingerId: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ['GRANTED', 'DENIED'],
      required: true
    },

    scannedAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

/* ================= INDEXES ================= */

// Query by device & time
AttendanceSchema.index({ device: 1, scannedAt: -1 });

// Query by organization & time (reports)
AttendanceSchema.index({ organization: 1, scannedAt: -1 });

// Query by employee history
AttendanceSchema.index({ employee: 1, scannedAt: -1 });

module.exports = mongoose.model('Attendance', AttendanceSchema);
