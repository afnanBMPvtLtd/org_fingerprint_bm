const express = require('express');
const cors = require('cors');
const { initMQTT } = require('./config/mqtt');

const connectDatabase = require('./config/database');
const { PORT } = require('./config/env');

const deviceRoutes = require('./routes/device.routes');
const enrollRoutes = require('./routes/enroll.routes');
const employeeRoutes = require('./routes/employee.routes');

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_, res) => res.json({ status: 'OK' }));

  app.use('/api', deviceRoutes);
  app.use('/api', enrollRoutes);
  app.use('/api', employeeRoutes);

  await connectDatabase();
  initMQTT(); // ✅ ONLY HERE

  app.listen(PORT, () => {
    console.log(`[SERVER] Running on port ${PORT}`);
  });
}

startServer();
