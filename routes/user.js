const userRouter = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  patchMe,
  patchAvatar,
} = require('../controllers/user');

userRouter.get('/', getUsers);

userRouter.get('/:userId', getUserById);

userRouter.post('/', createUser);

userRouter.patch('/me', patchMe);

userRouter.patch('/me/avatar', patchAvatar);

module.exports = userRouter;
