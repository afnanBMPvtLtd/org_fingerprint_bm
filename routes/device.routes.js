const express = require('express');
const router = express.Router();

const Organization = require('../models/Organization');
const Location = require('../models/Location');
const Device = require('../models/Device');

const { publishToDevice } = require('../services/mqttPublish.service');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');

/* =========================================================
   SUPER ADMIN — CREATE ORGANIZATION
========================================================= */
router.post(
  '/organization',
  authenticate,
  requireRole('SUPER_ADMIN'),
  async (req, res) => {
    try {
      const { name, code } = req.body;
      const org = await Organization.create({ name, code });
      res.json(org);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

/* =========================================================
   ORG ADMIN — CREATE LOCATION
========================================================= */
router.post(
  '/location',
  authenticate,
  requireRole('ORG_ADMIN'),
  async (req, res) => {
    try {
      const { name, address } = req.body;

      const location = await Location.create({
        organization: req.user.organization,
        name,
        address
      });

      res.json(location);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

/* =========================================================
   ORG ADMIN — REGISTER DEVICE
========================================================= */
router.post(
  '/device',
  authenticate,
  requireRole('ORG_ADMIN'),
  async (req, res) => {
    try {
      const { deviceId, secretKey, locationId } = req.body;

      const device = await Device.create({
        deviceId,
        secretKey,
        organization: req.user.organization,
        location: locationId,
        isActive: true,
        status: 'OFFLINE'
      });

      res.json(device);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

/* =========================================================
   SUPER ADMIN — UNREGISTER DEVICE
========================================================= */
router.post(
  '/device/unregister',
  authenticate,
  requireRole('SUPER_ADMIN'),
  async (req, res) => {
    const { deviceId } = req.body;

    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    device.organization = null;
    device.location = null;
    device.isActive = false;
    device.status = 'OFFLINE';

    await device.save();

    res.json({
      status: 'DEVICE_UNREGISTERED',
      deviceId
    });
  }
);

/* =========================================================
   SUPER ADMIN — ASSIGN DEVICE TO ORG
========================================================= */
router.post(
  '/device/assign',
  authenticate,
  requireRole('SUPER_ADMIN'),
  async (req, res) => {
    const { deviceId, organizationId, locationId } = req.body;

    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    device.organization = organizationId;
    device.location = locationId;
    device.isActive = true;
    device.status = 'OFFLINE';

    await device.save();

    res.json({
      status: 'DEVICE_ASSIGNED',
      deviceId,
      organizationId,
      locationId
    });
  }
);

/* =========================================================
   DEVICE COMMANDS — ORG ADMIN
========================================================= */

router.post(
  '/device/enroll',
  authenticate,
  requireRole('ORG_ADMIN'),
  async (req, res) => {
    const { deviceId } = req.body;

    const device = await Device.findOne({
      deviceId,
      organization: req.user.organization,
      isActive: true
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found or inactive' });
    }

    const topic = `device/${deviceId}/enroll`;
    const payload = `${device.secretKey}|ENROLL`;

    await publishToDevice(topic, payload);
    res.json({ status: 'ENROLL_COMMAND_SENT' });
  }
);

router.post(
  '/device/delete-finger',
  authenticate,
  requireRole('ORG_ADMIN'),
  async (req, res) => {
    const { deviceId, fingerId } = req.body;

    const device = await Device.findOne({
      deviceId,
      organization: req.user.organization,
      isActive: true
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found or inactive' });
    }

    const topic = `device/${deviceId}/delete`;
    const payload = `${device.secretKey}|${fingerId}`;

    await publishToDevice(topic, payload);
    res.json({ status: 'DELETE_FINGER_COMMAND_SENT' });
  }
);

router.post(
  '/device/delete-all',
  authenticate,
  requireRole('ORG_ADMIN'),
  async (req, res) => {
    const { deviceId } = req.body;

    const device = await Device.findOne({
      deviceId,
      organization: req.user.organization,
      isActive: true
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found or inactive' });
    }

    const topic = `device/${deviceId}/deleteAll`;
    const payload = `${device.secretKey}|ALL`;

    await publishToDevice(topic, payload);
    res.json({ status: 'DELETE_ALL_COMMAND_SENT' });
  }
);

router.post(
  '/device/reset',
  authenticate,
  requireRole('ORG_ADMIN'),
  async (req, res) => {
    const { deviceId } = req.body;

    const device = await Device.findOne({
      deviceId,
      organization: req.user.organization,
      isActive: true
    });

    if (!device) {
      return res.status(404).json({ error: 'Device not found or inactive' });
    }

    const topic = `device/${deviceId}/reset`;
    const payload = `${device.secretKey}|RESET`;

    await publishToDevice(topic, payload);
    res.json({ status: 'RESET_COMMAND_SENT' });
  }
);

module.exports = router;
