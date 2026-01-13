// services/mqttPublish.service.js
const { getClient } = require('../config/mqtt');

async function publishToDevice(topic, payload) {
  const client = getClient();

  if (!client) {
    throw new Error('MQTT client not initialized');
  }

  return new Promise((resolve, reject) => {
    client.publish(topic, payload, {}, (err) => {
      if (err) {
        console.error('[MQTT PUBLISH ERROR]', err.message);
        reject(err);
      } else {
        console.log('[MQTT] Published to', topic);
        resolve();
      }
    });
  });
}

module.exports = {
  publishToDevice
};
