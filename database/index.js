import dotenv from 'dotenv';
dotenv.config();

// MongoDB Implementation
import mongoose from 'mongoose';

if (process.env.MODE === 'test') {
  mongoose.connect(process.env.DB_TEST_CONNECTION_STRING, {auth:{authdb:"admin"}});
} else {
  mongoose.connect(process.env.DB_CONNECTION_STRING, {auth:{authdb:"admin"}});
}


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error: DB connection unsuccessful'));
db.once('open', () => { console.log(`Connected to database - Process ENV: ${process.env.MODE}`); });

// SCHEMA FOR REVIEW PHOTO DOCUMENTS
let reviewPhotoSchema = mongoose.Schema({
  id: {
    type: Number,
    validate: {
      validator: function(id) { id.isInteger; },
      message: 'The productId value must be an integer'
    }
  },
  review_id: {
    type: Number,
    validate: {
      validator: function(id) { id.isInteger; },
      message: 'The productId value must be an integer'
    }
  },
  url: {
    type: String,
    required: true
  }
});

// SCHEMA FOR CHARACTERISTIC DOCUMENTS
let characteristicSchema = mongoose.Schema({
  id: {
    type: Number,
    validate: {
      validator: function(id) { id.isInteger; },
      message: 'The productId value must be an integer'
    }
  },
  product_id: {
    type: Number,
    required: [true, 'A \'productId\' property must be included in the characteristic'],
    validate: {
      validator: function(id) { id.isInteger; },
      message: 'The productId value must be an integer'
    }
  },
  name: {
    type: String,
    required: [true, 'A \'name\' property must be included in the characteristic']
  }
});

// SCHEMA FOR REVIEW CHARACTERISTIC DOCUMENTS
let reviewCharacteristicSchema = mongoose.Schema({
  id: {
    type: Number,
    validate: {
      validator: function(id) { id.isInteger; },
      message: 'The productId value must be an integer'
    }
  },
  review_id: {
    type: Number,
    validate: {
      validator: function(id) { id.isInteger; },
      message: 'The productId value must be an integer'
    }
  },
  value: {
    type: Number,
    required: [true, 'A \'value\' property must be included in the review characteristic'],
    min: [1, 'The value submitted does not fall within the required 1-5 scale'],
    max: [5, 'The value submitted does not fall within the required 1-5 scale'],
    validate: {
      validator: Number.isInteger,
      message: 'The review characteristic value submitted must be an integer value'
    }
  },
  characteristic_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'A \'characteristic_id\' property must be included in the review characteristic']
  }
});

// SCHEMA FOR REVIEW DOCUMENTS
let reviewSchema = mongoose.Schema({
  id: {
    type: Number,
    validate: {
      validator: function(id) { id.isInteger; },
      message: 'The productId value must be an integer'
    }
  },
  product_id: {
    type: Number,
    required: [true, 'A \'productId\' property must be included in the review'],
    validate: {
      validator: function(id) { id.isInteger; },
      message: 'The productId value must be an integer'
    }
  },
  rating: {
    type: Number,
    required: [true, 'A \'rating\' property must be included in the review'],
    min: [1, 'The rating submitted does not fall within the required 1-5 scale'],
    max: [5, 'The rating submitted does not fall within the required 1-5 scale'],
    validate: {
      validator: Number.isInteger,
      message: 'The overall rating submitted must be an integer value'
    }
  },
  date: {
    type: Number,
    default: Date.now(),
    required: true
  },
  summary: {
    type: String,
    maxLength: [60, 'The review summary must not exceed 60 characters']
  },
  body: {
    type: String,
    minLength: [50, 'The review body must be at least 50 characters long'],
    maxLength: [1000, 'The review body must not exceed 1000 characters'],
    required: [true, 'A \'body\' property with a string value must be included in the review']
  },
  recommend: {
    type: Boolean,
    required: [true, 'A \'recommended\' property with a boolean value of \'true\' or \'false\' must be included in the review']
  },
  reported: {
    type: Boolean,
    required: [true, 'A \'reported\' property with a boolean value of \'true\' or \'false\' must be included in the review']
  },
  reviewer_name: {
    type: String,
    required: [true, 'A \'reviewer_name\' property must be included in the review'],
    maxLength: [60, 'The \'reviewer_name\' field must not exceed 60 characters']
  },
  reviewer_email: {
    type: String,
    required: [true, 'A \'reviewer_email\' property must be included in the review'],
    maxLength: [60, 'The \'reviewer_email\' field must not exceed 60 characters'],
    validate: {
      validator: function(email) {
        const acceptablePattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return acceptablePattern.test(email.toLowerCase());
      },
      message: 'The \'reviewerEmail\' value was not valid email address syntax'
    }
  },
  response: String,
  helpfulness: {
    type: Number,
    required: [true, 'A \'helpfulness\' property must be included in the review.  If creating a new review, set \'helpfulness\' property to 0'],
    validate: {
      validator: Number.isInteger,
      message: 'The helpfulness value submitted must be an integer value'
    }
  },
  photos: {
    type: [reviewPhotoSchema]
  },
  characteristic_ratings: {
    type: [reviewCharacteristicSchema],
    required: [true, 'Review must include characteristic ratings']
  }
});

