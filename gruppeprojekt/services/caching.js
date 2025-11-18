// services/caching.js
// Simpel memory cache med TTL (Time To Live)
// Cache gemmer data i memory og sletter automatisk når TTL udløber
// HVAD CASHER VI: Data fra API'er (jsonplaceholder.typicode.com) 
// som vi gemmer i serverens memory (RAM) 
// Objekt til at gemme cached data
const cache = {};

/*
  Henter data fra cache
 nøgle (fx 'events_all_hosts')
  Cached data eller null hvis ikke fundet/udløbet
 */
function get(key) {
  // Hent item fra cache objekt
  const item = cache[key];
  
  // Hvis item ikke findes, returner null
  if (!item) {
    return null;
  }
  
  // Tjek om cache er udløbet
  // Date.now() = nuværende tid
  // item.expires = tidspunkt hvor cache udløber
  // Hvis nuværende tid > udløbstid = cache er udløbet
  if (Date.now() > item.expires) {
    // Slet udløbet cache entry
    delete cache[key];
    return null;
  }
  
  // Cache er gyldig, returner data
  return item.data;
}

/**
 * Gemmer data i cache
 * - Cache nøgle (fx 'events_all_hosts')
 *  Data der skal gemmes
 * Time To Live i millisekunder (60000 = 60 sekunder)
 */
function set(key, value, ttl = 60000) {
  // Gem data i cache objekt med expires tidspunkt
  // expires = nuværende tid + TTL (fx nu + 60 sekunder)
  cache[key] = {
    data: value,                    // Gem data
    expires: Date.now() + ttl      // Beregn udløbstidspunkt
  };
}

module.exports = { get, set }; // vi eksporterer get og set funktionerne så de kan bruges i andre filer