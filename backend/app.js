// require('dotenv').config();
const express = require('express');
// eslint-disable-next-line import/no-unresolved
const cors = require('cors');
// eslint-disable-next-line import/no-unresolved
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');

const { login } = require('./controllers/users');
const { createUser } = require('./controllers/users');

const auth = require('./middlewares/auth');
const { NotFoundError, BadRequestError } = require('./middlewares/errors');
const { requestLogger } = require('./middlewares/logger');
const { errorLogger } = require('./middlewares/logger');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const corsOptions = {
  origin: [
    'https://mesto.iapina.nomoredomains.club',
    'http://mesto.iapina.nomoredomains.club',
    'http://178.154.246.154',
    'http://localhost:3000',
  ],
  credentials: true,
};

app.use(cors(corsOptions));

// app.options('*', cors());
/*
const allowedCors = [
  'https://mesto.iapina.nomoredomains.club',
  'http://mesto.iapina.nomoredomains.club',
  'http://178.154.246.154',
  'http://localhost:3000',
]
app.use((req, res, next) => {
  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
  }

  const { method } = req; // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = "GET,HEAD,PUT,PATCH,POST,DELETE";
  // сохраняем список заголовков исходного запроса
  const requestHeaders = req.headers['access-control-request-headers'];
  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }
  next();
});
*/
// app.use(cors());

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
// логгер запросов
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().min(2),
    // avatar: Joi.string().min(2).pattern(/(https?:\/\/)(w{3}\.)?(((\d{1,3}\.){3}\d{1,3})|((\w-?)+\.(ru|com)))(:\d{2,5})?((\/.+)+)?\/?#?/),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  }),
}), login);

// авторизация
app.use(auth);
// все что ниже - закрыто авторизацией

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.get('*', (() => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
}));

// логгер ошибок
app.use(errorLogger);
app.use(errors()); // обработчик ошибок celebrate

// централизованный обработчик ошибок
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (err.kind === 'ObjectId') {
    throw new BadRequestError('Переданы некорректные данные');
  } else {
    res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  }
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
