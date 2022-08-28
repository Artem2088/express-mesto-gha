/* eslint-disable linebreak-style */
const Card = require('../models/card');
const DeleteCard = require('../utils/deleteCard');
const DocumentNotFound = require('../utils/documentNotFound');
const BadRequest = require('../utils/badRequest');

// возвращает все карточки из базы данных
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

// создает новую карточку по переданным параметрам.
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((newCard) => res.send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

// удаляет карточку по _id
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => {
      throw new DocumentNotFound('Такой карточки не существует!');
    })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new DeleteCard('Нет прав на удаление чужой карточки'));
      }
      return card
        .remove()
        .then(() => res.send({ message: 'Карточка удалена успешно' }));
    })
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
    .then((card) => res.send(card))
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
    .then((card) => res.send(card))
    .catch(next);
};
