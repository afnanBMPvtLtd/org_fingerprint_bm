const express = require('express');
const router = express.Router();

const Organization = require('../models/Organization');
const Location = require('../models/Location');
const Device = require('../models/Device');

const {
  enrollFinger,
  deleteFinger,
  deleteAll,
  resetDevice
} = require('../controllers/device.controller');

/* ================= ORGANIZATION ================= */
router.post('/organization', async (req, res) => {
  try {
    const { name, code } = req.body;
    const org = await Organization.create({ name, code });
    res.json(org);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ================= LOCATION ================= */
router.post('/location', async (req, res) => {
  try {
    const { organizationId, name, address } = req.body;
    const location = await Location.create({
      organization: organizationId,
      name,
      address
    });
    res.json(location);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
/* ================= DEVICE REGISTRATION ================= */
router.post('/device', async (req, res) => {
  try {
    const { deviceId, secretKey, organizationId, locationId } = req.body;

    if (!deviceId || !secretKey || !organizationId || !locationId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const device = await Device.create({
      deviceId,
      secretKey,
      organization: organizationId,
      location: locationId,
      status: 'OFFLINE'
    });

    res.json(device);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ================= DEVICE COMMAND APIs ================= */
router.post('/device/enroll', enrollFinger);
router.post('/device/delete-finger', deleteFinger);
router.post('/device/delete-all', deleteAll);
router.post('/device/reset', resetDevice);

module.exports = router;
