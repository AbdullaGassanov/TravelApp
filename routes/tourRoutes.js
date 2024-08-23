import express from 'express';

import * as tourController from '../controllers/tourController.js';

const router = express.Router();

/* router.param('id', tourController.checkID); */

<<<<<<< HEAD
router.route('/tours-stats').get(tourController.getTourStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTop5Tours, tourController.getAllTours);
=======
console.log(router);
>>>>>>> 12906eaa2f0a383f080e73a2138dfb4b17b32f37

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
