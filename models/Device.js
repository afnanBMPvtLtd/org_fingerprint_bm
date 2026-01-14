const mongoose = require('mongoose');

const DeviceSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      unique: true
    },

    secretKey: {
      type: String,
      required: true
    },

    // 🔓 Allow null for unregistered devices
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      default: null
    },

    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      default: null
    },

    status: {
      type: String,
      enum: ['ONLINE', 'OFFLINE'],
      default: 'OFFLINE'
    },

    lastSeen: {
      type: Date
    },

    // 🔐 Controls if device is usable
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Device', DeviceSchema);
