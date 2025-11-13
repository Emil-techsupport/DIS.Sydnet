//services/proxyService.js 
const axios = require("axios");

export async function fetchEventsFromHosts() {
  try {
    const results = await Promise.all(
      hosts.map(async (host) => {
        const start = Date.now(); // måler RTT (valgfrit) JEG KOMMER TILBAGE TIL DETTE 
        const response = await axios.get(host.url);
        const rtt = Date.now() - start;
        return {
          source: host.name,
          rtt,
          data: response.data.slice(0, 5) // tager fx kun 5 første elementer for demo
        };
      })
    );

    return results;
  } catch (error) {
    console.error("Fejl i proxyService:", error.message);
    throw new Error("Kunne ikke hente data fra værter");
  }
}
