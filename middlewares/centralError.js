/* eslint-disable no-constant-condition */
/* eslint-disable new-cap */
const BadRequest = require('../utils/badRequest');
const DocumentNotFound = require('../utils/documentNotFound');
const DuplicateError = require('../utils/duplicateError');
const ErrorUnauthorized = require('../utils/errorUnauthorized');
const DeleteCard = require('../utils/deleteCard');

module.exports.centralError = (err, req, res, next) => {
// если у ошибки нет статуса, выставляем 500
  let { statusCode = 500, message } = err;

  if (statusCode === 404) {
    ({ statusCode, message } = new DocumentNotFound('Нет данных по переданному id'));
  } else if (err.name === 'CastError' || 'ValidationError') {
    ({ statusCode, message } = new BadRequest('Невалидный id'));
  } else if (statusCode === 409) {
    ({ statusCode, message } = new DuplicateError('Пользователь с таким _id уже существует'));
  } else if (statusCode === 401) {
    ({ statusCode, message } = new ErrorUnauthorized('Ошибка авторизации'));
  } else if (statusCode === 403) {
    ({ statusCode, message } = new DeleteCard('Ошибка авторизации'));
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
