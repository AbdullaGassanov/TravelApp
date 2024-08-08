import url from 'url';
import { Tour } from './../models/tourModel.js';
import { clear } from 'console';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const getAllTours = async (req, res) => {
  try {
    const allTours = await Tour.find();
    res.status(200).json({
      status: 'success',
      data: allTours,
    });
  } catch (err) {
    res.status(400).json({ status: 'Eroor get tours', message: err.message });
  }
};

export const getTour = async (req, res) => {
  try {
    const id = req.params.id;

    const tour = await Tour.findOne({ _id: id });

    console.log(tour);

    res.status(200).json({
      status: 'success',
      tour,
    });

    /*  res.status(200).json({
      status: 'success',
      data: tour,
    }); */
  } catch (err) {
    res.status(400).json({ status: 'Error with ID', message: err.message });
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

export const updateTour = (req, res) => {
  /// Getting tour information

  res.status(202).json({ satus: 'success' });
};

export const deleteTour = (req, res) => {
  const id = +req.params.id;

  console.log(id);

  if (id) {
    res.status(204).json({ satus: 'success', data: 'Tour was deleted' });
  }
  if (!deleteTour) {
    res.status(404).json({ satus: 'error', message: 'Not found ID' });
  }
};
