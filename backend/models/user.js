/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { UnauthorizedError } = require('../errors/unauthorized-error');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return validator.isURL(v);
      },
      require_protocol: true,
      message: 'Неправильный формат ccылки',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    // чтобы пароль не возвращался при getUsers
    select: false,
  },
});

// Создадем метод, чтобы при создании пользователя не возвращался пароль
function toJSON() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
}
userSchema.methods.toJSON = toJSON;

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные Email или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные Email или пароль');
          }
          return user;
        });
    });
};

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
