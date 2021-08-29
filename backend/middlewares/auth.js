const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET } = process.env;

const { UnauthorizedError } = require('./errors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Произошла ошибка авторизации');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new UnauthorizedError('Произошла ошибка авторизации'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};


/*
module.exports = (req, res, next) => {
  // Проверяем, есть ли jwt
  if (!req.cookies.jwt) {
    throw new UnauthorizedError('Произошла ошибка авторизации');
  } else {
    const token = req.cookies.jwt;
    let payload;

    // попытаемся верифицировать токен
    try {
      payload = jwt.verify(token, JWT_SECRET_CODE);
    } catch (err) {
      // отправим ошибку, если не получилось
      next(new UnauthorizedError('Произошла ошибка авторизации'));
    }

    req.user = payload;
    next();
  }
};
*/
