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

    .then((art) => {
      console.log(art);
      res.send({
        _id: art._id, keyword, title, text, source, link, image, date,
      });
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  const { articleId } = req.params;
  Article.findById(articleId)
    .select('+owner')
    .orFail()
    .then((art) => {
      if (!art.owner.equals(req.user._id)) {
        throw new ForbiddenError(statusMessages.forbiddenDeleteArticle);
      }
      Article.deleteOne(art).then(() => res.send({
        _id: art._id,
        keyword: art.keyword,
        title: art.title,
        text: art.text,
        source: art.source,
        link: art.link,
        image: art.image,
        date: art.date,
      }));
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
