module.exports = class Conflict extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
};
