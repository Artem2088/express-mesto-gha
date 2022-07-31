const User = require('../models/user');
const DocumentNotFound = require('../utils/documentNotFound');
const IncorrectDate = require('../utils/incorrectDate');

const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  const {userId} = req.params.id
  User.findById(userId)
    .orFail(() => {
      throw new IncorrectDate('Ошибка ввода данных')})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar, new: true, runValidators: true })
    .orFail(() => {
      throw new IncorrectDate('Ошибка ввода данных')})
    .then((newUser) => res.send({ data: newUser }))
    .catch(next);
};

const patchMe = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true, // если пользователь не найден, он будет создан
  })
    .orFail(() => {
      throw new IncorrectDate('Ошибка ввода данных')})
    .then((patchMe) => res.send({ data: patchMe }))
    .catch(next);
};

const patchAvatar = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .orFail(() => {
      throw new IncorrectDate('Ошибка ввода данных')})
    .then((patchAvatar) => res.send({ data: patchAvatar }))
    .catch(next);
};

module.exports = {getUsers, getUserById, createUser, patchMe, patchAvatar};