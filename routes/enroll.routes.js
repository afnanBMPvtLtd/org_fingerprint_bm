const express = require('express');
const router = express.Router();

const PendingEnrollment = require('../models/PendingEnrollment');
const Device = require('../models/Device');
const { getClient } = require('../config/mqtt');

router.post('/enroll/start', async (req, res) => {
  try {
    const {
      deviceId,
      name,
      employeeCode,
      organizationId,
      locationId
    } = req.body;

    const device = await Device.findOne({
      deviceId,
      isActive: true
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found or inactive' });
    }

    // 🔒 CHECK EXISTING ENROLLMENT
    const existing = await PendingEnrollment.findOne({ deviceId });
    if (existing) {
      return res.status(409).json({
        error: 'Enrollment already in progress for this device'
      });
    }

    await PendingEnrollment.create({
      deviceId,
      name,
      employeeCode,
      organization: organizationId,
      location: locationId
    });

    const mqttClient = getClient();
    if (!mqttClient) {
      return res.status(500).json({ error: 'MQTT client not ready' });
    }

    const topic = `device/${deviceId}/enroll`;
    const payload = `${device.secretKey}|ENROLL`;

    mqttClient.publish(topic, payload, { qos: 1 });

    return res.json({
      status: 'ENROLL_STARTED',
      deviceId
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: 'Enrollment already in progress'
      });
    }

    console.error('[ENROLL START ERROR]', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/enroll/cancel', async (req, res) => {
  const { deviceId } = req.body;

  if (!deviceId) {
    return res.status(400).json({ error: 'deviceId required' });
  }

  const deleted = await PendingEnrollment.deleteOne({ deviceId });

  return res.json({
    status: 'ENROLL_CANCELLED',
    deleted: deleted.deletedCount
  });
});

module.exports = router;
