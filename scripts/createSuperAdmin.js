const mongoose = require('mongoose');
const connectDatabase = require('../config/database');
const User = require('../models/User');

async function createSuperAdmin() {
  await connectDatabase();

  const existing = await User.findOne({ role: 'SUPER_ADMIN' });
  if (existing) {
    console.log('SUPER_ADMIN already exists');
    process.exit(0);
  }

  const admin = await User.create({
    name: 'Super Admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'SUPER_ADMIN'
  });

  console.log('SUPER_ADMIN created:', admin.email);
  process.exit(0);
}

createSuperAdmin();
