import supertest from 'supertest';
import app from './app.js';
import 'regenerator-runtime/runtime';
// const supertest = require('supertest');
// const app = require('./app.js');

// TODO: CHECK TO SEE HOW STRING INPUTS HANDLE SPECIAL CHARACTERS (' " ? / \ etc)

describe('GET /reviews', () => {
  // Successful Calls
  describe('when all param options are included and valid', () => {
    // should respond with a JSON object containing all of the reviews for the product
    //    * push 3 reviews, then get reviews, make sure all 3 are returned
    test('should respond with a 200 status code', async () => {
      const response = await supertest(app).get('/reviews').query({
        page: 1,
        count: 5,
        sort: 'relevant',
        product_id: 2
      });
      expect(response.statusCode).toBe(200);
    });
    // should specify JSON in the content type header
  });

  describe('when "page" param is valid and different from default', () => {
    // should respond with a JSON object containing all of the results for the given page
    //    * push 10 reviews, then return page two - should show the first 5 reviews
    // should respond with a 200 status code
    // should specify JSON in the content type header
  });

  describe('when "count" param is valid and different from default', () => {
    // should respond with a JSON object containing the # of results specified
    // should respond with a 200 status code
    // should specify JSON in the content type header
  });

  describe('when "sort" param is set to "newest"', () => {
    // should respond with a JSON object with the newest review first
    //    * push 5 reviews, then get reviews and check first review
    // should respond with a 200 status code
    // should specify JSON in the content type header
  });

  describe('when "sort" param is set to "helpful"', () => {
    // should respond with a JSON object with the most helpful review first
    //    *push 5 reviews, mark one helpful, get reviews, and check first review
    // should respond with a 200 status code
    // should specify JSON in the content type header
  });

  describe('when "sort" param is set to "relevant"', () => {
    // should respond with a JSON object with the most helpful reviews first. When there's a tie, the more recent review should show first
    //    * push 5 reivews, mark 2 reviews helpful twice, and 2 reviews helpful once, get reviews, and check first two reviews
    // should respond with a 200 status code
    // should specify JSON in the content type header
  });

  describe('when "page" param is not included in request', () => {
    // should respond with a JSON object with the most relevant review listed first.
    //    * push 10 reviews, mark 2 reviews helpful twice, and 2 reviews helpful once, get reviews and make sure the most relevant 5 are listed.
    // should respond with a 200 status code
    // should specify JSON in the content type header
  });

  describe('when "count" param is not included in request', () => {

  });


  // Un-successful Calls
  describe('when invalid "page" param format is requested', () => {

  });

  describe('when invalid "count" param format is requested', () => {

  });

  describe('when invalid "sort" param format is requested', () => {

  });

  describe('when invalid "product_id" param format is requested', () => {

  });

  describe('when "product_id" does not exist in the database', () => {

  });

  describe('when "sort" param is not included in request', () => {

  });

  describe('when "product_id" is not included in request', () => {

  });
});

describe('GET /reviews/meta', () => {
  // Successful Calls
  describe('when "product_id" is valid format and exists in DB', () => {

  });

  // Un-successful Calls
  describe('when "product_id" is valid format, but does not exist in DB', () => {

  });

  describe('when "product_id" param is invalid format', () => {

  });

  describe('when "product_id" param is not included in request', () => {

  });
});

describe('POST /reviews', () => {
  // Successful Calls
  describe('when all param options are included and valid', () => {

  });

  describe('when "photos" param is not included', () => {

  });

  describe('when "summary" param is not included', () => {

  });

  // Un-successful Calls
  describe('when invalid "product_id" param format is requested', () => {

  });

  describe('when invalid "rating" param format is requested', () => {

  });

  describe('when invalid "summary" param format is requested', () => {

  });

  describe('when invalid "body" param format is requested', () => {

  });

  describe('when invalid "recommend" param format is requested', () => {

  });

  describe('when invalid "name" param format is requested', () => {

  });

  describe('when invalid "email" param format is requested', () => {

  });

  describe('when invalid "photos" param format is requested', () => {

  });

  describe('when invalid "photos[0].url" param format is requested', () => {

  });

  describe('when invalid "photos[1].url" param format is requested', () => {

  });

  describe('when invalid "characteristics" param format is requested', () => {

  });

  describe('when invalid "characteristics[0].value" param format is requested', () => {

  });

  describe('when invalid "characteristics[1].value" param format is requested', () => {

  });

  describe('when "product_id" does not exist in the database', () => {

  });

  describe('when "rating" param is not between 1-5', () => {

  });

  describe('when "email" param is not a valid email format', () => {

  });

  describe('when "summary" param exceeds 60 characters', () => {

  });

  describe('when "body" param exceeds 1000 characters', () => {

  });

  describe('when "body" param is less than 50 characters', () => {

  });

  describe('when "name" param exceeds 60 characters', () => {

  });

  describe('when "email" param exceeds 60 characters', () => {

  });

  describe('when "characteristics[0].value" param format is not between 1-5', () => {

  });

  describe('when "characteristics[1].value" param format is not between 1-5', () => {

  });

  describe('when "product_id" param is not included in request', () => {

  });

  describe('when "rating" param is not included in request', () => {

  });

  describe('when "body" param is not included in request', () => {

  });

  describe('when "recommend" param is not included in request', () => {

  });

  describe('when "name" param is not included in request', () => {

  });

  describe('when "email" param is not included in request', () => {

  });

  describe('when "characteristics" param is not included in request', () => {

  });

  describe('when "value" is not included in "characteristics[0]" within request', () => {

  });

  describe('when "value" is not included in "characteristics[1]" within request', () => {

  });

  describe('when "url" is not included in "photos[0]" within request', () => {

  });

  describe('when "url" is not included in "photos[1]" within request', () => {

  });
});

describe('PUT /reviews/:review_id/helpful', () => {
  // Successful Calls
  describe('when "review_id" is valid format and exists in DB', () => {

  });

  // Un-successful Calls
  describe('when "review_id" is valid format, but does not exist in DB', () => {

  });

  describe('when "review_id" param is invalid format', () => {

  });

  describe('when "review_id" param is not included in request', () => {

  });
});

describe('PUT /reviews/:review_id/report', () => {
  // Successful Calls
  describe('when "review_id" is valid format and exists in DB', () => {

  });

  describe('when "GET /reviews" is called after reporting a review', () => {

  });

  // Un-successful Calls
  describe('when "review_id" is valid format, but does not exist in DB', () => {

  });

  describe('when "review_id" param is invalid format', () => {

  });

  describe('when "review_id" param is not included in request', () => {

  });
});