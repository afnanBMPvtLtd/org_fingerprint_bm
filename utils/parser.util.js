/**
 * Parse ESP payload in format:
 * SECRET_KEY|{json}
 */
function parseDevicePayload(rawMessage) {
  if (!rawMessage || typeof rawMessage !== 'string') {
    return null;
  }

  const separatorIndex = rawMessage.indexOf('|');
  if (separatorIndex === -1) {
    return null;
  }

  const secretKey = rawMessage.substring(0, separatorIndex);
  const jsonPart = rawMessage.substring(separatorIndex + 1);

  try {
    const data = JSON.parse(jsonPart);
    return { secretKey, data };
  } catch (err) {
    return null;
  }
}

module.exports = {
  parseDevicePayload
};
