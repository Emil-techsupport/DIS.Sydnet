
// Importerer axios til at lave HTTP requests til eksterne API'er
const axios = require("axios");

// Importerer funktion til at få fat i alle hosts fra "mockHosts"
const {getAllHosts} = require('../data/mockHosts');

//Importere vores funktion til at hente alle events fra en given host.
const {getEventsByHostName} = require('../data/mockEvents');

//Gør det muligt at cache responses
const cache = require('./caching');

//Henter events ud fra host og tilføjer RTT
async function proxyRequest(host) {
  const start = Date.now();
  const alleEvents = getEventsByHostName(host.navn);
  const rtt = Date.now() - start;
  console.log(`${host.navn} - RTT: ${rtt}ms`);
  
  return {
    navn: host.navn,       
    URL: host.apiUrl,           
    lokation: host.lokation,        
    ID: host.værtID,          
    rtt,                      
    events: alleEvents || null   
  };
}


/**
 * Henter events for en specifik vært (kan bruges til alle hosts)
 *  Navnet på værten hvis events skal hentes
 */
async function fetchHostEvents(hostNavn) {
  try {
    const cacheKey = `host_events_${hostNavn.toLowerCase()}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Returning ${hostNavn} events from cache ${cacheKey}`);
      return cachedData;
    }
    
    const hosts = getAllHosts();
    let host = null;
    
    for (let i = 0; i < hosts.length; i++) {
        if (hosts[i].navn === hostNavn) {
            host = hosts[i];
            break; // Stop når vi har fundet den
        }
    }
    
    // Tjek om host blev fundet
    if (!host) {
      throw new Error(`Host '${hostNavn}' ikke fundet`);
    }
    
    // Hent events for denne host
    const result = await proxyRequest(host);
    cache.set(cacheKey, result, 60000);
    
    return result;

  } catch (error) {
    console.error(`Fejl i fetchHostEvents for ${hostNavn}:`, error);
    throw new Error(`Kunne ikke hente events for ${hostNavn}`);
  }
}

//Gør at vi kan bruge "fetchEventsFromHost" funktionen i andre filer
module.exports = { 
  fetchHostEvents
};
