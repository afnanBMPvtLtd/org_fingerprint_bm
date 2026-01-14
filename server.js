const express = require('express');
const cors = require('cors');

const connectDatabase = require('./config/database');
const { initMQTT } = require('./config/mqtt');
const { PORT } = require('./config/env');

const authRoutes = require('./routes/auth.routes');
const deviceRoutes = require('./routes/device.routes');
const enrollRoutes = require('./routes/enroll.routes');
const employeeRoutes = require('./routes/employee.routes');

const { markStaleDevicesOffline } = require('./services/deviceMonitor.service');

async function startServer() {
  const app = express();

  /* ================= MIDDLEWARE ================= */
  app.use(cors());
  app.use(express.json());

  /* ================= HEALTH ================= */
  app.get('/health', (_req, res) => {
    res.json({ status: 'OK' });
  });

  /* ================= ROUTES ================= */
  app.use('/api/auth', authRoutes);
  app.use('/api', deviceRoutes);
  app.use('/api', enrollRoutes);
  app.use('/api', employeeRoutes);

  /* ================= DB ================= */
  await connectDatabase();

  /* ================= MQTT ================= */
  initMQTT(); // 🔒 SINGLE INIT POINT

  /* ================= DEVICE HEARTBEAT MONITOR ================= */
  setInterval(markStaleDevicesOffline, 30 * 1000);

  /* ================= SERVER ================= */
  app.listen(PORT, () => {
    console.log(`[SERVER] Running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[SERVER BOOT ERROR]', err.message);
  process.exit(1);
});
