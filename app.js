/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const userRouter = require('./routes/user');
const cardRouter = require('./routes/card');
const { login, createUser } = require('./controllers/user');
const auth = require('./middlewares/auth');
const { centralError } = require('./middlewares/centralError');
const {
  validationLogin,
  validationCreateUser,
} = require('./middlewares/validation');
const DocumentNotFound = require('./utils/documentNotFound');
const { requestLogger, errorLogger } = require('./middlewares/logger');

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

app.use(requestLogger); // подключаем логгер запросов

app.use(
  cors({
    origin: [
      'https://api.domainname.artemyablonsky.nomoredomains.sbs',
      'https://domainname.artemyablonsky.nomoredomains.sbs',
      'http://domainname.artemyablonsky.nomoredomains.sbs',
      'http://localhost:3001',
      'http://localhost:3000',
    ],
  }),
);

// нужно удалить после ревью!
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', validationCreateUser, createUser);
app.post('/signin', validationLogin, login);

app.use('/', auth, userRouter);
app.use('/', auth, cardRouter);

// обработчик не существующей страницы
app.use('*', auth, (req, res, next) => {
  try {
    next(new DocumentNotFound('Страница не найдена'));
  } catch (err) {
    next(err);
  }
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate
app.use(centralError); // централизованный обработчик

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
