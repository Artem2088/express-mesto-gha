/* eslint-disable no-constant-condition */
/* eslint-disable new-cap */
const badRequest = require('../utils/badRequest');
const documentNotFound = require('../utils/documentNotFound');
const duplicateError = require('../utils/duplicateError');
const errorUnauthorized = require('../utils/errorUnauthorized');

module.exports.centralError = (err, req, res, next) => {
// если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  if (err.statusCode === 404) {
    throw new documentNotFound('Нет данных по переданному id');
  } else if (err.name === 'CastError' || 'ValidationError') {
    throw new badRequest('Невалидный id');
  } else if (err.statusCode === 409) {
    throw new duplicateError('Пользователь с таким _id уже существует');
  } else if (err.statusCode === 401) {
    throw new errorUnauthorized('Ошибка авторизации');
  }

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
};
