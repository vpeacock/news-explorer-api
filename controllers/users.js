const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorized-err');
const ConflictError = require('../errors/conflict-err');
const { statusMessages } = require('../settings/messages');

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        data: {
          name: user.name,
          email: user.email,
        },
      });
    })
    .catch((err) => {
      let error;
      if ((err.name === 'MongoError' && err.code === 11000)) {
        error = new ConflictError(statusMessages.userEmailBusy);
        return next(error);
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { JWT_SECRET } = process.env;
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .end(statusMessages.successfulAuthorization);
    })

    .catch((err) => {
      let error;
      if (err.name === 'Error') {
        error = new UnauthorizedError(statusMessages.invalidAuthDataError);
        return next(error);
      }
      return next(err);
    });
};

const getUser = (req, res, next) => {
  console.log();
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send({ name: user.name, email: user.email }))
    .catch(next);
};

module.exports = {
  createUser,
  login,
  getUser,
};
