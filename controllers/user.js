const User = require('../models/user');
const DocumentNotFound = require('../utils/documentNotFound');

// возвращает всех пользователей из базы данных
const getUsers = (req, res) => {
  User.find()
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

// создаёт пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((newUser) => res.send({ data: newUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некорректные данные' });
      }
    })
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

// возвращает пользователя по переданному _id
const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new DocumentNotFound('Данного пользователя не существует!');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: 'Нет данных по переданному id' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

// обновляет информацию о пользователе
const patchMe = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    }
  )
    .orFail(() => {
      throw new DocumentNotFound('Данного пользователя не существует!');
    })
    .then((patchMe) => res.send({ data: patchMe }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: 'Нет данных по переданному id' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

// обновляет аватар пользователя
const patchAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => {
      throw new DocumentNotFound('Данного пользователя не существует!');
    })
    .then((patchAvatar) => res.send({ data: patchAvatar }))
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: 'Нет данных по переданному id' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
module.exports = { getUsers, getUserById, createUser, patchMe, patchAvatar };
