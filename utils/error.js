const BAD_REQUEST = (err, req, res) => {
  if (err.name === 'CastError') {
    res.status(400).send({ message: 'Переданые не корректные данные' });
    return;
  }
};

const Document_Not_Found = (err, req, res) => {
  if (err.name === 'DocumentNotFoundError') {
    res.status(404).send({ message: 'Объект не найден' });
    return;
  }
};

const Internal_Server_Error = (err, req, res, next) => {
  if(res.status === 500) {
  console.error(err.stack);
  res.status(500).send({ message: 'На сервере произошла ошибка' });
  return
}
};

module.exports = { BAD_REQUEST, Document_Not_Found, Internal_Server_Error };
