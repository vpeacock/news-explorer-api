const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);
const { articleValidation } = require('../settings/validation_options');

const {
  getArticles,
  createArticle,
  deleteArticle,

} = require('../controllers/articles');

router.get('/', getArticles);

router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.objectId(),
  }),
}), deleteArticle);

router.post('/', celebrate(articleValidation), createArticle);

module.exports = router;
