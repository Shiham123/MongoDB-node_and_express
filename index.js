const express = require('express');
const { default: mongoose } = require('mongoose');
// const mongoose = require('mongoose');
const app = express();
const process = require('dotenv').config();

const port = process.parsed.port;
const personUrl = 'mongodb://127.0.0.1:27017/personDB';

/*
mongoose
  .connect('mongodb://127.0.0.1:27017/personDB')
  .then(() => console.log('database connected'))
  .catch((error) => console.log('error here', error));
*/

const connectDB = async () => {
  try {
    await mongoose.connect(personUrl);
    console.log('Database is connected');
  } catch (error) {
    console.log(`Here are error : ${error}`);
  }
};

app.get('/', (request, response) => {
  response.send('getting fixing error');
});

app.listen(port, async () => {
  console.log(`Server running at http://127.0.0.1:${port}`);
  await connectDB();
});
