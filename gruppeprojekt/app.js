const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var indexRouter = require('./routes/routerview');

// importer routerne til service logiken
const servicesRouter = require('./routes/proxyRoutes');
// importer routerne til view filen 
const viewRouter = require('./routes/routerview');

const app = express();
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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Static files skal komme FØR routeren, så CSS/JS filer bliver serveret korrekt
app.use(express.static(path.join(__dirname, 'public')));

// Routere
app.use('/', indexRouter);
// Bruger request på /services/ videresender til servicesRouter 
app.use('/services', servicesRouter);
//app.use('/view',viewRouter);

module.exports = app;
