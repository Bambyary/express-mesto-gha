const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const InternalServerError = require('../errors/InternalServerError');
const NotFound = require('../errors/NotFound');

const getCards = (_req, res, next) => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(() => {
      next(new InternalServerError('На сервере произошла ошибка.'));
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const userId = req.user._id;

  Card.create({ name, link, owner: userId })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки.'));
      }
      next(new InternalServerError('На сервере произошла ошибка.'));
    });
};

// eslint-disable-next-line consistent-return
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка с указанным _id не найдена.');
      }

      if (req.user._id !== card.owner.toString()) {
        throw new Forbidden('Вы не можете удалить чужую карточку.');
      }

      Card.findByIdAndRemove(req.params.cardId).then((data) => res.send({ data }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Карточка с указанным _id не найдена.'));
      }

      next(new InternalServerError('На сервере произошла ошибка.'));
    });
};

const addCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // чтобы добавить элемент в массив, если его там ещё нет
    { new: true },
  )
    .orFail()
    .then((like) => res.send({ data: like }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Переданы некорректные данные.'));
      }
      if (err.name === 'CastError') {
        next(new BadRequest('Передан несуществующий _id карточки. '));
      }
      next(new InternalServerError('На сервере произошла ошибка.'));
    });
};

const deleteCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // чтобы удалить элемент из массива, если он там уже есть
    { new: true },
  )
    .orFail()
    .then((like) => res.send({ data: like }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Переданы некорректные данные.'));
      }
      if (err.name === 'CastError') {
        next(new BadRequest('Передан несуществующий _id карточки. '));
      }
      next(new InternalServerError('На сервере произошла ошибка.'));
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  addCardLike,
  deleteCardLike,
};
