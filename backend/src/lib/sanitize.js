function sanitizeString(value) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/<[^>]*>/g, '')
    .replace(/[$]{|`/g, '')
    .trim();
}

function sanitizeObject(obj) {
  const clean = {};
  for (const key of Object.keys(obj)) {
    clean[key] = sanitizeString(obj[key]);
  }
  return clean;
}

module.exports = { sanitizeString, sanitizeObject };
