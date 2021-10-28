import app from './app.js';
require('dotenv').config();

let port = process.env.PORT;
let host = process.env.HOST;

app.listen(port);