const jwt = require('jsonwebtoken');

const JWT_SECRET_CODE = '42-ponchikaNaLune';
const { UnauthorizedError } = require('./errors');

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
