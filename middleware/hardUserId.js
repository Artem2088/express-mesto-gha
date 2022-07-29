const userId = (req, res, next) => {
  req.user = {
    _id: '62e152e9d1be851f6eeac5ec', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
};

module.exports = {userId};