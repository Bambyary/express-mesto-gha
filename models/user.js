const mongoose = require('mongoose');
const validator = require('validator');
/* eslint-disable import/no-extraneous-dependencies */
const bcrypt = require('bcryptjs');
const { BadRequest } = require('../errors/BadRequest');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    role: {
      type: String,
      default: 'Жак-Ив Кусто',
    },
  },
  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    role: {
      type: String,
      default: 'Исследователь',
    },
  },
  avatar: {
    type: String,
    role: {
      type: String,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    validate: {
      validator(url) {
        if (validator.isURL(url)) {
          return url;
        }

        return 'Передана некорректная ссылка';
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(url) {
        return /https?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#\[\]@!\$&'()*+,;=]*\.(com|net|org|ru)(#.+)?$/.test(url);
      },

      message: 'Передан некорректный email.',
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
  // eslint-disable-next-line consistent-return
    .then((user) => {
      if (!user) {
        throw new BadRequest('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new BadRequest('Неправильные почта или пароль');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
