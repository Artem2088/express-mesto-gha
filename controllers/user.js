const User = require('../models/user');
const { BAD_REQUEST, Document_Not_Found } = require('../utils/error');

const getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => BAD_REQUEST(err, req, res));
};

const getUserById = (req, res) => {
  const {userId} = req.params
  User.findById(userId)
    .orFail(() => Error('Ошибка'))
    .then((user) => res.send({ data: user }))
    .catch((err) => Document_Not_Found(err, req, res));
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar, new: true, runValidators: true })
    .orFail()
    .then((newUser) => res.send({ data: newUser }))
    .catch((err) => BAD_REQUEST(err, req, res));
};

const patchMe = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: true, // если пользователь не найден, он будет создан
  })
    .orFail()
    .then((patchMe) => res.send({ data: patchMe }))
    .catch((err) => BAD_REQUEST(err, req, res))
    .catch((err) => Document_Not_Found(err, req, res));
};

const patchAvatar = (req, res) => {
  User.findByIdAndUpdate(req.user._id, {
    new: true,
    runValidators: true,
    upsert: true,
  })
    .orFail()
    .then((patchAvatar) => res.send({ data: patchAvatar }))
    .catch((err) => BAD_REQUEST(err, req, res))
    .catch((err) => Document_Not_Found(err, req, res));
};

module.exports = {getUsers, getUserById, createUser, patchMe, patchAvatar};