//services/proxyService.js 
// Proxy service der håndterer hentning af data fra flere eksterne værter (
// Fungerer som mellemlag mellem klient og backend APIr

// Importerer axios til at lave HTTP requests til eksterne API'er
const axios = require("axios");

// Importerer hosts array fra mock database 
const {hosts} = require('../data/mockHosts');

// Importerer dansk mock events data
const {getRandomEvent} = require('../data/mockEvents');
const {getEventsByHost2} = require('../data/mockEvents');

// Importerer caching service til at cachee responses
const cache = require('./caching');

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
    
    // Array til at gemme alle async requests (promises)
    // Disse vil blive kørt parallelt samtidigt
    const requests = [];

    /**
     * Hjælpefunktion: Henter data fra en enkelt vært og måler RTT
     * host - Vært objekt fra mockHosts med apiUrl, navn, osv.
     *  Objekt med vært info, RTT og hentet data
     */
    async function proxyRequest(host) {
      // Gemmer starttidspunkt for at måle Round Trip Time (RTT)
      // RTT = hvor lang tid det tager at hente data fra API
      const start = Date.now();
      
      // Simulerer API request med dansk mock data
      // I stedet for at hente fra jsonplaceholder, bruger vi dansk mock data
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100)); // Simulerer netværksforsinkelse
      
      // Henter dansk mock event data baseret på vært navn
      const mockEvent = getRandomEvent(host.navn);
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
        kategori: host.kategori,  
        lokation: host.lokation,  
        status: host.status,      
        ID: host.værtID,          
        rtt,                      
        events: mockEvent || null      // Dansk mock data (direkte objekt, ikke array)
      };
    }
    

    // Filtrerer hosts array for kun at få aktive værter
    // Dette sikrer at vi kun henter data fra værter der er aktive
    // Filter returnerer et nyt array med kun de værter hvor status === 'active'
    let getActiveHosts = hosts.filter(host => host.status === 'active');
    
    // Looper gennem alle aktive værter
    // For hver vært starter vi et async request (men venter ikke på det)
    // Dette gør at alle requests kører parallelt 
    for (let i = 0; i < getActiveHosts.length; i += 1) {
      const host = getActiveHosts[i];           // Henter nuværende vært
      const request = proxyRequest(host);       // Starter API request (returnerer Promise)
      requests.push(request);                   // Tilføjer Promise til requests array
    }
    
    // Promise.all venter på at ALLE requests er færdige
    // Dette er asynkron programmering, alle requests kører samtidigt
    // Når alle er færdige, får vi et array med alle resultaterne
    // Dette er meget hurtigere end at vente på hver request én ad gangen
    const results = await Promise.all(requests);
    
    // Gem resultater i cache for fremtidige requests
    // TTL (Time To Live) = 60000 ms = 60 sekunder
    // Dette betyder at cached data er gyldig i 60 sekunder
    // Efter 60 sekunder vil cache udløbe og data hentes igen fra API'er
    cache.set(cacheKey, results, 60000);
    console.log('Data cached for 60 seconds'); // Logger at data er cached
    
    // Returnerer array med alle resultater fra alle værter
    // Hvert element i arrayet er et objekt med vært info + data (se proxyRequest return)
    return results;
    
  } catch (error) {
    // Hvis noget går galt (fx API er nede, netværksfejl, osv.)
    // Logger fejlen til konsollen for debugging
    console.error("Fejl i proxyService:", error);
    
    // Kaster en ny fejl videre til controller
    // Controller kan så håndtere fejlen og sende passende HTTP response til klienten
    throw new Error("Kunne ikke hente data fra værter");
  }
}


module.exports = { 
  fetchEventsFromHosts  
};
