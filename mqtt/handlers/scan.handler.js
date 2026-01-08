const { parseDevicePayload } = require('../../utils/parser.util');
const { authenticateDevice } = require('../../services/deviceAuth.service');
const Attendance = require('../../models/Attendance');

async function handleScanMessage(topic, message) {
  const raw = message.toString();
  const parsed = parseDevicePayload(raw);

  if (!parsed) return;

  const { secretKey, data } = parsed;
  const { deviceId, id, time } = data;

  if (!deviceId || typeof id !== 'number') return;

  const device = await authenticateDevice(deviceId, secretKey);
  if (!device) return;

  await Attendance.create({
    device: device._id,
    fingerId: id,
    scannedAt: time ? new Date(time) : new Date()
  });

  console.log(`[MQTT] Attendance recorded | Device: ${deviceId} | Finger: ${id}`);
}

module.exports = {
  handleScanMessage
};
