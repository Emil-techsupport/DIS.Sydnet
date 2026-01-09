// Load Balancer Server - dette er en NGNIX-ligende reverese proxy load balancer (http proxy)
// fordi vi fordeler trafik mellem interne webservere
// Fordeler HTTP requests mellem flere backend servere

const http = require('http')
const httpProxy = require('http-proxy')
const app = require('./app') // Importerer app.js så vi kan teste det på vores app.js

// Opret HTTP proxy server på port 8080
// Denne proxy peger på load balanceren på port 8000
const proxy = httpProxy.createProxyServer({
  target: {
    host: 'localhost',
    port: 8000
  }
}).listen(8080, () => {
  console.log('HTTP proxy server listening on port 8080')
})

// Start tre HTTP servere (backend servere)
// Hver server kører samme app.js på forskellige porte
const server1 = http.createServer(app).listen(4000, () => {
  console.log('Express HTTP server listening on port %d', server1.address().port)
})

const server2 = http.createServer(app).listen(4001, () => {
  console.log('Express HTTP server listening on port %d', server2.address().port)
})

const server3 = http.createServer(app).listen(4002, () => {
  console.log('Express HTTP server listening on port %d', server3.address().port)
}) 

// Array med serveradresser
// Dette er listen over servere som load balanceren kan fordele trafik til
var addresses = [
  {
    host: 'localhost',
    port: 4000,
    protocol: 'http'
  },
  {
    host: 'localhost',
    port: 4001,
    protocol: 'http'
  },
  {
    host: 'localhost',
    port: 4002,
    protocol: 'http'
  }
]

// Round robin load balancer
// Modtager requests og fordelere dem mellem servere i rækkefølge
const balancer = http.createServer( (req, res) => {
  // Tager første server fra arrayet (round-robin)
  let target = { target: addresses.shift() }
  const targetPort = target.target.port
  
  // Logger hvilken server requesten sendes til
  console.log(`[Load Balancer] Request ${req.method} ${req.url} → Server på port ${targetPort}`)
  
  // Videregiv request til valgt server
  proxy.web(req, res, { target: target['target']['protocol'] + '://' + target['target']['host'] + ':' + target['target']['port'], changeOrigin: true},  function(e) { console.log(e) })
  
  // Tilføj serveren tilbage til slutningen af arrayet (round-robin)
  addresses.push(target.target)
}).listen(8000, () => {
  console.log('Load balancer running at port %d', balancer.address().port)
})
