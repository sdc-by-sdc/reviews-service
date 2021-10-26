require('dotenv').config();

// MongoDB Implementation
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECTION_STRING);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error: DB connection unsuccessful'));
db.once('open', () => { console.log('Connected to database'); });

// SCHEMA FOR REVIEW PHOTO DOCUMENTS
let reviewPhotoSchema = mongoose.Schema({
  url: {
    type: String,
    required: true
  }
});

// SCHEMA FOR CHARACTERISTIC DOCUMENTS
let characteristicSchema = mongoose.Schema({
  productId: {
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
  characteristicId: {
    type: String,
    required: [true, 'A \'characteristicId\' property must be included in the review characteristic']
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
  }
});

// SCHEMA FOR REVIEW DOCUMENTS
let reviewSchema = mongoose.Schema({
  productId: {
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
  summary: {
    type: String,
    maxLength: [60, 'The review summary must not exceed 60 characters']
  },
  recommended: {
    type: Boolean,
    required: [true, 'A \'recommended\' property with a boolean value must be included in the review']
  },
  response: String,
  body: {
    type: String,
    minLength: [50, 'The review body must be at least 50 characters long'],
    maxLength: [1000, 'The review body must not exceed 1000 characters']
  },
  characteristics: {
    type: [reviewCharacteristicSchema],
    required: [true, 'Review must include characteristic ratings']
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  reviewerName: {
    type: String,
    required: [true, 'A \'reviewerName\' property must be included in the review'],
    maxLength: [60, 'The \'reviewerName\' field must not exceed 60 characters']
  },
  reviewerEmail: {
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
  helpfulness: Number,
  photos: {
    type: [reviewPhotoSchema]
  },
  reported: {
    type: Boolean,
    default: false
  }

});

let ReviewCharacteristic = mongoose.model('ReviewCharacteristic', reviewCharacteristicSchema);
let Characteristic = mongoose.model('Characteristic', characteristicSchema);
let ReviewPhoto = mongoose.model('ReviewPhoto', reviewPhotoSchema);
let Review = mongoose.model('Review', reviewSchema);

// FUNCTIONS
let saveCharacteristic = (characteristic) => {
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

let getCharacteristicName = (characteristicId) => {
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

let postNewReview = (review) => {
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

// module.exports = ReviewCharacteristic;
// module.exports = Characteristic;
// module.exports = ReviewPhoto;
// module.exports = Review;
module.exports.saveCharacteristic = saveCharacteristic;
module.exports.getCharacteristicName = getCharacteristicName;