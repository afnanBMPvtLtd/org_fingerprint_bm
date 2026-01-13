const PendingEnrollment = require('../../models/PendingEnrollment');
const Employee = require('../../models/Employee');
const Device = require('../../models/Device');

async function handleEnrollResult(topic, payload) {
  try {
    const { deviceId, fingerId, result } = payload;

    if (!deviceId || !result) {
      console.error('[ENROLL RESULT] Invalid payload', payload);
      return;
    }

    const pending = await PendingEnrollment.findOne({ deviceId });
    if (!pending) {
      console.log('[ENROLL] No pending enrollment for device', deviceId);
      return;
    }

    /* ================= FAILED ================= */
    if (result !== 'SUCCESS') {
      await PendingEnrollment.deleteOne({ deviceId });
      console.log('[ENROLL] Enrollment FAILED for device', deviceId);
      return;
    }

    if (!Number.isInteger(fingerId)) {
      console.error('[ENROLL] SUCCESS but fingerId missing');
      await PendingEnrollment.deleteOne({ deviceId });
      return;
    }

    const device = await Device.findOne({ deviceId });
    if (!device) {
      console.error('[ENROLL] Device not found:', deviceId);
      await PendingEnrollment.deleteOne({ deviceId });
      return;
    }

    /* ================= DUPLICATE CHECKS ================= */

    // Finger already mapped on this device
    const fingerExists = await Employee.findOne({
      device: device._id,
      fingerId
    });

    if (fingerExists) {
      console.error(
        `[ENROLL] FingerId ${fingerId} already mapped to ${fingerExists.name}`
      );
      await PendingEnrollment.deleteOne({ deviceId });
      return;
    }

    // Employee code already exists in organization
    const employeeCodeExists = await Employee.findOne({
      organization: pending.organization,
      employeeCode: pending.employeeCode
    });

    if (employeeCodeExists) {
      console.error(
        `[ENROLL] employeeCode ${pending.employeeCode} already exists`
      );
      await PendingEnrollment.deleteOne({ deviceId });
      return;
    }

    /* ================= CREATE EMPLOYEE ================= */
    const employee = await Employee.create({
      name: pending.name,
      employeeCode: pending.employeeCode,
      fingerId,
      device: device._id,
      organization: pending.organization,
      location: pending.location
    });

    await PendingEnrollment.deleteOne({ deviceId });

    console.log(
      `[ENROLL] Employee ${employee.name} enrolled with fingerId ${fingerId}`
    );
  } catch (err) {
    if (err.code === 11000) {
      console.error('[ENROLL] Duplicate key error blocked by MongoDB');
    } else {
      console.error('[ENROLL RESULT ERROR]', err.message);
    }
  }
}

module.exports = handleEnrollResult;
