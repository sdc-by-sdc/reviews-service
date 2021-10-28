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

/**************************************************************************
 *                                                                        *
 *    These 2 routes were just created to test my database connection.    *
 *    Will not be used in final production.                               *
 *                                                                        *
 **************************************************************************/
app.post('/characteristics', ((req, res) => {
  databaseHelpers.saveCharacteristic(req.body)
    .then((message) => { res.status(200).send(message); })
    .catch((message) => { res.status(501).send(message); });
}));

app.post('/getcharacteristicname', ((req, res) => {
  databaseHelpers.getCharacteristicName(req.body.characteristicId)
    .then((name) => { res.status(200).send(name); })
    .catch((message) => { res.status(501).send(message); });
}));


/**************************************************************************
 *                                                                        *
 *    Real routes are below                                               *
 *                                                                        *
 **************************************************************************/
app.get('/reviews', ((req, res) => {
  //  add database helper here
  //  params:
  //    page: integer - Selects the page of results to return.  Default 1.
  //    count: integer - Specifies how many results per page to return.  Default to 5.
  //    sort: text - Changes the sort order of reviews to be based on "newest", "helpful", or "relevant"
  //    product_id: integer - Specifies the product for which to retrieve reviews.
  //  res: 200 OK
}));

app.get('/reviews/meta', ((req, res) => {
  //  add database helper here
  //  params:
  //    product_id: integer - Required ID of the product for which data should be returned
  //  res: 200 OK
}));

app.post('/reviews', ((req, res) => {
  //  add database helper here
  //  params:
  //    product_id: integer - Required ID of the product to post the review for
  //    rating: integer - Integer (1-5) indicating the review rating
  //    summary: text - Summary text of the review
  //    body: text - Continued or full text of the review
  //    recommend: boolean - Value indicating if the reviewer recommends the product
  //    name: text - Username for question asker
  //    email: text - Email address for question asker
  //    photos: [text] - Array of text urls that link to images to be shown
  //    characteristics: object - Object of keys representing characteristic_id and values representing
  //                              the review value for that characteristic. {"14": 5, "15": 5//...}
  //  res: 201 CREATED

}));

app.put('/reviews/:review_id/helpful', ((req, res) => {
  //  add database helper here
  //  params:
  //    review_id: integer - Required ID of the review to update
  //  res: 204 NO CONTENT
}));

app.put('/reviews/:review_id/report', ((req, res) => {
  //  add database helper here
  //  params:
  //    review_id: integer - Required ID of the review to update
  //  res: 204 NO CONTENT
}));

app.listen(port);