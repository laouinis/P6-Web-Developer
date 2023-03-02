require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser')
const app =express();
const path = require('path');
const mongoose = require('mongoose');
const routesUsers = require('./routes/users');
const routesSauces = require('./routes/sauces');

// Data Base connection and SetHeader
mongoose.connect(process.env.keyConnection,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Connection to MongoDb success !'))
    .catch(() => console.log('Connection to MongoDB failed !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use(bodyParser.json());
app.use(express.json());
app.use('/api/auth', routesUsers);
app.use('/api/sauces', routesSauces);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
