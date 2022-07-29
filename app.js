const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const bodyParser = require('body-parser');
const { doesUserExist } = require('./middleware/middleError');
const { userId } = require('./middleware/hardUserId');
const { Internal_Server_Error } = require('./utils/error');
const process = require('process');

const { PORT = 3000 } = process.env;

const app = express();

mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .catch((error) => handleError(error));

  process.on('uncaughtException', (err, origin) => {
    console.err(`${origin} ${err.name} c текстом ${err.message} не была обработана. Обратите внимание!`);
 });

app.use(userId);
app.use(doesUserExist);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', userRouter);
app.use('/cards', cardRouter);
//Функция промежуточной обработки ошибок
app.use(Internal_Server_Error);


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
