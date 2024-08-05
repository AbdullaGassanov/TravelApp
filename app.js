import express from 'express';
import morgan from 'morgan';
import { router as tourRouter } from './routes/tourRoutes.js';
import { router as userRouter } from './routes/userRoutes.js';

export const app = express();

// 1) Middlewares
app.use(morgan('dev'));

app.use(express.json()); /// Json Middleware

app.use((req, res, next) => {
  console.log(`Hello from the middleware 😁`);
  next();
});

app.use((r, res, next) => {
  r.requestTime = new Date().toISOString();
  next();
});

/// All http methods

app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
