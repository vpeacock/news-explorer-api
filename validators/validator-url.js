const validator = require('validator');
const BadRequestError = require('../errors/bad-request-err');
const { statusMessages } = require('../settings/messages');

module.exports.validatorUrl = (link) => {
  if (!validator.isURL(link)) {
    throw new BadRequestError(statusMessages.invalidUrlFormat(link));
  }
  return link;
};
