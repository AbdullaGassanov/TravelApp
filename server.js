import { app } from './app.js';
import mongoose from 'mongoose';

// All Exception handler

process.on('uncaughtException', (err) => {
  console.log('Unhandled Exception ❌');
  console.log(err.name, err.message);
  process.exit(1); // Shutdown programm (Process)
});

// Global Error Handler For Rejection

process.on('unhandledRejection', (err) => {
  console.log(err);
  console.log('Unhandled rejection ⛔');
  server.close(() => {
    console.log('Closing server');
    process.exit(1); // Shutdown programm (Process)
  });
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then((con) => {
  console.log(`Connected to mongoose `);
  console.log(
    `Name of DataBase: ${con.connections[0].name}. Connection successful !`,
  );
});

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
