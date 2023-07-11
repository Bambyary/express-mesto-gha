const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(url) {
        return /https?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#\[\]@!\$&'()*+,;=]*\.(com|net|org|ru)(#.+)?$/.test(url);
      },

      message: 'Передана некорректная ссылка',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  createAt: {
    type: Date,
    default: Date.now,
    validate: {
      validator(date) {
        if (validator.isDate(date)) {
          return date;
        }

        return 'Не удалось определить дату.';
      },
    },
  },
});

module.exports = mongoose.model('card', cardSchema);
