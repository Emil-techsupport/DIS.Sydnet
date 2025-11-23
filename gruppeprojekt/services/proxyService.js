//services/proxyService.js 
// Proxy service der håndterer hentning af data fra flere eksterne værter (
// Fungerer som mellemlag mellem klient og backend APIr

// Importerer axios til at lave HTTP requests til eksterne API'er
const axios = require("axios");

// Importerer hosts array fra mock database 
const {getAllHosts} = require('../data/mockHosts');

// Importerer dansk mock events data
//const {getRandomEvent} = require('../data/mockEvents');
const {getEventsByHost2} = require('../data/mockEvents');

// Importerer caching service til at cachee responses
const cache = require('./caching');

/**
henter events fra en vært
 */
async function proxyRequest(host) {
      // Gemmer starttidspunkt for at måle Round Trip Time (RTT)
      // RTT = hvor lang tid det tager at hente data fra API
      const start = Date.now();
      
      // Simulerer API request med dansk mock data
      // henter mock vært data fra mockDB.js
      //await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100)); // Simulerer netværksforsinkelse
      
      // Henter mock event data baseret på vært navn
      const mockEvent = getEventsByHost2(host.navn);
      //const mockEvent2 = getEventsByHost2(host.navn);

      console.log("********Mockevent*********");
      console.log(mockEvent);
      // Beregner RTT ved at trække starttid fra nuværende tid
      // Resultatet er i millisekunder (ms)
      const rtt = Date.now() - start;
      
      // Logger RTT til konsollen for monitoring/debugging
      // Viser hvilken vært og hvor hurtigt den svarede
      console.log(`${host.navn} - RTT: ${rtt}ms`);
      
      // Returnerer struktureret objekt med vært info + hentet data
      // Dette objekt sendes videre til controller og derefter til klienten
      return {
        navn: host.navn,       
        URL: host.apiUrl,           
        lokation: host.lokation,        
        ID: host.værtID,          
        rtt,                      
        events: mockEvent || null      // Dansk mock data (direkte objekt, ikke array)
      };
}

/**
 * Hovedfunktion: Henter events/data fra alle aktive værter via proxy
 * Array med data fra alle værter inkl. RTT målinger
 */
async function fetchEventsFromHosts() {
  try {
    // Cache key til at identificere cached data
    const cacheKey = 'vearter_data';
    
    // Tjek om data allerede er i cache
    // Hvis cache findes og ikke er udløbet, returner cached data (hurtigere!)
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log('Returning data from cache'); // Logger at cache bruges
      return cachedData;
    }
    
    // Hvis ikke i cache, hent data fra API'er
    console.log('Cache miss - fetching from APIs'); // Logger at data hentes
    
    // Filtrerer hosts array for kun at få aktive værter
    // Dette sikrer at vi kun henter data fra værter der er aktive
    // Filter returnerer et nyt array med kun de værter hvor status === 'active'
    //let getActiveHosts = getAllHosts.filter(host => host.status === 'active');
    
    // Looper gennem alle aktive værter
    // For hver vært starter vi et async request (men venter ikke på det)
    // Dette gør at alle requests kører parallelt 
    
    let host = getAllHosts();
    
    let annahost = host[0]
    console.log(annahost);
    console.log("******Getallhosts[0]******");
    console.log(annahost);
    console.log(annahost.navn);

    console.log("**********Det der kommer ud af proxyRequest************")
    test = await proxyRequest(annahost);
    console.log(test);
    
    // Gem resultater i cache for fremtidige requests
    // TTL (Time To Live) = 60000 ms = 60 sekunder
    // Dette betyder at cached data er gyldig i 60 sekunder
    // Efter 60 sekunder vil cache udløbe og data hentes igen fra API'er
    cache.set(cacheKey, test, 60000);
    console.log('Data cached for 60 seconds'); // Logger at data er cached
    
    // Returnerer array med alle resultater fra alle værter
    // Hvert element i arrayet er et objekt med vært info + data (se proxyRequest return)
    return test;
    
  } catch (error) {
    // Hvis noget går galt (fx API er nede, netværksfejl, osv.)
    // Logger fejlen til konsollen for debugging
    console.error("Fejl i proxyService:", error);
    
    // Kaster en ny fejl videre til controller
    // Controller kan så håndtere fejlen og sende passende HTTP response til klienten
    throw new Error("Kunne ikke hente data fra værter");
  }
}


/**
 * Henter events for en specifik vært ( kan bruges til alle hosts)
 *  Navnet på værten hvis events skal hentes
 */
async function fetchHostEvents(hostNavn) {
  try {
    // Cache key baseret på host navn
    const cacheKey = `host_events_${hostNavn.toLowerCase()}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`Returning ${hostNavn} events from cache`);
      return cachedData;
    }
    // Find host i databasen
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

module.exports = { 
  fetchEventsFromHosts,
  fetchHostEvents
};