let ReviewCharacteristic = mongoose.model('ReviewCharacteristic', reviewCharacteristicSchema);
let Characteristic = mongoose.model('Characteristic', characteristicSchema);
let ReviewPhoto = mongoose.model('ReviewPhoto', reviewPhotoSchema);
let Review = mongoose.model('Review', reviewSchema);

// FUNCTIONS
export function saveCharacteristic(characteristic) {
  return new Promise((resolve, reject) => {
    Characteristic.exists(characteristic, null, ((err, res) => {
      if (!err && !res) {
        Characteristic.create(characteristic, ((err, res) => {
          if (err) {
            let messages = '';
            for (var x in err.errors) {
              messages = messages += ('- ' + err.errors[x].properties.message + '\n');
            }
            messages = messages.slice(0, messages.length - 1);
            reject('Characteristic did not match validated schema: \n' + messages);
          } else {
            console.log('res._id from successful create: ');
            console.dir(res._id.toString('hex'));
            resolve('Characteristic successfully created');
          }
        }));
      } else if (res) {
        if (!characteristic.productId || !characteristic.name) {
          reject('Characteristic submission must include all required fields (\'productId\' and \'name\')');
        } else {
          reject('Characteristic already existed');
        }
      } else {
        reject('Could not determine if characteristic already exists in database');
      }
    }));
  });
};

export function getCharacteristicName(characteristicId) {
  return new Promise((resolve, reject) => {
    Characteristic.find({ id: mongoose.Types.ObjectId(characteristicId) }, 'name', null, ((err, res) => {
      if (!err) {
        let charName = res[0]['_doc'].name;
        resolve(charName);
      } else {
        reject(err);
      }
    }));
  });
};

export function getReviews(productId, page=1, count=5, sort="relevant") {
  let sortOrders = {
    "relevant": {helpfulness: -1, date: -1},
    "helpful": {helpfulness: -1},
    "newest": {date: -1}
  }

  return new Promise((resolve, reject) => {
    var query = Review.find({product_id: productId, reported: false}).sort(sortOrders[sort]).skip(count * (page - 1)).limit(count);
    query.exec((err, reviews) => {
      if (!err) {



        resolve(reviews);
      } else {
        reject(err);
      }
    })
  })

};

