const express = require('express');
const router = express.Router();

const Employee = require('../models/Employee');
const Device = require('../models/Device');

/* ================= CREATE EMPLOYEE (MANUAL – OPTIONAL) ================= */
router.post('/employee', async (req, res) => {
  try {
    const {
      name,
      employeeCode,
      fingerId,
      deviceId,
      organizationId,
      locationId
    } = req.body;

    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const employee = await Employee.create({
      name,
      employeeCode,
      fingerId,
      device: device._id,
      organization: organizationId,
      location: locationId
    });

    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ================= GET ALL EMPLOYEES ================= */
router.get('/employees', async (_req, res) => {
  try {
    const employees = await Employee.find()
      .populate('device')
      .populate('organization')
      .populate('location');

    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ================= GET EMPLOYEES BY DEVICE ================= */
router.get('/employees/device/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;

    const device = await Device.findOne({ deviceId });
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }

    const employees = await Employee.find({ device: device._id });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
