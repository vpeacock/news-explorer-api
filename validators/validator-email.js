const validator = require('validator');
const BadRequestError = require('../errors/bad-request-err');
const { statusMessages } = require('../settings/messages');

module.exports.validatorEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw new BadRequestError(statusMessages.invalidEmailFormat);
  }
  return email;
};
