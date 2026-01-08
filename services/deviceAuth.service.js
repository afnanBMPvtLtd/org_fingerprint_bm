const Device = require('../models/Device');

/**
 * Authenticate a device using DEVICE_ID + SECRET_KEY
 * Returns full device with organization & location if valid
 */
async function authenticateDevice(deviceId, secretKey) {
  if (!deviceId || !secretKey) {
    return null;
  }

  const device = await Device.findOne({
    deviceId: deviceId,
    secretKey: secretKey,
    isActive: true
  })
    .populate('organization')
    .populate('location');

  if (!device) return null;

  if (!device.organization || !device.organization.isActive) {
    return null;
  }

  if (!device.location || !device.location.isActive) {
    return null;
  }

  return device;
}

/**
 * Update device ONLINE / OFFLINE status
 */
async function updateDeviceStatus(deviceId, status) {
  return Device.findOneAndUpdate(
    { deviceId },
    {
      status: status,
      lastSeen: new Date()
    },
    { new: true }
  );
}

module.exports = {
  authenticateDevice,
  updateDeviceStatus
};
