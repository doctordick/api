import fs from 'fs';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URL);
mongoose.connection.on('error', (err) => {
  console.log(err.stack);
});

fs.readdirSync(__dirname + '/../models').forEach((filename) => {
  if (filename.indexOf('.js') > -1) {
    // need to use Node's require to dynamically import these models
    require('../models/' + filename);
  }
});