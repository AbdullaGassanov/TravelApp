import { Tour } from './../models/tourModel.js';
import { APIFeature } from '../utils/apiFeatures.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';

/// /api/v1/tours/ handlers  of routes

export const aliasTop5Tours = function (req, res, next) {
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  req.query.sort = '-ratingAverage,price';
  req.query.limit = 5;

  console.log(req.query);

  next();
};

export const getAllTours = catchAsync(async (req, res, next) => {
  /// Execute Query
  const features = new APIFeature(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  /// Send Response
  res.status(200).json({
    results: tours.length,
    status: 'success',
    data: tours,
  });
});

export const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({ status: 'success created', newTour });
});

/// api/v1/tours/:id/ handlers of  routes

export const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with this id', 404));
  }

  res.status(200).json({
    status: 'success',
    tour,
  });
});

export const updateTour = catchAsync(async (req, res, next) => {
  const updateTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updateTour) {
    return next(new AppError('No tour found with this id', 404));
  }

  console.log(updateTour);

  console.log(req.body);

  res.status(202).json({ satus: 'success', data: updateTour });
});

export const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with this id', 404));
  }

  res.status(204).json({ satus: 'successfuly deleted one tour' });
});

export const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingQuantity' },
        avgRating: { $avg: '$ratingAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    /* {
        $match: { _id: { $ne: 'EASY' } },
      }, */
  ]);
  res.status(200).json({ satus: 'successfuly', data: { stats } });
});

export const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = +req.params.year;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: `$startDates`,
        },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: `$_id` },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res
    .status(200)
    .json({ length: plan.length, satus: 'successfuly', data: { plan } });
});
