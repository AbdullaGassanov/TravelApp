import url from 'url';
import { Tour } from './../models/tourModel.js';
import { clear } from 'console';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

/// /api/v1/tours/ handlers  of routes

export const getAllTours = async (req, res) => {
  try {
    /// Build Query

    // 1A) Filtering

    const queryObj = Object.assign({}, req.query);
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryObj[field]);

    // 1B) Advanced filtering

    let queryString = JSON.stringify(queryObj);

    queryString = JSON.parse(
      queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`),
    );

    let coreQuery = Tour.find(queryString).sort(queryObj);

    // 2) Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      coreQuery.sort(sortBy);
    } else {
      coreQuery = coreQuery.sort('-createdAt');
    }

    console.log(coreQuery.options);

    /// Execute Query
    const allTours = await coreQuery;

    /// Send Response
    res.status(200).json({
      results: allTours.length,
      status: 'success',
      data: allTours,
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
