const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
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
  about: {
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
  avatar: {
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
});

module.exports = mongoose.model('user', userSchema);
