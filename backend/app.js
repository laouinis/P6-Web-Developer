const express = require('express');
const app =express();
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const sauceRouter = require('./routes/sauces');

mongoose.connect('mongodb+srv://P6-Piicante:P6-Piicante@cluster0.kjvux2p.mongodb.net/?retryWrites=true&w=majority',
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
      'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
  );
  res.setHeader(
      'Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH, OPTIONS',
  );
  next();
});

app.use(express.json());
app.use('/api/auth', userRouter);
app.use('/api/sauces', sauceRouter);

module.exports = app;
