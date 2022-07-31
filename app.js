const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const bodyParser = require('body-parser');
const { doesUserExist } = require('./middleware/middleError');
// const process = require('process');

const { PORT = 3000 } = process.env;

const app = express();

mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .catch((error) => handleError(error));

//Функция глобальной обработки ошибок
//   process.on('uncaughtException', (err, origin) => {
//     console.log(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
//  });

app.use((req, res, next) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use(doesUserExist);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', userRouter);
app.use('/', cardRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
