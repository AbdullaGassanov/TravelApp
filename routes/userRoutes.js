import express from 'express';
import * as tourController from '../controllers/userController.js';

const router = express.Router();

router.param('id', (req, res, next, val) => {
  console.log(`User id is ${val}`);
  next();
});

router
  .route('/')
  .get(tourController.getAllUsers)
  .post(tourController.createUser);
router
  .route('/:id')
  .get(tourController.getUser)
  .patch(tourController.updateUser)
  .delete(tourController.deleteUser);

export { router };
