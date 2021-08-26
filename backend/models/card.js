const mongoose = require('mongoose');
// eslint-disable-next-line prefer-destructuring
const ObjectId = require('mongodb').ObjectId;
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    minlength: 2,
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      require_protocol: true,
      message: 'Неправильный формат ccылки',
    },
  },
  owner: {
    type: ObjectId,
    required: true,
  },
  likes: {
    type: Array,
    required: false,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('card', cardSchema);
