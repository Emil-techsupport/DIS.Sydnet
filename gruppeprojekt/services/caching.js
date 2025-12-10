// services/caching.js
// Objekt til at gemme cached data
const cache = {};

// Henter data fra cache nøgle (fx 'events_all_hosts')
// Bliver kaldt gennem authRoutes.js
function get(key) {
  // Hent item fra cache objekt
  const item = cache[key];
  
  // Hvis item ikke findes, returner null
  if (!item) {
    return null;
  }
  
  // Tjek om cache er udløbet
  if (Date.now() > item.expires) {
    // Slet udløbet cache data
    delete cache[key];
    return null;
  }
  
  // Hvis cache er gyldig, så returner data
  return item.data;
}

// Gemmer data i cache (i 60 sekunder)
function set(key, value, ttl = 60000) {
  // Gem data i cache sammen med udløbnings tidspunkt
  cache[key] = {
    data: value,                    
    expires: Date.now() + ttl      
  };
}

// Vi eksporterer get og set funktionerne så de kan bruges i andre filer
module.exports = { get, set }; 