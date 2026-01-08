const { parseDevicePayload } = require('../../utils/parser.util');
const { authenticateDevice, updateDeviceStatus } = require('../../services/deviceAuth.service');

async function handleStatusMessage(topic, message) {
  const raw = message.toString();
  const parsed = parseDevicePayload(raw);

  if (!parsed) return;

  const { secretKey, data } = parsed;
  const { deviceId, status } = data;

  if (!deviceId || !status) return;

  const device = await authenticateDevice(deviceId, secretKey);
  if (!device) return;

  await updateDeviceStatus(deviceId, status);

  console.log(`[MQTT] Device ${deviceId} is ${status}`);
}

module.exports = {
  handleStatusMessage
};
