const Card = require('../models/card');
const DocumentNotFound = require('../utils/documentNotFound');

// возвращает все карточки из базы данных
const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

// создает новую карточку по переданным параметрам.
const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((newCard) => res.send(newCard))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некорректные данные' });
      }
    })
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

// удаляет карточку по _id
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new DocumentNotFound('Такой карточки не существует!');
    })
    .then((deleteCard) => res.send({ data: deleteCard }))
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

// добавляет лайк карточке.
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(() => {
      throw new DocumentNotFound('Такой карточки не существует!');
    })
    .then((likeCard) => res.send({ data: likeCard }))
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

// запрос удаляет лайк с карточки.
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true }
  )
    .orFail(() => {
      throw new DocumentNotFound('Такой карточки не существует!');
    })
    .then((dislikeCard) => res.send({ data: dislikeCard }))
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

module.exports = { getCards, createCard, deleteCard, likeCard, dislikeCard };
