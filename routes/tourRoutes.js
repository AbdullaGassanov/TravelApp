import express from 'express';
import * as authController from '../controllers/authController.js';
import * as tourController from '../controllers/tourController.js';

const router = express.Router();

/* router.param('id', tourController.checkID); */

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

export { router };
