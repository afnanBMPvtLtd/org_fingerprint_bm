const express = require('express');
const router = express.Router();

const PendingEnrollment = require('../models/PendingEnrollment');
const Device = require('../models/Device');
const { getClient } = require('../config/mqtt');

/**
 * START ENROLLMENT
 * Backend controls enrollment
 * ESP auto-assigns next free fingerId
 */
router.post('/enroll/start', async (req, res) => {
  try {
    const {
      deviceId,
      name,
      employeeCode,
      organizationId,
      locationId
    } = req.body;

    // ---------------------------
    // 1. Validate device
    // ---------------------------
    const device = await Device.findOne({
      deviceId,
      isActive: true
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found or inactive' });
    }

    // ---------------------------
    // 2. Clear previous pending enrollment
    // ---------------------------
    await PendingEnrollment.deleteMany({ deviceId });

    // ---------------------------
    // 3. Create new pending enrollment
    // ---------------------------
    await PendingEnrollment.create({
      deviceId,
      name,
      employeeCode,
      organization: organizationId,
      location: locationId
    });

    // ---------------------------
    // 4. Publish ENROLL command
    // IMPORTANT: SECRET_KEY|ENROLL
    // ---------------------------
    const mqttClient = getClient();

    if (!mqttClient) {
      return res.status(500).json({ error: 'MQTT client not ready' });
    }

    const topic = `device/${deviceId}/enroll`;
    const payload = `${device.secretKey}|ENROLL`;

    console.log('[API] Publishing ENROLL to', topic);
    console.log('[API] Payload:', payload);

    mqttClient.publish(topic, payload, { qos: 1 }, (err) => {
      if (err) {
        console.error('[API] MQTT publish FAILED:', err.message);
      } else {
        console.log('[API] MQTT publish SUCCESS');
      }
    });

    // ---------------------------
    // 5. Respond immediately
    // ---------------------------
    return res.json({
      status: 'ENROLL_STARTED',
      deviceId,
      message: 'Device instructed to start fingerprint enrollment'
    });

  } catch (err) {
    console.error('[API] ENROLL START ERROR:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
