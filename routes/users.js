const router = require('express').Router();
const {
  getUser,
  getUserById,
  updateUser,
  updateAvatar,
  getUserInfo,
} = require('../controllers/users');
// eslint-disable-next-line import/order, import/no-extraneous-dependencies
const { celebrate, Joi } = require('celebrate');

router.get('/users', getUser);
router.get('/users/me', getUserInfo);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex(),
  }),
}), getUserById);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[a-zA-Z0-9-._~:/?#\[\]@!\$&'()*+,;=]*\.(com|net|org|ru|png)(#.+)?$/),
  }),
}), updateAvatar);

module.exports = router;
