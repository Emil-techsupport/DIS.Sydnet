//services/proxyService.js 
const axios = require("axios");


const hosts = [
  { name: "Yoga by Anna", url: "https://jsonplaceholder.typicode.com/posts" },
  { name: "Vin & Fjord", url: "https://jsonplaceholder.typicode.com/users" },
  { name: "Sauna & Silence", url: "https://jsonplaceholder.typicode.com/comments" }
];

async function fetchEventsFromHosts() {
  try {
    const requests = [];

    async function proxyRequest(host) {
      const start = Date.now(); // måler RTT 
      const response = await axios.get(host.url);
      const rtt = Date.now() - start;
      console.log(`${host.name} - RTT: ${rtt}ms`); // Test: viser RTT-værdi

      let data = response.data;

      if (Array.isArray(data)) {
        data = data.slice(0, 5);
      } else {
        data = response.data;
      }

      return {
        source: host.name,
        rtt,
        data
      };
    }

    for (let i = 0; i < hosts.length; i += 1) {
      const host = hosts[i];
      const request = proxyRequest(host);

      requests.push(request);
    }

    const results = await Promise.all(requests);
    return results;
  } catch (error) {
    console.error("Fejl i proxyService:", error);
    throw new Error("Kunne ikke hente data fra værter");
  }
}

module.exports = { fetchEventsFromHosts };
