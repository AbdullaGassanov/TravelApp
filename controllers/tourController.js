import { Tour } from './../models/tourModel.js';
import { APIFeature } from '../utils/apiFeatures.js';

/// /api/v1/tours/ handlers  of routes

export const aliasTop5Tours = function (req, res, next) {
  req.query.fields = 'name,price,ratingAverage,summary,difficulty';
  req.query.sort = '-ratingAverage,price';
  req.query.limit = 5;

  console.log(req.query);

  next();
};

export const getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({ status: 'Eroor get tours', message: err.message });
  }
};

export const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({ status: 'success created', newTour });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};

/// api/v1/tours/:id/ handlers of  routes

export const getTour = async (req, res) => {
  try {
    const id = req.params.id;
    const tour = await Tour.findOne({ _id: id });
    res.status(200).json({
      status: 'success',
      tour,
    });
  } catch (err) {
    res.status(400).json({ status: 'Error with ID', message: err.message });
  }
};

export const updateTour = async (req, res) => {
  try {
    const updateTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    console.log(updateTour);

    console.log(req.body);

    res.status(202).json({ satus: 'success', data: updateTour });
  } catch (err) {
    res.status(400).json({ status: 'Update Error', message: err.message });
  }
};

export const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({ satus: 'successfuly deleted one tour' });
  } catch (err) {
    res
      .status(400)
      .json({ satus: 'error', message: `Not found ID ${err.message}` });
  }
};

export const getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({ satus: 'Error', message: `${err.message}` });
  }
};

export const getMonthlyPlan = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({ satus: 'Error', message: `${error.message}` });
  }
};
