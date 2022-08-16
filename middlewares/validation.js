const { celebrate, Joi } = require('celebrate');
const { RegExp } = require('../helpers/regex');

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(RegExp),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validationGetUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

const validationPatchMe = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validationPatchAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(RegExp),
  }),
});

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(RegExp),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validationLogin,
  validationCreateUser,
  validationGetUserById,
  validationPatchMe,
  validationPatchAvatar,
  validationCreateCard,
  validateCardId,
};
