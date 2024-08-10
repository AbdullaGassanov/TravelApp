import express from 'express';

import * as tourController from '../controllers/tourController.js';

const router = express.Router();

/* router.param('id', tourController.checkID); */

console.log(router);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

export { router };
