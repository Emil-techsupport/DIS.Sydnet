
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
};
