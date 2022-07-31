const doesUserExist = (req, res, next) => {
  if (!req.user._id) {
    res.send(`Такого пользователя не существует!`);
    return;
  }

  next();
};

module.exports = {doesUserExist};