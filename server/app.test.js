import supertest from 'supertest';
import app from './app.js';

describe('GET /reviews', () => {
  // Successful Calls
  describe('when all param options are included and valid', () => {

  });

  describe('when "page" param is valid and different from default', () => {

  });

  describe('when "count" param is valid and different from default', () => {

  });

  describe('when "sort" param is set to "newest"', () => {

  });

  describe('when "sort" param is set to "helpful"', () => {

  });

  describe('when "sort" param is set to "relevant"', () => {

  });

  describe('when "page" param is not included in request', () => {

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
  describe('', () => {

  });
});