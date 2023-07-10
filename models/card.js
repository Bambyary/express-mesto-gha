const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true,
    validate: {
      validator(v) {
        if (v > 2 && v < 30) {
          return v;
        }
        return 'Строка должна содержать от 2 до 30 символов.';
      },
    },
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(url) {
        if (validator.isURL(url)) {
          return url;
        }

        return 'Передана некорректная ссылка';
      },
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
