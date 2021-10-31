import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();

let port = process.env.PORT;
let host = process.env.HOST;

app.listen(port);