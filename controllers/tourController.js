import fs from 'fs/promises';
import url from 'url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const data = JSON.parse(
  await fs.readFile(`${__dirname}/../dev-data/data/tours-simple.json`, {
    encoding: 'utf-8',
  })
);

export const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: data.length,
    requestTime: req.requestTime,
    data: {
      tours: data,
    },
  });
};

export const getTour = (req, res) => {
  const id = +req.params.id;

  const tour = data.find((el) => el.id == id);

  !tour
    ? res.status(404).json({ status: 'Error', message: 'Invalid ID' })
    : res.status(200).json({ status: 'success', data: { tour: tour } });
};

export const createTour = (req, res) => {
  let id = data[data.length - 1].id + 1;
  const newTour = Object.assign({ id }, req.body);

  data.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(data),
    (err) => {
      console.log(err.message);
    }
  );

  res.status(201).json({ status: 'success', data: { tour: newTour } });
};

export const updateTour = (req, res) => {
  /// Getting tour information

  const id = +req.params.id;
  const reqTour = req.body;

  /// Find tour by id

  const tour = data.find((el) => el.id === id);

  /// Check if tour not found

  if (!tour) {
    return res.status(404).json({ satus: 'error', message: 'Not found ID' });
  }

  /// Copy tour info from request and put it into the tour

  for (let [key, val] of Object.entries(reqTour)) {
    console.log(key, val);
    tour[key] = val;
  }

  console.log(data[tour.id]);

  data[tour.id] = tour;

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(data)
  );

  res.status(202).json({ satus: 'success', data: tour });
};

export const deleteTour = (req, res) => {
  const id = +req.params.id;

  console.log(id);

  const deleteTour = data.find((tour) => tour.id === id);

  console.log(deleteTour);

  if (deleteTour) {
    data.splice(deleteTour.id, 1);

    fs.writeFile(
      `${__dirname}/../dev-data/data/tours-simple.json`,
      JSON.stringify(data)
    );

    res.status(204).json({ satus: 'success', data: 'Tour was deleted' });
  }
  if (!deleteTour) {
    res.status(404).json({ satus: 'error', message: 'Not found ID' });
  }
};
