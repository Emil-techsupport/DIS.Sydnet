const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var indexRouter = require('./routes/routerView');


// importer routerne
const servicesRouter = require('./routes/proxyRoutes');
// OBS OBS...Husk Tænker det er bedst vi tøljer en route af gangen når vi arbejder med det
// men vi mangler self alle de andre filer... 
const viewRouter = require('./routes/routerView');

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
app.use('/', indexRouter);
app.use(express.static(path.join(__dirname, 'public')));

// Bruger request på /services/ videresender til servicesRouter 
app.use('/services', servicesRouter);

module.exports = app;
