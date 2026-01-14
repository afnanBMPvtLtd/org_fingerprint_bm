const PendingEnrollment = require('../../models/PendingEnrollment');
const Employee = require('../../models/Employee');

async function handleEnrollResult(device, data) {
  try {
    const { fingerId, result } = data;

    const pending = await PendingEnrollment.findOne({
      deviceId: device.deviceId
    });

    if (!pending) {
      console.log('[ENROLL] No pending enrollment for device', device.deviceId);
      return;
    }

    /* ================= FAILED ================= */
    if (result !== 'SUCCESS') {
      await PendingEnrollment.deleteOne({ deviceId: device.deviceId });
      console.log('[ENROLL] Enrollment FAILED for device', device.deviceId);
      return;
    }

    if (!Number.isInteger(fingerId)) {
      await PendingEnrollment.deleteOne({ deviceId: device.deviceId });
      console.error('[ENROLL] SUCCESS but fingerId missing');
      return;
    }

    /* ================= CREATE EMPLOYEE (SAFE) ================= */
    try {
      await Employee.create({
        name: pending.name,
        employeeCode: pending.employeeCode,
        fingerId,
        device: device._id,
        organization: pending.organization,
        location: pending.location
      });

      console.log(
        `[ENROLL] Employee ${pending.name} enrolled (fingerId ${fingerId})`
      );
    } catch (err) {
      // Duplicate safety via indexes
      console.error('[ENROLL] Employee create blocked:', err.message);
    }

    await PendingEnrollment.deleteOne({ deviceId: device.deviceId });

  } catch (err) {
    console.error('[ENROLL RESULT ERROR]', err.message);
  }
}

module.exports = handleEnrollResult;
