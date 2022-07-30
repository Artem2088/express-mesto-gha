const userRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  patchMe,
  patchAvatar,
} = require('../controllers/user');

userRouter.get('/users', getUsers);

userRouter.get('/users/:userId', getUserById);

userRouter.post('/users', createUser);

userRouter.patch('/users/me', patchMe);

userRouter.patch('/users/me/avatar', patchAvatar);

module.exports = userRouter;
