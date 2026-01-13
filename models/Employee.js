const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
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
    name: {
      type: String,
      required: true,
      trim: true
    },
    employeeCode: {
      type: String,
      required: true,
      trim: true
    },
    fingerId: {
      type: Number,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

/* ================= INDEXES ================= */

// 1️⃣ Same finger cannot exist twice on same device
employeeSchema.index(
  { device: 1, fingerId: 1 },
  { unique: true }
);

// 2️⃣ Same employeeCode cannot repeat inside same organization
employeeSchema.index(
  { organization: 1, employeeCode: 1 },
  { unique: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
