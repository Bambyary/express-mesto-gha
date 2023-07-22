/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../models/config');

const Unauthorized = require('../errors/Unauthorized');

module.exports.auth = (req, _res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return next(new Unauthorized('Неправильные почта или пароль.'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new Unauthorized('Неправильные почта или пароль.'));
  }

  req.user = payload;
  return next();
};
