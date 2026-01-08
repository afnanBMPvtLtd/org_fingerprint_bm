const express = require('express');
const cors = require('cors');
const initMQTT = require('./config/mqtt');

const connectDatabase = require('./config/database');
const { PORT, NODE_ENV } = require('./config/env');

async function startServer() {
  const app = express();

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      environment: NODE_ENV,
      timestamp: new Date().toISOString()
    });
  });

  // Connect DB
  await connectDatabase();

// Start MQTT
initMQTT();

app.listen(PORT, () => {
  console.log(`[SERVER] Running on port ${PORT}`);
});
}

startServer();
