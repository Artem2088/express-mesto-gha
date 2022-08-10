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

cardRouter.put('/cards/:cardId/likes', validateCardId, likeCard);

cardRouter.delete('/cards/:cardId/likes', validateCardId, dislikeCard);

module.exports = cardRouter;
