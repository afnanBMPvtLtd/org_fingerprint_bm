const { parseDevicePayload } = require('../utils/parser.util');
const { authenticateDevice } = require('./deviceAuth.service');

/**
 * Parse + authenticate MQTT message
 * Returns { device, data } or null
 */
async function authenticateMqttMessage(rawMessage) {
  const parsed = parseDevicePayload(rawMessage);
  if (!parsed) return null;

  const { secretKey, data } = parsed;
  if (!data.deviceId) return null;

  const device = await authenticateDevice(data.deviceId, secretKey);
  if (!device) return null;

  return { device, data };
}

module.exports = {
  authenticateMqttMessage
};
