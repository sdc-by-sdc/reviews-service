const express = require('express');
const app = express();
require('dotenv').config();

let port = process.env.PORT;
let host = process.env.HOST;

app.get('/', (req, res) => {
  res.status(200).send(`Server is running on ${host} at port ${port}...`);
});

app.listen(port);