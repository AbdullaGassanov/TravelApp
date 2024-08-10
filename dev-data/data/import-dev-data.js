import mongoose from 'mongoose';
import fs from 'fs/promises';
import { Tour } from './../../models/tourModel.js';
import url from 'url';
import { configDotenv } from 'dotenv';
configDotenv();

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

console.log(DB);

mongoose.connect(DB).then(() => console.log(`Connected to mongoose `));

const tours = JSON.parse(
  await fs.readFile(`${__dirname}/tours-simple.json`, 'utf-8'),
);

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
