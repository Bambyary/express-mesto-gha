/* eslint-disable import/no-extraneous-dependencies */
// eslint-disable-next-line no-unused-vars
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { JWT_SECRET } = require('../models/config');
/* eslint-disable import/no-extraneous-dependencies */
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const InternalServerError = require('../errors/InternalServerError');
const NotFound = require('../errors/NotFound');
const Unauthrized = require('../errors/Unauthorized');

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (user) {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET);
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        }).status(200).send({ token });
      }

      throw new Unauthrized('Неправильные почта или пароль');
    })
    .catch(() => {
      next(new Unauthrized('Неправильные почта или пароль'));
    });
};

const getUser = (_req, res, next) => {
  User.find({})
    .then((user) => res.status(200).send({ user }))
    .catch(() => {
      next(new InternalServerError('Внутренняя ошибка сервера.'));
    });
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(200).send({ user }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Передача некорректных данных при поиске пользователя'));
      }

      next(new NotFound('Пользователь в базе данных не найден.'));
    });
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send({
      data: {
        email: user.email, name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
      },
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Передача некорректных данных при поиске пользователя'));
      }

      next(new NotFound('Пользователь в базе данных не найден.'));
    });
};

const createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then(() => res.status(201).send({
      email, name, about, avatar,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Пользователь с таким email уже существует.'));
      }

      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя.'));
      }

      next(new InternalServerError('На сервере произошла ошибка.'));
    });
};

const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(200).send({ user }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении профиля.'));
      }

      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Пользователь с указанным _id не найден.'));
      }

      next(new InternalServerError('На сервере произошла ошибка.'));
    });
};

const updateAvatar = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(200).send({ user }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при обновлении аватара.'));
      }

      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Пользователь с указанным _id не найден.'));
      }

      next(new InternalServerError('На сервере произошла ошибка.'));
    });
};

module.exports = {
  getUser,
  createUser,
  getUserById,
  updateUser,
  updateAvatar,
  login,
  getUserInfo,
};
