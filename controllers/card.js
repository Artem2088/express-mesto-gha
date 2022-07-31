const Card = require('../models/card');
const DocumentNotFound = require('../utils/documentNotFound');
const IncorrectDate = require('../utils/incorrectDate');


const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
    new: true,
    runValidators: true
  }).orFail(() => {
    throw new IncorrectDate('Ошибка ввода данных')
  })
    .then((newCard) => res.send(newCard))
    .catch(next);
};


const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
  .orFail(() => {
    throw new DocumentNotFound('Такой карточки не существует!')
  })
    .then((deleteCard) => res.send({ data: deleteCard }))
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .orFail(() => {
      throw new DocumentNotFound('Такой карточки не существует!')
    })
    .then((likeCard) => res.send({ data: likeCard }))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .orFail(() => {
      throw new DocumentNotFound('Такой карточки не существует!')
    })
    .then((dislikeCard) => res.send({ data: dislikeCard }))
    .catch(next);
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
