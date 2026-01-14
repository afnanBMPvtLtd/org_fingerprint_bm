const { updateDeviceStatus } = require('../../services/deviceAuth.service');

async function handleStatusMessage(device, data) {
  const { status } = data;
  if (!status) return;

  await updateDeviceStatus(device.deviceId, status);

  console.log(`[MQTT] Device ${device.deviceId} is ${status}`);
}

module.exports = {
  handleStatusMessage
};
