const mqtt = require('mqtt');
const { MQTT_BROKER } = require('./env');

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
    const payload = message.toString();

    if (topic.endsWith('/scan')) {
      await handleScanMessage(topic, payload);
    } 
    else if (topic.endsWith('/status')) {
      await handleStatusMessage(topic, payload);
    } 
    else if (topic.endsWith('/enroll/result')) {
      const data = JSON.parse(payload.split('|')[1]);
      await handleEnrollResult(topic, data);
    }
  });

  return mqttClient;
}

function getClient() {
  return mqttClient;
}

module.exports = { initMQTT, getClient };
