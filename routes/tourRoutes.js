import express from 'express';

import {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} from '../controllers/tourController.js';

const router = express.Router();

router.param('id', (req, res, next, val) => {
  console.log(`Tour id is ${val}`);

  next();
});

router.route('/').get(getAllTours).post(createTour);
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export { router };
