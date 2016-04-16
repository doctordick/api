import 'dotenv/config';
import './src/config/mongoose'
import express from 'express';
import routes from './src/controllers/index';
import bodyParser from 'body-parser'

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

routes(app);

app.listen(8080, () => {
  console.log('Listening on port 8080.');
});
