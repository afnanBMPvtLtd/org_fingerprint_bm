const Device = require('../models/Device');

const STALE_AFTER_MS = 90 * 1000; // 90 seconds

async function markStaleDevicesOffline() {
  const cutoff = new Date(Date.now() - STALE_AFTER_MS);

  const result = await Device.updateMany(
    {
      status: 'ONLINE',
      lastSeen: { $lt: cutoff }
    },
    {
      status: 'OFFLINE'
    }
  );

  if (result.modifiedCount > 0) {
    console.log(`[DEVICE MONITOR] Marked ${result.modifiedCount} device(s) OFFLINE`);
  }
}

module.exports = {
  markStaleDevicesOffline
};
