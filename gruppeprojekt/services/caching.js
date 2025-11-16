// services/caching.js
const cache = {};

function get(key) {
  const item = cache[key];
  if (!item) return null;
  
  // Tjek om cache er udløbet
  if (Date.now() > item.expires) {
    delete cache[key];
    return null;
  }
  
  return item.data;
}

function set(key, value, ttl = 60000) {
  cache[key] = {
    data: value,
    expires: Date.now() + ttl // TTL i millisekunder
  };
}

module.exports = { get, set };