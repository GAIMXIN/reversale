import 'dotenv/config';
import './config/validateEnv';

import express, { Application } from 'express';
import httpErrors from 'http-errors';

import appConfig from './config/app.config';
import apiRouter from './routes/index.router';
import globalErrorHandler from './middlewares/globalErrorHandler.middleware';
import morgan from 'morgan';
import cors from 'cors';

const app: Application = express();
app.use(morgan('tiny'));
app.use(express.json());
app.use(cors());

app.use(appConfig.API_PREFIX, apiRouter);

app.use((req, res, next) => {
  next(httpErrors.NotFound(`Resource not found: ${req.originalUrl}`));
});

app.use(globalErrorHandler);

app.listen(appConfig.PORT, () => {
  console.log(`Server has been started on ${appConfig.PORT} in ${appConfig.NODE_ENV} mode`);
});