export function getReviewsMeta(productId) {
  return new Promise((resolve, reject) => {
    var query = Review.find({product_id: productId});
    query.exec((err, reviews) => {
      if (!err && reviews.length > 0) {
        let validReviewCount = 0;
        for (var i = 0; i < reviews.length; i++) {
          if (reviews[i].reported === false) {
            validReviewCount++;
          }
        }
        let overallRatings = {'1': 0, '2':0, '3':0, '4':0, '5':0};
        let recommendedCounts = {'false': 0, 'true': 0};
        let characteristics = {};

        if (validReviewCount) {
          for (var i = 0; i < reviews.length; i++) {
            if (reviews[i].reported === false) {
              overallRatings[(reviews[i].rating).toString()]++;
              if (reviews[i].recommend) {
                recommendedCounts['true']++;
              } else {
                recommendedCounts['false']++;
              }
            }
            for (var j = 0; j < reviews[i].characteristic_ratings.length; j++) {
              if (!characteristics[reviews[i].characteristic_ratings[j].characteristic_id]) {
                characteristics[reviews[i].characteristic_ratings[j].characteristic_id] = [reviews[i].characteristic_ratings[j].value]
              } else {
                characteristics[reviews[i].characteristic_ratings[j].characteristic_id].push(reviews[i].characteristic_ratings[j].value)
              }
            }
          }

        } else {
          overallRatings = {};
          recommendedCounts = {};

          for (var i = 0; i < reviews[0].characteristic_ratings.length; i++) {
            characteristics[reviews[0].characteristic_ratings[i].characteristic_id] = null;
          }

        }

        resolve({
          "product_id": productId.toString(),
          "ratings": overallRatings,
          "recommended": recommendedCounts,
          "characteristics_temp": characteristics
        })
      } else if (!err) {
        resolve({
          "product_id": productId.toString(),
          "ratings": {},
          "recommended": {},
          "characteristics_temp": {}
        })
      } else {
        reject(err)
      }
    })
  })
};

export function getCharacteristicsMeta(productId) {
  return new Promise((resolve, reject) => {
    var query = Characteristic.find({product_id: productId});
    let characteristics = {};

    query.exec((err, chars) => {
      if (!err) {
        for (var i = 0; i < chars.length; i++) {
          characteristics[chars[i].name] = {
            id: chars[i]._id
          }
        }

        resolve(characteristics);

      } else {
        reject(err)
      }
    })
  })
};

export function postNewReview(reviewObj) {
  return new Promise((resolve, reject) => {
    let boolConverter = (original) => {
      if (original === 'true' || original === '1' || original === 1 || original === true) {
        return true;
      } else if (original === 'false' || original === '0' || original === 0 || original === false) {
        return false;
      }
    }

    let newReqObj = {
      // product_id: parseInt(reviewObj.product_id),
      product_id: reviewObj.product_id,
      // rating: parseInt(reviewObj.rating),
      rating: reviewObj.rating,
      summary: reviewObj.summary,
      body: reviewObj.body,
      recommend: boolConverter(reviewObj.recommend),
      reported: false,
      reviewer_name: reviewObj.name,
      reviewer_email: reviewObj.email,
      helpfulness: 0,
      characteristic_ratings: [],
      photos: []
    }

    if (reviewObj.photos) {
      // let newPhotosString = reviewObj.photos.replace(/'/g, "\"");
      // for (var i = 0; i < JSON.parse(newPhotosString).length; i++) {
      //   newReqObj.photos.push({url: JSON.parse(newPhotosString)[i]})
      // }
      for (var i = 0; i < reviewObj.photos.length; i++) {
        newReqObj.photos.push({url: reviewObj.photos[i]})
      }
    }

    // let charsObj = JSON.parse(reviewObj.characteristics)

    // for (var x in charsObj) {
    //   newReqObj.characteristic_ratings.push({characteristic_id: mongoose.Types.ObjectId(x), value: charsObj[x]})
    // }
    for (var x in reviewObj.characteristics) {
      newReqObj.characteristic_ratings.push({characteristic_id: mongoose.Types.ObjectId(x), value: reviewObj.characteristics[x]})
    }

    Review.create(newReqObj, (err, res) => {
      if (!err) {
        console.log('inside POST success')
        resolve('Successfully posted review')
      } else {
        console.dir(err);
        console.log('inside POST error')
        reject(err)
      }
    })
  })
};

export function markReviewHelpful(reviewId) {
  return new Promise((resolve, reject) => {
    Review.findByIdAndUpdate(reviewId, { $inc: { helpfulness: 1 } }, (err, res) => {
      if (!err) {
        resolve(res);
      } else {
        reject(err)
      }
    })
  })
};

export function reportReview(reviewId) {
  return new Promise((resolve, reject) => {
    Review.findByIdAndUpdate(reviewId, { reported: true }, (err, res) => {
      if (!err) {
        resolve(res);
      } else {
        reject(err)
      }
    })
  })
};



export default { saveCharacteristic, getCharacteristicName, getReviews, getReviewsMeta, getCharacteristicsMeta, postNewReview, markReviewHelpful, reportReview };