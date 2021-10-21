const express = require('express');
const bodyParser = require('body-parser');
const databaseHelpers = require('../database/index');
// import { ReviewCharacteristic, Characteristic, ReviewPhoto, Review } from '../database/index.js';

const app = express();
require('dotenv').config();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

let port = process.env.PORT;
let host = process.env.HOST;

app.get('/', (req, res) => {
  res.status(200).send(`Server is running on ${host} at port ${port}...`);
});

app.post('/characteristics', ((req, res) => {
  databaseHelpers.saveCharacteristic(req.body)
    .then((message) => { res.status(200).send(message); })
    .catch((message) => { res.status(501).send(message); });
}));

app.listen(port);