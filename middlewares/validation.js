/* eslint-disable linebreak-style */
const { celebrate, Joi } = require('celebrate');
const { RegExp } = require('../helpers/regex');

const validationGetUserMe = celebrate({
  body: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().alphanum().min(8),
  }),
});

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(RegExp),
    email: Joi.string().required().email(),
    password: Joi.string().required().alphanum().min(8),
  }),
});

const validationGetUserById = celebrate({
  body: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

const validationPatchMe = celebrate({
  body: Joi.object().keys({
    name: Joi.string().alphanum().min(2).max(30),
    about: Joi.string().alphanum().min(2).max(30),
  }),
});

const validationPatchAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(RegExp),
  }),
});

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().required().regex(RegExp),
  }),
});

const validateCardId = celebrate({
  body: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validationGetUserMe,
  validationLogin,
  validationCreateUser,
  validationGetUserById,
  validationPatchMe,
  validationPatchAvatar,
  validationCreateCard,
  validateCardId,
};