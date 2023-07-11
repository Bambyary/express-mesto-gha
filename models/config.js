/* eslint-disable import/no-extraneous-dependencies */
// const crypto = require('crypto');
// console.log(crypto.randomBytes(16).toString('hex'))
const cryptoKey = '48939506643b0980300a1ce0e0704315';
require('dotenv').config();

const { JWT_SECRET = cryptoKey } = process.env;

module.exports = {
  JWT_SECRET,
};
