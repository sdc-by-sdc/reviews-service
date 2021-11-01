import database from '../database/index.js';
import makeApp from './app.js';
import dotenv from 'dotenv';
dotenv.config();

const app = makeApp(database);

let port = process.env.PORT;
let host = process.env.HOST;

app.listen(port);