const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema(
  {
    device: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Device',
      required: true
    },

    fingerId: {
      type: Number,
      required: true
    },

    scannedAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance', AttendanceSchema);
