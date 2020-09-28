const Article = require('../models/article');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');
const { statusMessages } = require('../settings/messages');

const getArticles = (req, res, next) => {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send({ data: articles }))
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, source, link, image, date,
  } = req.body;
  const owner = req.user._id;

  Article.create({
    keyword, title, text, source, link, image, date, owner,
  })

    .then((article) => {
      res.send({ data: article });
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  Article.findById(articleId)
    .orFail()
    .then((article) => {
      if (!article.owner.equals(req.user._id)) {
        throw new ForbiddenError(statusMessages.forbiddenDeleteArticle);
      }
      Article.deleteOne(article).then(() => res.send({ data: article }));
    })
    .catch((err) => {
      let error;
      if (err.name === 'DocumentNotFoundError') {
        error = new NotFoundError(statusMessages.articleNotFound);
        return next(error);
      }

      return next(err);
    });
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
