const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  STATUS_200,
} = require('../models/error');

const getUser = (_req, res) => {
  User.find({})
    .then((users) => res.status(STATUS_200).send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера.' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(STATUS_200).send({ data: user }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Передача некорректных данных при поиске пользователя' });
      }

      return res.status(NOT_FOUND).send({ message: 'Пользователь в базе данных не найден.' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(STATUS_200).send({ data: user }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, about: req.body.about },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(STATUS_200).send({ data: user }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

const updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.status(STATUS_200).send({ data: user }))
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Пользователь с указанным _id не найден.' });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports = {
  getUser,
  createUser,
  getUserById,
  updateUser,
  updateAvatar,
};
