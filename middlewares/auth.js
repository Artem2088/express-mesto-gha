require('dotenv').config();
const jwt = require('jsonwebtoken');
const ErrorUnauthorized = require('../utils/errorUnauthorized');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  const { NODE_ENV, JWT_SECRET } = process.env;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new ErrorUnauthorized('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
    );
  } catch (err) {
    next(new ErrorUnauthorized('Необходима авторизация'));
  }
  req.user = payload;

  next();
};
