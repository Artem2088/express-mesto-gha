const Card = require('../models/card');
const { BAD_REQUEST, Document_Not_Found } = require('../utils/error');

const getCards = (req, res) => {
  Card.find({})
    .populate('owner')
    .orFail()
    .then((card) => res.send({ data: card }))
    .catch((err) => BAD_REQUEST(err, req, res));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
    new: true,
    runValidators: true,
  })
    .then((newCard) => res.send({ data: newCard }))
    .catch((err) => BAD_REQUEST(err, req, res));
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .populate('owner')
    .orFail()
    .then((deleteCard) => res.send({ data: deleteCard }))
    .catch((err) => Document_Not_Found(err, req, res));
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .populate('owner')
    .orFail()
    .then((likeCard) => res.send({ data: likeCard }))
    .catch((err) => BAD_REQUEST(err, req, res))
    .catch((err) => Document_Not_Found(err, req, res));
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .populate('owner')
    .orFail()
    .then((dislikeCard) => res.send({ data: dislikeCard }))
    .catch((err) => BAD_REQUEST(err, req, res))
    .catch((err) => Document_Not_Found(err, req, res));
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
