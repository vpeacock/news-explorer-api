const router = require('express').Router();
const { celebrate } = require('celebrate');
const userRouter = require('./users');
const articleRouter = require('./articles');
const auth = require('../middlewares/auth');
const { signinValidation, signupValidation } = require('../settings/validation_options.js');
const { login, createUser } = require('../controllers/users');
const NotFoundError = require('../errors/not-found-err');
const { statusMessages } = require('../settings/messages');

router.post('/signup', celebrate(signupValidation), createUser);
router.post('/signin', celebrate(signinValidation), login);

router.use(auth);
router.use('/users', userRouter);
router.use('/articles', articleRouter);
router.use((req, res, next) => next(new NotFoundError(statusMessages.resourseNotFound)));

module.exports = router;
