const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Organization = require('../models/Organization');
const { signToken } = require('../utils/jwt.util');
const { authenticate, requireRole } = require('../middlewares/auth.middleware');

/* ================= LOGIN ================= */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = signToken(user);
  res.json({ token, role: user.role });
});

/* ================= CREATE ORG (SUPER ADMIN) ================= */
router.post(
  '/organization',
  authenticate,
  requireRole('SUPER_ADMIN'),
  async (req, res) => {
    const { name, code } = req.body;
    const org = await Organization.create({ name, code });
    res.json(org);
  }
);

/* ================= CREATE ORG ADMIN ================= */
router.post(
  '/org-admin',
  authenticate,
  requireRole('SUPER_ADMIN'),
  async (req, res) => {
    const { name, email, password, organizationId } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role: 'ORG_ADMIN',
      organization: organizationId
    });

    res.json(user);
  }
);

module.exports = router;
