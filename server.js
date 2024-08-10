import { app } from './app.js';
import mongoose from 'mongoose';

try {
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
} catch (e) {
  console.log("Coudn't connect to Mongo Server");
}

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
