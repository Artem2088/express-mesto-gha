const Card = require('../models/card');
const DocumentNotFound = require('../utils/documentNotFound');
const IncorrectDate = require('../utils/incorrectDate');

// возвращает все карточки из базы данных
const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

// создает новую карточку по переданным параметрам.
const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      throw new IncorrectDate('Ошибка ввода данных');
    })
    .then((newCard) => res.send(newCard))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

// удаляет карточку по _id
const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => {
      throw new DocumentNotFound('Такой карточки не существует!');
    })
    .then((deleteCard) => res.send({ data: deleteCard }))
    .catch(next);
};

// добавляет лайк карточке.
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true }
  )
    .orFail(() => {
      throw new IncorrectDate('Некорректные данные');
    })
    .then((likeCard) => res.send({ data: likeCard }))
    .catch((err) => {
      throw new DocumentNotFound();
    })
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

// запрос удаляет лайк с карточки.
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .orFail(() => {
      throw new IncorrectDate('Некорректные данные');
    })
    .then((dislikeCard) => res.send({ data: dislikeCard }))
    .catch((err) => {
      throw new DocumentNotFound();
    })
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
