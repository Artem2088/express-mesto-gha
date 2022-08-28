const cardRouter = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');
const {
  validationCreateCard,
  validateCardId,
} = require('../middlewares/validation');

cardRouter.get('/cards', getCards);

cardRouter.post('/cards', validationCreateCard, createCard);

cardRouter.delete('/cards/:cardId', validateCardId, deleteCard);

cardRouter.put('/cards/likes/:cardId', validateCardId, likeCard);

cardRouter.delete('/cards/likes/:cardId', validateCardId, dislikeCard);

module.exports = cardRouter;
