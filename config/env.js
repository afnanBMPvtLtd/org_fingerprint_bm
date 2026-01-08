const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  PORT: process.env.PORT || 4000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI,
  MQTT_BROKER: process.env.MQTT_BROKER,
  MQTT_PORT: process.env.MQTT_PORT
};
