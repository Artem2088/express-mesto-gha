/* eslint-disable linebreak-style */
/* eslint-disable no-console */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');
const { centralError } = require('./middlewares/centralError');
const { validationLogin, validationCreateUser } = require('./middlewares/validation');

const { PORT = 3000 } = process.env;

const app = express();

mongoose
  .connect('mongodb://localhost:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .catch((err, res) => {
    res.status(err.status);
    res.json({
      status: err.status,
      message: err.message,
      stack: err.stack,
    });
  });

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', validationLogin, login);
app.post('/signup', validationCreateUser, createUser);

app.use('/', auth, userRouter);
app.use('/', auth, cardRouter);

// обработчик не существующей страницы
app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

app.use(centralError); // централизованный обработчик
app.use(errors()); // обработчик ошибок celebrate

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
