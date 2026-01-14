const mqtt = require('mqtt');
const { MQTT_BROKER } = require('./env');

const { authenticateMqttMessage } = require('../services/mqttAuth.service');

const { handleScanMessage } = require('../mqtt/handlers/scan.handler');
const { handleStatusMessage } = require('../mqtt/handlers/status.handler');
const handleEnrollResult = require('../mqtt/handlers/enrollResult.handler');

let mqttClient = null;

function initMQTT() {
  if (mqttClient) return mqttClient;

  mqttClient = mqtt.connect(MQTT_BROKER, {
    keepalive: 60,
    reconnectPeriod: 5000
  });

  mqttClient.on('connect', () => {
    console.log('[MQTT] Connected to broker');
    mqttClient.subscribe([
      'device/+/scan',
      'device/+/status',
      'device/+/enroll/result'
    ]);
  });

  mqttClient.on('message', async (topic, message) => {
    try {
      const auth = await authenticateMqttMessage(message.toString());
      if (!auth) return;

      const { device, data } = auth;

      if (topic.endsWith('/scan')) {
        await handleScanMessage(device, data);
      }
      else if (topic.endsWith('/status')) {
        await handleStatusMessage(device, data);
      }
      else if (topic.endsWith('/enroll/result')) {
        await handleEnrollResult(device, data);
      }
    } catch (err) {
      console.error('[MQTT ERROR]', err.message);
    }
  });

  return mqttClient;
}

function getClient() {
  return mqttClient;
}

module.exports = { initMQTT, getClient };
