const Device = require('../../models/Device');
const Employee = require('../../models/Employee');
const Attendance = require('../../models/Attendance');

async function handleScanMessage(topic, payload) {
  try {
    const [, json] = payload.split('|');
    if (!json) return;

    const data = JSON.parse(json);
    const { deviceId, action, fingerId, time } = data;

    if (!deviceId || !action) return;

    /* ================= NOT GRANTED ================= */
    if (action === 'not_granted') {
      console.log(`[SCAN] NOT_GRANTED from device ${deviceId}`);
      return;
    }

    /* ================= GRANTED ================= */
    if (!Number.isInteger(fingerId)) {
      console.error('[SCAN] GRANTED but fingerId missing');
      return;
    }

    const device = await Device.findOne({ deviceId });
    if (!device) {
      console.error('[SCAN] Device not found:', deviceId);
      return;
    }

    const employee = await Employee.findOne({
      device: device._id,
      fingerId,
      isActive: true
    });

    if (!employee) {
      console.error(
        `[SCAN] Unknown fingerId ${fingerId} on device ${deviceId}`
      );
      return;
    }

    await Attendance.create({
      employee: employee._id,
      device: device._id,
      fingerId,
      scannedAt: time ? new Date(time) : new Date()
    });

    console.log(
      `[SCAN] Attendance recorded: ${employee.name} (${fingerId})`
    );
  } catch (err) {
    console.error('[SCAN HANDLER ERROR]', err.message);
  }
}

module.exports = { handleScanMessage };
