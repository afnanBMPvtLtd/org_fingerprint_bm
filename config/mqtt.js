const mqtt = require('mqtt');
const { MQTT_BROKER } = require('./env');
const TOPICS = require('../mqtt/topics');

const { handleScanMessage } = require('../mqtt/handlers/scan.handler');
const { handleStatusMessage } = require('../mqtt/handlers/status.handler');

function initMQTT() {
  const client = mqtt.connect(MQTT_BROKER);

  client.on('connect', () => {
    console.log('[MQTT] Connected to broker');

    client.subscribe([
      TOPICS.DEVICE_SCAN,
      TOPICS.DEVICE_STATUS
    ]);
  });

  client.on('message', async (topic, message) => {
    try {
      if (topic.endsWith('/scan')) {
        await handleScanMessage(topic, message);
      } else if (topic.endsWith('/status')) {
        await handleStatusMessage(topic, message);
      }
    } catch (err) {
      console.error('[MQTT] Message handling error', err.message);
    }
  });

  client.on('error', (err) => {
    console.error('[MQTT] Error:', err.message);
  });
}

module.exports = initMQTT;
