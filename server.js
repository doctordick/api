import 'dotenv/config';
import './src/config/mongoose'

import express from 'express';
const app = express();

app.listen(8080, () => {
  console.log('Listening on port 8080.');
});
