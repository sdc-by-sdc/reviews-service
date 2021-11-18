import express from 'express';
import bodyParser from 'body-parser';

export default function(database) {
  const app = express();

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  app.use(express.static('static'));

  app.get('/', (req, res) => {
    res.status(200).send(`Server is running on ${process.env.HOST} at port ${process.env.PORT}...`);
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
    let productIdInt = parseInt(req.query.product_id);

    Promise.all([database.getReviewsMeta(productIdInt), database.getCharacteristicsMeta(productIdInt)])
      .then(([temp_result, charNames]) => {
        if (Object.keys(temp_result.ratings).length === 0) {
          res.status(200).send({
            product_id: temp_result.product_id,
            ratings: {},
            recommended: {},
            characteristics: {}
          })
        } else {
          for (var x in charNames) {
            if (temp_result.characteristics_temp[charNames[x].id] === null) {
              charNames[x].value = null;
            } else {
              let ratings = temp_result.characteristics_temp[charNames[x].id.toString()];
              let sum = 0;
              for (var i = 0; i < ratings.length; i++) {
                sum += ratings[i]
              }
              let average = (sum / (ratings.length)).toFixed(4);
              charNames[x].value = average
            }
          }
          temp_result.characteristics = charNames;
          delete temp_result.characteristics_temp;
          res.status(200).send(temp_result);
        }
      })
      .catch((err) => {console.dir(err); res.status(400).send(err)})
  }));

  app.post('/reviews', ((req, res) => {
    database.postNewReview(req.body)
      .then((result) => res.status(201).send(result))
      .catch((message) => res.status(400).send(message))
  }));

  app.put('/reviews/:review_id/helpful', ((req, res) => {
    database.markReviewHelpful(req.params.review_id)
      .then((result) => res.status(204).send())
      .catch((message) => {res.status(400).send(message)})
  }));

  app.put('/reviews/:review_id/report', ((req, res) => {
    database.reportReview(req.params.review_id)
      .then((result) => res.status(204).send())
      .catch((message) => {res.status(400).send(message)})
  }));

  app.get('/loaderio-27c31e50c7ca8526b82e17abaa59ca15.txt', (req, res) => {
    res.sendfile('server/static/loaderio-27c31e50c7ca8526b82e17abaa59ca15.txt')
  })

  app.get('/getReviewsPayload.txt', (req, res) => {
    res.sendfile('server/static/getReviewsPayload.txt')
  })

  return app;
}
