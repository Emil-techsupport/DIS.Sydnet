//services/proxyService.js 
const axios = require("axios");
const {hosts} = require('../data/mockDB');

/*
const hosts = [
  { name: "Yoga by Anna", url: "https://jsonplaceholder.typicode.com/posts" },
  { name: "Vin & Fjord", url: "https://jsonplaceholder.typicode.com/users" },
  { name: "Sauna & Silence", url: "https://jsonplaceholder.typicode.com/comments" }
];
*/

async function fetchEventsFromHosts() {
  try {
    const requests = [];

    async function proxyRequest(host) {
      const start = Date.now(); // måler RTT 
      const response = await axios.get(host.apiUrl); // vi henter data fra værterne
      const rtt = Date.now() - start;
      console.log(`${host.navn} - RTT: ${rtt}ms`); // Test: viser RTT-værdi

      let data = response.data;

      if (Array.isArray(data)) {
        data = data.slice(0, 5);
      } else {
        data = response.data;
      }

      return {
        source: host.navn, URL: host.apiUrl, kategori: host.kategori, lokation: host.lokation, status: host.status, ID: host.værtID,
        rtt,
        data
      };
    }
    // vi kan filtrere efter status for at få kun de aktive værter
let getActiveHosts = hosts.filter(host => host.status === 'active');
for (let i = 0; i < getActiveHosts.length; i += 1) {
  const host = getActiveHosts[i];
  const request = proxyRequest(host);
  requests.push(request);
}
const results = await Promise.all(requests); // vi venter på at alle requests er færdige
return results;
  } catch (error) {
    console.error("Fejl i proxyService:", error);
    throw new Error("Kunne ikke hente data fra værter");
  }
}  
module.exports = { fetchEventsFromHosts };
