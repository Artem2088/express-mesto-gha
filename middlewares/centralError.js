/* eslint-disable no-constant-condition */
/* eslint-disable new-cap */
// const BadRequest = require('../utils/badRequest');
const DocumentNotFound = require('../utils/documentNotFound');
// const DuplicateError = require('../utils/duplicateError');
const ErrorUnauthorized = require('../utils/errorUnauthorized');
const DeleteCard = require('../utils/deleteCard');

module.exports.centralError = (err, req, res, next) => {
// если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

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
