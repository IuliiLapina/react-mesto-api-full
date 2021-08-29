const { NODE_ENV, JWT_SECRET } = process.env;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// require('dotenv').config();
// const { NODE_ENV, JWT_SECRET } = process.env;
const User = require('../models/user');
const {
  NotFoundError, UnauthorizedError, BadRequestError, ConflictingError,
} = require('../middlewares/errors');

module.exports.createUser = (req, res, next) => {
  // получим из объекта запроса имя и описание пользователя
  const {
    name, about, avatar, email, password,
  } = req.body;

  // Проверим, передали ли данные
  if (!email || !password) {
    next(new BadRequestError('Email или пароль не заполнены'));
  }

  // Проверим, существует ли уже такой пользователь
  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(new ConflictingError('Такой пользователь уже существует'));
      }

      // захешируем пароль
      bcrypt.hash(password, 10)
        .then((hash) =>
          // создадим документ на основе пришедших данных
          // eslint-disable-next-line implicit-arrow-linebreak
          User.create({
            name, about, avatar, email, password: hash,
          })
            // вернём записанные в базу данные
            // eslint-disable-next-line no-shadow
            .then((user) => {
     //         res.status(201).send({ data: user });
              res.status(201).send({ data: user });

            })
            // данные не записались, вернём ошибку
            .catch((err) => {
              if (err.name === 'MongoError' && err.code === 11000) {
                throw new ConflictingError('Пользователь с такой почтой уже существует');
              }
              if (err.name === 'ValidationError' || err.name === 'CastError') {
                throw new BadRequestError('Переданы некорректные данные пользователя');
              } else {
                next(err);
              }
            })
            .catch((error) => next(error)));
    });
};

// контроллер аутентификации
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  // Проверим, передали ли данные
  if (!email || !password) {
    throw new BadRequestError('Email или пароль не заполнены');
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
       { expiresIn: '7d' });
    /*const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === 'production' ? JWT_SECRET
        : 'some-secret-key',
      { expiresIn: '7d' },
    );
    */

      /* res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: true,
        maxAge: 3600000 * 24 * 7,
      }).status(200).send({ token });
      */
     return res.send({ token })
    })
    .catch(() => next(new UnauthorizedError('Произошла ошибка авторизации')));
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((error) => next(error));
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь с данным id не найден'));
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные пользователя');
      } else {
        next(err);
      }
    })
    .catch((error) => next(error));
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с данным id не найден');
      }
      res.send({ data: user });
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные пользователя');
      } else {
        next(error);
      }
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь с данным id не найден'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные пользователя');
      } else {
        next(err);
      }
    })
    .catch((error) => next(error));
};

module.exports.updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь с данным id не найден'));
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные пользователя');
      } else {
        next(err);
      }
    })
    .catch((error) => next(error));
};
