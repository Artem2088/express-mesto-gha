/* eslint-disable linebreak-style */
const Card = require('../models/card');
const DeleteCard = require('../utils/deleteCard');
const DocumentNotFound = require('../utils/documentNotFound');

// возвращает все карточки из базы данных
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

// создает новую карточку по переданным параметрам.
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  try {
    Card.create({
      name,
      link,
      owner: req.user._id,
    })
      .then((newCard) => res.send(newCard));
  } catch (err) {
    next(err);
  }
};

// удаляет карточку по _id
module.exports.deleteCard = (req, res, next) => {
  const owner = req.user._id;
  if (!owner === req.user._id) {
    throw new DeleteCard('Нет прав удалять чужие карточки!');
  }
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new DocumentNotFound('Такой карточки не существует!');
    })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

// добавляет лайк карточке.
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new DocumentNotFound('Такой карточки не существует!');
    })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

// запрос удаляет лайк с карточки.
module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .orFail(() => {
      throw new DocumentNotFound('Такой карточки не существует!');
    })
    .then((card) => res.send({ data: card }))
    .catch(next);
};
