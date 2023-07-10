const Card = require('../models/card');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  STATUS_200,
} = require('../models/error');

const getCards = (_req, res) => {
  Card.find({})
    .then((card) => res.status(STATUS_200).send({ data: card }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(STATUS_200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании карточки.' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

// eslint-disable-next-line consistent-return
const deleteCard = (req, res) => {
  if (req.params.cardId === undefined || req.params.cardId === null || !req.params.cardId) {
    return res.status(NOT_FOUND).send({ message: 'Введён несуществующий _id.' });
  }

  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.status(STATUS_200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Карточка с указанным _id не найдена.' });
      }

      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

const addCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // чтобы добавить элемент в массив, если его там ещё нет
    { new: true },
  )
    .orFail()
    .then((like) => res.status(STATUS_200).send({ data: like }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Переданы некорректные данные.' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Передан несуществующий _id карточки. ' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

const deleteCardLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // чтобы удалить элемент из массива, если он там уже есть
    { new: true },
  )
    .orFail()
    .then((like) => res.status(STATUS_200).send({ data: like }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: 'Переданы некорректные данные.' });
      }
      if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: 'Передан несуществующий _id карточки. ' });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка.' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addCardLike,
  deleteCardLike,
};
