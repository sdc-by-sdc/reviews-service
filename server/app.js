// const express = require('express');
// const bodyParser = require('body-parser');
// const databaseHelpers = require('../database/index');
import express from 'express';
import bodyParser from 'body-parser';

// import { ReviewCharacteristic, Characteristic, ReviewPhoto, Review } from '../database/index.js';

export default function(database) {
  const app = express();

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

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
    database.saveCharacteristic(req.body)
      .then((message) => { res.status(200).send(message); })
      .catch((message) => { res.status(501).send(message); });
  }));

  app.post('/getcharacteristicname', ((req, res) => {
    database.getCharacteristicName(req.body.characteristicId)
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

    let intId = parseInt(req.query.product_id);
    let page = parseInt(req.query.page || 1);
    let count = parseInt(req.query.count || 5);

    database.getReviews(intId, page, count)
      .then((results) => {
        let returnObj = {
          "product": req.query.product_id.toString(),
          "page": page,
          "count": count,
        };
        let rawResults = results.map((result) => {
          return {
            "review_id": result._id,
            "rating": result.rating,
            "summary": result.summary,
            "recommend": result.recommend,
            "response": result.response || null,
            "body": result.body,
            "date": new Date(result.date),
            "reviewer_name": result.reviewer_name,
            "helpfulness": result.helpfulness,
            "photos": result.photos.map((photo) => {
              return {
                "id": photo._id,
                "url": photo.url
              }
            })
          }
        });
        returnObj.results = rawResults;
        res.status(200).send(returnObj)
      })
      .catch((message) => {res.status(400).send(message)})
  }));

  app.get('/reviews/meta', ((req, res) => {
    //  add database helper here
    //  params:
    //    product_id: integer - Required ID of the product for which data should be returned
    //  res: 200 OK
    let productIdInt = parseInt(req.query.product_id);

    Promise.all([database.getReviewsMeta(productIdInt), database.getCharacteristicsMeta(productIdInt)])
      .then(([temp_result, charNames]) => {
        console.dir(temp_result);
        console.dir(charNames);

        for (var x in charNames) {
          let ratings = temp_result.characteristics_temp[charNames[x].id.toString()];
          let sum = 0;
          for (var i = 0; i < ratings.length; i++) {
            sum += ratings[i]
          }
          let average = (sum / (ratings.length)).toFixed(4);
          charNames[x].value = average
        }

        console.dir(charNames);
        temp_result.characteristics = charNames;
        delete temp_result.characteristics_temp;
        res.status(200).send(temp_result);

      })
      .catch((err) => {res.status(400).send(err)})
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

    database.postNewReview(req.query)
      .then((result) => res.status(201).send(result))
      .catch((message) => res.status(400).send(message))
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

  return app;
}
