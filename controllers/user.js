const User = require('../models/user');
const { BAD_REQUEST, Document_Not_Found } = require('../utils/error');

module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => BAD_REQUEST(err, req, res));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send({ data: user._id }))
    .catch((err) => Document_Not_Found(err, req, res));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar, new: true, runValidators: true })
    .orFail()
    .then((newUser) => res.send({ data: newUser }))
    .catch((err) => BAD_REQUEST(err, req, res));
};

module.exports.patchMe = (req, res) => {
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

module.exports.patchAvatar = (req, res) => {
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
