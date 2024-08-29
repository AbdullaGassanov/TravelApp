import express from 'express';
import morgan from 'morgan';
import { router as tourRouter } from './routes/tourRoutes.js';
import { router as userRouter } from './routes/userRoutes.js';
import url from 'url';
import { configDotenv } from 'dotenv';
import { AppError } from './utils/appError.js';
import { errFunc } from './controllers/errorController.js';

configDotenv();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const app = express();

// 1) Middlewares

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); /// Json Middleware
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.status(200).sendFile(`${__dirname}/public/overview.html`);
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2) Routes

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.all('*', (req, res, next) => {
  /* const err = new Error(`Can't find ${req.originalUrl} path`);
  err.status = 'fail';
  err.statusCode = 404; */

  next(new AppError(`Can't find ${req.originalUrl} path`, 404));
});

// Error handling middleware

app.use(errFunc);

export { app };

/* app.use((req, res, next) => {
  console.log(`Hello from the middleware 😁`);
  next();
}); */
