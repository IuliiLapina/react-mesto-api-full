// eslint-disable-next-line import/no-extraneous-dependencies
const { ObjectId } = require('mongodb');

const Card = require('../models/card');
const { NotFoundError, BadRequestError, ForbiddenError } = require('../middlewares/errors');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = ObjectId(req.user._id);

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные карточки');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с таким id не найдена'));
      }

      if (card.owner.toString() === req.user._id) {
        return Card.findByIdAndRemove(req.params.cardId)
          .then((c) => {
            res.send(c);
          });
      }
      return next(new ForbiddenError('Недостаточно прав для действия'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные карточки');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card || !req.user._id) {
        next(new NotFoundError('Карточка с таким id или пользователь не найдены'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные карточки');
      } else {
        next(err);
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card || !req.user._id) {
        throw new NotFoundError('Карточка с таким id или пользователь не найдены');
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные карточки');
      } else {
        next(err);
      }
    })
    .catch((err) => {
      next(err);
    });
};
