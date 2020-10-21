require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { errorsHandler } = require('./middlewares/errorsHandler');
const { dbParams } = require('./settings/paramsdb.js');
const config = require('./config.js');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/rateLimiter.js');
const router = require('./routes');

const corsOptions = {
  origin: [
    'http://localhost:8080',
    'https://www.explorernews.tk',
    'https://explorernews.tk',
    'https://vpeacock.github.io/news-explorer-frontend/',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: [
    'Content-Type',
    'origin',
    'x-access-token',
  ],
  credentials: true,
};

const app = express();
app.use('*', cors(corsOptions));

app.use(helmet());
app.use(limiter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(config.DATABASE_URL, dbParams);

app.use(requestLogger);

app.use('/', router);

app.use(errorLogger);
app.use(errors());

app.use(errorsHandler);

app.listen(config.PORT, () => {
  console.log(` (ツ) App listening on port ${config.PORT}`);
});
