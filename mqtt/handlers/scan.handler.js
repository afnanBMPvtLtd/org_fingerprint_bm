const Employee = require('../../models/Employee');
const Attendance = require('../../models/Attendance');

async function handleScanMessage(device, data) {
  try {
    const { action, fingerId, time } = data;

    if (!action) return;

    /* ================= NOT GRANTED ================= */
    if (action === 'not_granted') {
      console.log(`[SCAN] NOT_GRANTED from ${device.deviceId}`);
      return;
    }

    /* ================= GRANTED ================= */
    if (!Number.isInteger(fingerId)) {
      console.error('[SCAN] GRANTED but fingerId missing');
      return;
    }

    const employee = await Employee.findOne({
      device: device._id,
      fingerId,
      isActive: true
    });

    if (!employee) {
      console.error(
        `[SCAN] Unknown fingerId ${fingerId} on device ${device.deviceId}`
      );
      return;
    }

    await Attendance.create({
      employee: employee._id,
      device: device._id,
      organization: device.organization,
      location: device.location,
      fingerId,
      status: 'GRANTED',
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
