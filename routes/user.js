const userRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  patchMe,
  patchAvatar,
  getUserMe,
} = require('../controllers/user');
const {
  validationGetUserMe,
  validationGetUserById,
  validationPatchMe,
  validationPatchAvatar,
} = require('../middlewares/validation');

userRouter.get('/users', getUsers);

userRouter.get('/users/:userId', validationGetUserById, getUserById);

userRouter.get('/users/me', validationGetUserMe, getUserMe);

userRouter.patch('/users/me', validationPatchMe, patchMe);

userRouter.patch('/users/me/avatar', validationPatchAvatar, patchAvatar);

module.exports = userRouter;
