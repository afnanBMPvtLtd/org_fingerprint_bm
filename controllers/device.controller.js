const Device = require('../models/Device');
const { publishToDevice } = require('../services/mqttPublish.service');

/* ================= ENROLL ================= */
async function enrollFinger(req, res) {
  try {
    const { deviceId } = req.body;
    if (!deviceId) {
      return res.status(400).json({ error: 'deviceId required' });
    }

    const device = await Device.findOne({ deviceId, isActive: true });
    if (!device) {
      return res.status(404).json({ error: 'Device not found or inactive' });
    }

    if (device.status !== 'ONLINE') {
      return res.status(400).json({ error: 'Device is offline' });
    }

    const topic = `device/${deviceId}/enroll`;
    const payload = `${device.secretKey}|ENROLL`;

    await publishToDevice(topic, payload);

    res.json({ status: 'ENROLL_SENT' });
  } catch (err) {
    console.error('[ENROLL ERROR]', err.message);
    res.status(500).json({ error: 'Enroll failed' });
  }
}

/* ================= DELETE ONE ================= */
async function deleteFinger(req, res) {
  try {
    const { deviceId, fingerId } = req.body;

    if (!deviceId || fingerId === undefined) {
      return res.status(400).json({ error: 'deviceId and fingerId required' });
    }

    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const topic = `device/${deviceId}/delete`;
    const payload = `${device.secretKey}|${fingerId}`;

    await publishToDevice(topic, payload);

    res.json({ status: 'DELETE_SENT', fingerId });
  } catch (err) {
    console.error('[DELETE ERROR]', err.message);
    res.status(500).json({ error: 'Delete failed' });
  }
}

/* ================= DELETE ALL ================= */
async function deleteAll(req, res) {
  try {
    const { deviceId } = req.body;
    if (!deviceId) {
      return res.status(400).json({ error: 'deviceId required' });
    }

    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const topic = `device/${deviceId}/deleteAll`;
    const payload = `${device.secretKey}|ALL`;

    await publishToDevice(topic, payload);

    res.json({ status: 'DELETE_ALL_SENT' });
  } catch (err) {
    console.error('[DELETE ALL ERROR]', err.message);
    res.status(500).json({ error: 'Delete all failed' });
  }
}

/* ================= RESET ================= */
async function resetDevice(req, res) {
  try {
    const { deviceId } = req.body;
    if (!deviceId) {
      return res.status(400).json({ error: 'deviceId required' });
    }

    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const topic = `device/${deviceId}/reset`;
    const payload = `${device.secretKey}|RESET`;

    await publishToDevice(topic, payload);

    res.json({ status: 'RESET_SENT' });
  } catch (err) {
    console.error('[RESET ERROR]', err.message);
    res.status(500).json({ error: 'Reset failed' });
  }
}

module.exports = {
  enrollFinger,
  deleteFinger,
  deleteAll,
  resetDevice
};
