
// Importerer axios til at lave HTTP requests til eksterne API'er
const axios = require("axios");

// Importerer funktion til at få fat i alle hosts fra "mockHosts"
const {getAllHosts} = require('../data/mockHosts');

//Importere vores funktion til at hente alle events fra en given host.
const {getEventsByHostName} = require('../data/mockEvents');

//Gør det muligt at cache responses
const cache = require('./caching');


//Henter events fra alle hosts via proxy
//Tilføjer cache og RTT målinger
async function fetchEventsFromHost() {
  try {
    // Cache key til at identificere cached data
    const cacheKey = 'vearter_data';
    
    // Tjek om data allerede er i cache
    // Hvis cache findes og ikke er udløbet, returner cached data
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      //console.log("********Returner cached data"); 
      return cachedData;
    }
  
    // Hvis det ikke ligger i cashen, så hent data'en igen
    console.log('Cache miss - fetching from APIs');

     //Henter events ud fra host og tilføjer RTT
    async function proxyRequest(host) {
      // Gemmer starttidspunktet for senere at kunne måle round trip timen
      const start = Date.now();

      //console.log("******Start tidspunkt(nu)******")
      //console.log(start);
      
      //Er der behov for det her?:
      //await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100)); // Simulerer netværksforsinkelse
      
      // Henter alle events baseret på host navn
      const alleEvents = getEventsByHostName(host.navn);
      
      //console.log("********alleEvents*********");
      //console.log(alleEvents);

      // Beregner RTT ved at trække starttid fra nuværende tid
      const rtt = Date.now() - start;
      
      // Logger RTT til konsollen. Skriver hostnavn og given round trip time
      console.log(`${host.navn} - RTT: ${rtt}ms`);
      
      // Returnerer objekt med info om host, samt alle events for den givne host, samt RTT for processen.
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
    
    //Får fat i alle hosts
    let hosts = getAllHosts();
    
    //Får fat i vores første host(Anna)
    let annahost = hosts[0]

    //console.log("******Få fat i host Anna******");
    //console.log(annahost);
    //console.log(annahost.navn);

    //Gemmer svaret fra proxyRequest funktionen, med Anna som den givne host
    hostOgEventInfo = proxyRequest(annahost);

    //console.log("**********Det der kommer ud af proxyRequest************")
    //console.log(hostOgEventInfo);
    
  
    // Gem resultater i cachen i 60 sekunder
    cache.set(cacheKey, hostOgEventInfo, 60000);
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
    
    //Returnerer info om host, alle events for den givne host, samt RTT for processen. Og alt dette er gemt i cachen
    return hostOgEventInfo;
    
  } catch (error) {
    // Hvis noget går galt logger vi fejlen
    console.error("Fejl i proxyService:", error);
    
    //Kaster en ny fejl som sender HTTP response til klienten
    throw new Error("Kunne ikke hente data fra værter");
  }
}

//Gør at vi kan bruge "fetchEventsFromHost" funktionen i andre filer
module.exports = { 
  fetchEventsFromHost 

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
