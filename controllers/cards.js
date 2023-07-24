const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const NotFound = require('../errors/NotFound');

const getCards = (_req, res, next) => {
  Card.find({})
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные при создании карточки.'));
      }

      return next(err);
    });
};

// eslint-disable-next-line consistent-return
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        return next(new NotFound('Карточка с указанным _id не найдена.'));
      }

      if (req.user._id !== card.owner.toString()) {
        return next(new Forbidden('Вы не можете удалить чужую карточку.'));
      }

      Card.deleteOne(card).then(() => res.status(200).send({ card }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Карточка с указанным _id не найдена.'));
      }
      return next(err);
    });
};

const addCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // чтобы добавить элемент в массив, если его там ещё нет
    { new: true },
  )
    .orFail()
    .then((like) => res.status(201).send({ data: like }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFound('Переданы некорректные данные.'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequest('Передан несуществующий _id карточки. '));
      }
      return next(err);
    });
};

const deleteCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // чтобы удалить элемент из массива, если он там уже есть
    { new: true },
  )
    .orFail()
    .then((like) => res.status(200).send({ data: like }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFound('Переданы некорректные данные.'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequest('Передан несуществующий _id карточки. '));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addCardLike,
  deleteCardLike,
};
