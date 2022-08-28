/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const DocumentNotFound = require('../utils/documentNotFound');
const DuplicateError = require('../utils/duplicateError');
const ErrorUnauthorized = require('../utils/errorUnauthorized');
const BadRequest = require('../utils/badRequest');

// возвращает пользователя
module.exports.getUserMe = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new DocumentNotFound('Данного пользователя не существует!'));
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.send({ token, message: 'Успешная авторизация' });
    })
    .catch((err) => {
      if (err.code === 401) {
        next(new ErrorUnauthorized(err.message));
      } else {
        next(err);
      }
    });
};

// возвращает всех пользователей из базы данных
module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// создаёт пользователя
module.exports.createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash, // записываем хеш в базу
    });
    res.send({
      user: {
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    });
  } catch (err) {
    if (err.code === 11000) {
      next(
        new DuplicateError('Пользователь с таким `$(email)` уже существует'),
      );
    } else if (err.name === 'ValidationError') {
      next(
        new BadRequest(
          `${Object.values(err.errors)
            .map((error) => error.message)
            .join(', ')}`,
        ),
      );
    } else {
      next(err);
    }
  }
};

// возвращает пользователя по переданному _id
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new DocumentNotFound('Данного пользователя не существует!');
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// обновляет информацию о пользователе
module.exports.patchMe = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(() => {
      throw new DocumentNotFound('Данного пользователя не существует!');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

// обновляет аватар пользователя
module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new DocumentNotFound('Данного пользователя не существует!');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};
