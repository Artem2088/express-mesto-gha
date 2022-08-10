/* eslint-disable linebreak-style */
const { celebrate, Joi } = require('celebrate');

const validationGetUserMe = celebrate({
  body: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().required().alphanum().min(8)
      .regex(/'^[a-zA-Z0-9]{3,30}$'/),
  }),
});

const validationCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().alphanum().min(2).max(30),
    about: Joi.string().alphanum().min(2).max(30),
    avatar: Joi.string().regex(/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/i),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).regex(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i),
    password: Joi.string().required().alphanum().min(8)
      .regex(/'^[a-zA-Z0-9]{3,30}$'/),
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
    avatar: Joi.string().regex(/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/i),
  }),
});

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().alphanum().min(2).max(30),
    link: Joi.string().required().regex(/[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/i),
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
