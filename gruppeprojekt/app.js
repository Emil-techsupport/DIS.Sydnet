const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


// importer routerne
const indexRouter = require('./routes/index');
const servicesRouter = require('./routes/proxyRoutes');
// OBS OBS...Husk Tænker det er bedst vi tøljer en route af gangen når vi arbejder med det
// men vi mangler self alle de andre filer... 


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/services', servicesRouter);

module.exports = app;
