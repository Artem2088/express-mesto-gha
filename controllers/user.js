/* eslint-disable linebreak-style */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const DocumentNotFound = require('../utils/documentNotFound');
const DuplicateError = require('../utils/duplicateError');

// возвращает пользователя
module.exports.getUserMe = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => {
      throw new DocumentNotFound('Данного пользователя не существует!');
    })
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next);
};

// возвращает всех пользователей из базы данных
module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((user) => res.send({ data: user }))
    .catch(next);
};

// создаёт пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    bcrypt
      .hash(password, 10)
      .then((hash) => User.create({
        name,
        about,
        avatar,
        email,
        password: hash, // записываем хеш в базу
      }))
      .then((user) => {
        res.status(201).send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        });
      });
  } catch (err) {
    if (err.code === 11000) {
      next(new DuplicateError('Такой `&(email) уже занят'));
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
    .then((user) => res.send({ data: user }))
    .catch(next);
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
    .then((user) => res.send({ data: user }))
    .catch(next);
};
