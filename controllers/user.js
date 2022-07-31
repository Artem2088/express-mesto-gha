const User = require('../models/user');
const DocumentNotFound = require('../utils/documentNotFound');
const IncorrectDate = require('../utils/incorrectDate');

// возвращает всех пользователей из базы данных
const getUsers = (req, res) => {
  User.find()
    .orFail(() => {
      throw new IncorrectDate('Ошибка ввода данных');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

// создаёт пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar, new: true, runValidators: true })
    .orFail(() => {
      throw new IncorrectDate('Ошибка ввода данных');
    })
    .then((newUser) => res.send({ data: newUser }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

// возвращает пользователя по переданному _id
const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new DocumentNotFound('Документ не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

// обновляет информацию о пользователе
const patchMe = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true, // если пользователь не найден, он будет создан
  })
    .orFail(() => {
      throw new IncorrectDate('Ошибка ввода данных');
    })
    .then((patchMe) => res.send({ data: patchMe }))
    .catch((err) => {
      throw new DocumentNotFound();
    })
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

// обновляет аватар пользователя
const patchAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .orFail(() => {
      throw new IncorrectDate('Ошибка ввода данных');
    })
    .then((patchAvatar) => res.send({ data: patchAvatar }))
    .catch((err) => {
      throw new DocumentNotFound();
    })
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = { getUsers, getUserById, createUser, patchMe, patchAvatar };
