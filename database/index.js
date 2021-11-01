import dotenv from 'dotenv';
dotenv.config();

// MongoDB Implementation
import mongoose from 'mongoose';
mongoose.connect(process.env.DB_CONNECTION_STRING);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error: DB connection unsuccessful'));
db.once('open', () => { console.log('Connected to database'); });

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
    required: [true, 'A \'characteristicId\' property must be included in the review characteristic']
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
    required: [true, 'A \'reviewerName\' property must be included in the review'],
    maxLength: [60, 'The \'reviewerName\' field must not exceed 60 characters']
  },
  reviewer_email: {
    type: String,
    required: [true, 'A \'reviewerEmail\' property must be included in the review'],
    maxLength: [60, 'The \'reviewerEmail\' field must not exceed 60 characters'],
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

export function postNewReview(review) {
  let newCharacteristics = [];
  for (var x in review.characteristics) {
    newCharacteristics.push(new ReviewCharacteristic({[x]: [review.characteristics[x]]}));
  }
  let newPhotos = [];
  for (i = 0; i < review.photos.length; i++) {
    newPhotos.push(new ReviewPhoto({'url': review.photos[i]}));
  }
  return new Promise((resolve, reject) => {
    Review.create({});
  });

};

export function getReviews(productId) {

  return new Promise((resolve, reject) => {
    Review.find({product_id: productId}, (err, reviews) => {
      if (!err) {
        resolve(reviews);
      } else {
        reject(err);
      }
    })
  })

}

export default { saveCharacteristic, getCharacteristicName, getReviews };