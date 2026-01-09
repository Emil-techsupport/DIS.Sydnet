const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
var indexRouter = require('./routes/routerview'); 

// importer routerne til service logiken
const servicesRouter = require('./routes/proxyRoutes');
// importer routerne til view filen 
const viewRouter = require('./routes/routerview');
// importer routerne til kollab/SMS funktionalitet
const kollabRouter = require('./routes/kollabRoutes');
// importer routerne til login/logout
const authRouter = require('./routes/authRoutes');

const app = express();

// Trust proxy - vigtigt når nginx/load balancer sender requests videre
// Gør at Express kan se om den oprindelige request var HTTPS (gennem X-Forwarded-Proto header)
// Dette er nødvendigt når applikationen kører bag NGINX reverse proxy/load balancer
app.set('trust proxy', 1);

// LOADBALANCING MIDDLEWARE
// Middleware der logger hvilken server der modtager hver request
// Dette hjælper med at se load balancing 
app.use(function(req, res, next) {
  // Hent hvilken port denne server kører på (4000, 4001 eller 4002)
  const serverPort = req.socket.localPort;
  
  // Log hvilken server der modtog requesten
  console.log('[Server Port ' + serverPort + '] Modtog request: ' + req.method + ' ' + req.url);
  
  // next () er en indbygget funktionalitet i express som gør at vi kan fortsætte til næste middleware eller route handler
  next();
});

//Morgan logging middelware
app.use(logger('dev')); // middleware der logger requesten arbejder med morgan
// Vigtigt: urlencoded skal være true for Twilio webhooks (de sender form-data)
app.use(express.json()); // middleware der håndterer JSON data
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // middleware der håndterer cookies

//Helmet setup
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // UDEN DETTE MÅ VI IKKE LOGGE IND DA HELMET BLOCKER INLINE SCRIPTS OG HASHING 
      scriptSrc: ["'self'", "'unsafe-inline'"], // Tillad inline scripts
      styleSrc: ["'self'", "'unsafe-inline'"], // Tillad inline styles
    },
  },
})); // sikkerheds middleware der beskytter mod forskellige sikkerhedsangreber

// Static files skal komme FØR routeren, så CSS/JS filer bliver serveret korrekt
app.use(express.static(path.join(__dirname, 'public')));

// Routere
app.use('/', indexRouter);
// Bruger request på /services/ videresender til servicesRouter 
app.use('/services', servicesRouter);
app.use('/view',viewRouter);
// API routes for kollab/SMS
app.use('/api/kollab', kollabRouter);
// API routes for login/logout
app.use('/api/auth', authRouter);

module.exports = app;
