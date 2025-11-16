//services/proxyService.js 
// Proxy service der håndterer hentning af data fra flere eksterne værter (
// Fungerer som mellemlag mellem klient og backend APIr

// Importerer axios til at lave HTTP requests til eksterne API'er
const axios = require("axios");

// Importerer hosts array fra mock database 
const {hosts} = require('../data/mockDB');

/**
 * Hovedfunktion: Henter events/data fra alle aktive værter via proxy
 * Array med data fra alle værter inkl. RTT målinger
 */
async function fetchEventsFromHosts() {
  try {
    // Array til at gemme alle async requests (promises)
    // Disse vil blive kørt parallelt samtidigt
    const requests = [];

    /**
     * Hjælpefunktion: Henter data fra en enkelt vært og måler RTT
     * host - Vært objekt fra mockDB med apiUrl, navn, osv.
     *  Objekt med vært info, RTT og hentet data
     */
    async function proxyRequest(host) {
      // Gemmer starttidspunkt for at måle Round Trip Time (RTT)
      // RTT = hvor lang tid det tager at hente data fra API
      const start = Date.now();
      
      // Henter data fra værtens API endpoint (ekstern HTTP request)
      // await = venter på at requesten er færdig før vi fortsætter
      const response = await axios.get(host.apiUrl);
      
      // Beregner RTT ved at trække starttid fra nuværende tid
      // Resultatet er i millisekunder (ms)
      const rtt = Date.now() - start;
      
      // Logger RTT til konsollen for monitoring/debugging
      // Viser hvilken vært og hvor hurtigt den svarede
      console.log(`${host.navn} - RTT: ${rtt}ms`);
      
      // Gemmer hentet data fra API response
      let data = response.data;

      // Returnerer struktureret objekt med vært info + hentet data
      // Dette objekt sendes videre til controller og derefter til klienten
      return {
        source: host.navn,       
        URL: host.apiUrl,         
        kategori: host.kategori,  
        lokation: host.lokation,  
        status: host.status,      
        ID: host.værtID,          
        rtt,                      
        data: response.data      
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
module.exports = { fetchEventsFromHosts };
